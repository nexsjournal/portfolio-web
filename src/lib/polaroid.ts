import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export const POLAROID_PHOTO_WIDTH = 1200;
export const POLAROID_PHOTO_HEIGHT = 900;

const IP_AVATAR_PATH = "/assets/hero/lex-aqua-avatar-v2.webp";
const MAX_INPUT_BYTES = 6 * 1024 * 1024;
const MAX_CAPTURE_EDGE = 1600;
const CLOUDFLARE_REFERENCE_EDGE = 480;
const ARK_REFERENCE_EDGE = 1280;
const GENERATION_TIMEOUT_MS = 50_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type PolaroidProviderId = "cloudflare" | "ark" | "mock";

export type PolaroidResult = {
  image: Buffer;
  provider: PolaroidProviderId;
};

export class PolaroidConfigError extends Error {
  readonly code = "not_configured";
}

const ZH_PROMPT = [
  "生成一张完整的 4:3 横版纪念合影，像一张朋友一起拍的拍立得。",
  "图一是 IP 形象参考：一个黑发、黑框眼镜、黑色内搭、半透明蓝色连帽外套的年轻男生，整体是光滑通透的 Aqua / 玻璃树脂质感的 3D 卡通风格。",
  "图二是真实摄像头照片。保留图二中每一个主体的可辨认身份和物种：如果主体是人，保留五官、发型、眼镜、肤色和服装；如果主体是猫、狗等宠物，保留毛色、斑纹、眼睛颜色、耳朵形状和体型，绝对不要把宠物变成人。",
  "去掉图二原来的背景、其他人或杂物。把图二中的主体转换成与图一完全一致的 3D 卡通风格：光滑树脂质感、清晰柔和高光、浅蓝色渐变摄影棚背景、干净的轮廓和轻微投影。",
  "让 IP 形象和图二的主体并肩出现在镜头前；IP 形象在左，真实主体在右。如果图二有两只宠物，要把两只都完整展示出来；IP 形象可以蹲在旁边或抱着它们，保持宠物原本的物种特征。",
  "只输出一张统一渲染的合影，不要文字、水印、边框、拼贴、分屏，也不要重复的主体。",
].join("");

const EN_PROMPT = [
  "Create one cohesive 4:3 landscape souvenir photo, like a Polaroid taken by friends.",
  "Image 0 is the IP character reference: a young man with spiky black hair, black rectangular glasses, a black tee, and a translucent blue hooded jacket, rendered in a glossy Aqua / glass-resin 3D cartoon style.",
  "Image 1 is a real webcam photo. Preserve the recognizable identity and species of every main subject in Image 1. If the subject is a person, keep their face, hairstyle, glasses, skin tone, and clothing. If the subject is a pet such as a cat or dog, keep its fur color, markings, eye color, ear shape, and body proportions. Never turn a pet into a human.",
  "Remove the original background, other people, and clutter. Restyle each subject from Image 1 into the same glossy 3D cartoon style as Image 0, with smooth resin-like surfaces, soft studio highlights, a light blue gradient studio background, and a subtle shadow.",
  "Place the IP character and the subject or subjects together, facing the camera, with comfortable margins. The IP character is on the left and the real subject or subjects on the right. If there are two pets, show both clearly; the IP character can kneel beside or hold them.",
  "Output one cohesive rendered image only. No text, watermark, border, collage, split screen, or duplicated subjects.",
].join(" ");

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
let avatarCache: Promise<Buffer> | undefined;

export function resolvePolaroidProvider(): PolaroidProviderId | null {
  const explicit = process.env.POLAROID_PROVIDER?.trim().toLowerCase();
  if (explicit === "mock" || explicit === "cloudflare" || explicit === "ark") return explicit;
  if (process.env.CLOUDFLARE_ACCOUNT_ID?.trim() && process.env.CLOUDFLARE_API_TOKEN?.trim()) {
    return "cloudflare";
  }
  if (process.env.ARK_API_KEY?.trim()) return "ark";
  return null;
}

export function checkPolaroidRateLimit(key: string) {
  const limit = Math.max(1, Number(process.env.POLAROID_RATE_LIMIT ?? 4));
  const now = Date.now();

  for (const [bucketKey, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
  }

  const bucket = rateBuckets.get(key);
  if (!bucket) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true as const, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false as const,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true as const, remaining: limit - bucket.count };
}

export async function generatePolaroidPhoto(capturedPhoto: Buffer, origin: string): Promise<PolaroidResult> {
  const provider = resolvePolaroidProvider();
  if (!provider) {
    throw new PolaroidConfigError("Polaroid photo generation is not configured.");
  }

  if (capturedPhoto.byteLength > MAX_INPUT_BYTES) {
    throw new Error("CAPTURE_TOO_LARGE");
  }

  const normalizedPhoto = await normalizeCapture(capturedPhoto);

  if (provider === "mock") {
    return { image: await generateMockImage(normalizedPhoto, origin), provider };
  }

  if (provider === "ark") {
    return { image: await generateWithArk(normalizedPhoto, origin), provider };
  }

  return { image: await generateWithCloudflare(normalizedPhoto, origin), provider };
}

async function normalizeCapture(input: Buffer) {
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(MAX_CAPTURE_EDGE, MAX_CAPTURE_EDGE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

async function prepareReference(input: Buffer, edge: number) {
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

async function loadIpAvatar(origin: string) {
  avatarCache ??= (async () => {
    try {
      const url = new URL(IP_AVATAR_PATH, origin);
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
    } catch {
      // Fall back to the deployed public file when the origin is not reachable.
    }

    return readFile(path.join(process.cwd(), "public", IP_AVATAR_PATH));
  })();

  return avatarCache;
}

async function finalizeImage(input: Buffer) {
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(POLAROID_PHOTO_WIDTH, POLAROID_PHOTO_HEIGHT, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

async function generateWithCloudflare(photo: Buffer, origin: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !token) {
    throw new PolaroidConfigError("Cloudflare Workers AI is missing credentials.");
  }

  const model = process.env.CLOUDFLARE_IMAGE_MODEL?.trim() || "@cf/black-forest-labs/flux-2-klein-9b";
  const [avatar, selfie] = await Promise.all([
    loadIpAvatar(origin).then((buffer) => prepareReference(buffer, CLOUDFLARE_REFERENCE_EDGE)),
    prepareReference(photo, CLOUDFLARE_REFERENCE_EDGE),
  ]);

  const form = new FormData();
  form.append("prompt", EN_PROMPT);
  form.append("input_image_0", new Blob([new Uint8Array(avatar)], { type: "image/jpeg" }), "ip-avatar.jpg");
  form.append("input_image_1", new Blob([new Uint8Array(selfie)], { type: "image/jpeg" }), "selfie.jpg");
  form.append("width", "1024");
  form.append("height", "768");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(GENERATION_TIMEOUT_MS),
    },
  );

  const payload = await response.json().catch(() => null) as {
    success?: boolean;
    result?: { image?: string } | string;
    errors?: Array<{ message?: string }>;
  } | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.errors?.[0]?.message || `Cloudflare Workers AI returned ${response.status}.`);
  }

  const rawImage = typeof payload?.result === "string" ? payload.result : payload?.result?.image;
  if (!rawImage) throw new Error("Cloudflare Workers AI returned no image.");

  return finalizeImage(decodeBase64Image(rawImage));
}

async function generateWithArk(photo: Buffer, origin: string) {
  const apiKey = process.env.ARK_API_KEY?.trim();
  if (!apiKey) throw new PolaroidConfigError("Volcengine Ark is missing an API key.");

  const model = process.env.ARK_IMAGE_MODEL?.trim() || "doubao-seedream-4-0-250828";
  const size = process.env.ARK_IMAGE_SIZE?.trim() || "2048x1536";
  const [avatar, selfie] = await Promise.all([
    loadIpAvatar(origin).then((buffer) => prepareReference(buffer, ARK_REFERENCE_EDGE)),
    prepareReference(photo, ARK_REFERENCE_EDGE),
  ]);

  const response = await fetch(process.env.ARK_API_URL?.trim() || "https://ark.cn-beijing.volces.com/api/v3/images/generations", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: ZH_PROMPT,
      image: [toDataUrl(avatar), toDataUrl(selfie)],
      size,
      response_format: "b64_json",
      watermark: false,
      sequential_image_generation: "disabled",
    }),
    signal: AbortSignal.timeout(GENERATION_TIMEOUT_MS),
  });

  const payload = await response.json().catch(() => null) as {
    data?: Array<{ b64_json?: string; url?: string }>;
    error?: { message?: string };
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || `Volcengine Ark returned ${response.status}.`);
  }

  const item = payload?.data?.[0];
  if (item?.b64_json) return finalizeImage(decodeBase64Image(item.b64_json));

  if (item?.url) {
    const imageResponse = await fetch(item.url, { signal: AbortSignal.timeout(30_000) });
    if (!imageResponse.ok) throw new Error("Volcengine Ark returned an unreadable image URL.");
    return finalizeImage(Buffer.from(await imageResponse.arrayBuffer()));
  }

  throw new Error("Volcengine Ark returned no image.");
}

async function generateMockImage(photo: Buffer, origin: string) {
  const [avatar, selfie] = await Promise.all([
    loadIpAvatar(origin).then((buffer) => sharp(buffer).resize(360, 360, { fit: "cover" }).png().toBuffer()),
    sharp(photo).resize(560, 420, { fit: "cover" }).png().toBuffer(),
  ]);

  const avatarFrame = await sharp(avatar)
    .extend({ top: 14, bottom: 14, left: 14, right: 14, background: "#fffdf6" })
    .png()
    .toBuffer();
  const selfieFrame = await sharp(selfie)
    .extend({ top: 14, bottom: 52, left: 14, right: 14, background: "#fffdf6" })
    .png()
    .toBuffer();

  const background = Buffer.from(`
    <svg width="${POLAROID_PHOTO_WIDTH}" height="${POLAROID_PHOTO_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d8efff"/>
          <stop offset=".55" stop-color="#edf8ff"/>
          <stop offset="1" stop-color="#cfe7f5"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#sky)"/>
      <circle cx="960" cy="150" r="220" fill="#ffffff" opacity=".28"/>
      <circle cx="220" cy="760" r="260" fill="#a8d8ee" opacity=".2"/>
      <text x="600" y="118" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="700" letter-spacing="6" fill="#2d6078" opacity=".7">POLAROID MOCK</text>
      <text x="600" y="824" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="600" letter-spacing="2" fill="#2d6078" opacity=".62">LOCAL PREVIEW · NOT AI GENERATED</text>
    </svg>
  `);

  return sharp(background)
    .composite([
      { input: avatarFrame, left: 118, top: 230 },
      { input: selfieFrame, left: 520, top: 200 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

function toDataUrl(buffer: Buffer) {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

function decodeBase64Image(value: string) {
  const payload = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const image = Buffer.from(payload, "base64");
  if (image.byteLength < 1024) throw new Error("Generated image is empty.");
  return image;
}

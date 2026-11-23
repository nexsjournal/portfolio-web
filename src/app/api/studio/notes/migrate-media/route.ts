import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { getRemoteNoteBySlug, saveRemoteNote, uploadNoteAsset } from "@/content/remote-notes";
import { optimizeImageBytes, replaceImageExtension } from "@/lib/image-optimize";
import { isWechatImage } from "@/lib/media";
import { hasStudioSession } from "@/lib/studio-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_IMAGES = 24;

function findWechatImages(content: string) {
  const urls = content.match(/https?:\/\/[^\s)"'<>\\]+/g) ?? [];
  return [...new Set(urls.filter((url) => isWechatImage(url)))].slice(0, MAX_IMAGES);
}

async function mirrorImage(slug: string, url: string) {
  const response = await fetch(url.replaceAll("&amp;", "&"), {
    headers: { "user-agent": USER_AGENT, referer: "https://mp.weixin.qq.com/" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (!contentType.startsWith("image/")) throw new Error("不是图片");

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error("图片过大");

  const optimized = await optimizeImageBytes(bytes, contentType);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  const uploaded = await uploadNoteAsset(
    slug,
    replaceImageExtension(`media-${hash}.${contentType.split("/")[1] ?? "jpg"}`, optimized.extension),
    optimized.bytes,
    optimized.contentType,
  );

  return { url: uploaded.url, savedBytes: bytes.byteLength - optimized.bytes.byteLength };
}

export async function POST(request: NextRequest) {
  if (!hasStudioSession(request)) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { slug?: unknown } | null;
  const slug = typeof body?.slug === "string" ? body.slug : "";
  if (!slug) return NextResponse.json({ error: "缺少文章地址。" }, { status: 400 });

  const note = await getRemoteNoteBySlug(slug);
  if (!note) return NextResponse.json({ error: "文章不存在。" }, { status: 404 });

  const images = findWechatImages(note.content);
  if (!images.length) {
    return NextResponse.json({ ok: true, slug, images: 0, failed: 0, savedBytes: 0 });
  }

  const replacements = new Map<string, string>();
  let failed = 0;
  let savedBytes = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < images.length) {
      const url = images[cursor];
      cursor += 1;
      try {
        const mirrored = await mirrorImage(slug, url);
        replacements.set(url, mirrored.url);
        savedBytes += mirrored.savedBytes;
      } catch {
        failed += 1;
      }
    }
  }

  await Promise.all([worker(), worker()]);
  if (!replacements.size) {
    return NextResponse.json({ ok: true, slug, images: 0, failed, savedBytes: 0 });
  }

  let content = note.content;
  for (const [source, target] of replacements) {
    content = content.split(source).join(target);
    content = content.split(source.replaceAll("&", "&amp;")).join(target);
  }

  await saveRemoteNote({
    ...note,
    content,
    assets: [...new Set([...note.assets, ...replacements.values()])],
    updatedAt: new Date().toISOString(),
  });

  revalidateTag("remote-notes", "max");
  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);

  return NextResponse.json({
    ok: true,
    slug,
    images: replacements.size,
    failed,
    savedBytes,
  });
}

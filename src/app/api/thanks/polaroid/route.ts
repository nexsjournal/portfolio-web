import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import {
  PolaroidConfigError,
  PolaroidQuotaError,
  checkPolaroidRateLimit,
  generatePolaroidPhoto,
  resolvePolaroidProvider,
} from "@/lib/polaroid";
import { savePolaroidPhoto } from "@/lib/polaroid-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp"]);

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) {
        return NextResponse.json({ error: "请求来源无效。", code: "invalid_origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "请求来源无效。", code: "invalid_origin" }, { status: 403 });
    }
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";

  if (!resolvePolaroidProvider()) {
    return NextResponse.json(
      { error: "合影冲洗服务还没有配置。", code: "not_configured" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }

  const rate = checkPolaroidRateLimit(clientKey);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "拍立得冲洗得太快啦，过几分钟再试。", code: "rate_limited" },
      { status: 429, headers: { "retry-after": String(rate.retryAfter), "cache-control": "no-store" } },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return NextResponse.json({ error: "请上传一张照片。", code: "invalid_content_type" }, { status: 415 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "照片读取失败，请重新拍一张。", code: "invalid_form" }, { status: 400 });
  }

  const photo = form.get("photo");
  if (!photo || typeof photo === "string" || photo.size === 0) {
    return NextResponse.json({ error: "没有收到照片。", code: "missing_photo" }, { status: 400 });
  }

  if (photo.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "照片太大了。", code: "photo_too_large" }, { status: 413 });
  }

  const input = Buffer.from(await photo.arrayBuffer());
  const saveToGallery = form.get("save") === "1";

  try {
    const metadata = await sharp(input, { failOn: "none" }).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 240 || metadata.height < 180) {
      return NextResponse.json({ error: "照片尺寸太小，请重新拍一张。", code: "photo_too_small" }, { status: 400 });
    }
    if (!metadata.format || !ACCEPTED_FORMATS.has(metadata.format)) {
      return NextResponse.json({ error: "暂不支持这种图片格式。", code: "unsupported_photo" }, { status: 415 });
    }
  } catch {
    return NextResponse.json({ error: "照片无法识别，请重新拍一张。", code: "invalid_photo" }, { status: 400 });
  }

  try {
    const result = await generatePolaroidPhoto(input, request.nextUrl.origin);
    let savedToGallery = false;

    if (saveToGallery) {
      try {
        savedToGallery = Boolean(await savePolaroidPhoto(result.image));
      } catch (error) {
        console.error("[polaroid-gallery]", error instanceof Error ? error.message : "Unknown save error");
      }
    }

    return new NextResponse(new Uint8Array(result.image), {
      status: 200,
      headers: {
        "content-type": "image/jpeg",
        "content-length": String(result.image.byteLength),
        "cache-control": "no-store, max-age=0",
        "x-content-type-options": "nosniff",
        "x-polaroid-provider": result.provider,
        "x-polaroid-saved": savedToGallery ? "1" : "0",
      },
    });
  } catch (error) {
    if (error instanceof PolaroidQuotaError) {
      const now = new Date();
      const reset = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
      const retryAfter = Math.max(60, Math.ceil((reset - now.getTime()) / 1000));
      return NextResponse.json(
        { error: "今天额度用完了，08:00 后再来。", code: "quota_exhausted" },
        { status: 429, headers: { "retry-after": String(retryAfter), "cache-control": "no-store" } },
      );
    }

    if (error instanceof PolaroidConfigError) {
      return NextResponse.json(
        { error: "合影冲洗服务还没有配置。", code: "not_configured" },
        { status: 503, headers: { "cache-control": "no-store" } },
      );
    }

    console.error("[polaroid]", error instanceof Error ? error.message : "Unknown generation error");
    return NextResponse.json(
      { error: "这次照片没有洗出来，再按一次快门试试。", code: "generation_failed" },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }
}

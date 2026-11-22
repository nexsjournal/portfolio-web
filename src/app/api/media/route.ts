import { NextRequest, NextResponse } from "next/server";

import { isWechatImage } from "@/lib/media";

export const runtime = "nodejs";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (!source || !isWechatImage(source)) {
    return NextResponse.json({ error: "不支持的图片地址。" }, { status: 400 });
  }

  try {
    const response = await fetch(source, {
      headers: {
        "user-agent": USER_AGENT,
        referer: "https://mp.weixin.qq.com/",
      },
      next: { revalidate: 60 * 60 * 24 * 365 },
      signal: AbortSignal.timeout(15000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return NextResponse.json({ error: "图片获取失败。" }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
        "referrer-policy": "no-referrer",
      },
    });
  } catch {
    return NextResponse.json({ error: "图片获取失败。" }, { status: 502 });
  }
}

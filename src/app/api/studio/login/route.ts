import { NextRequest, NextResponse } from "next/server";

import {
  createStudioSession,
  STUDIO_COOKIE,
  studioConfigured,
  studioCookieOptions,
  verifyStudioPassword,
} from "@/lib/studio-auth";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(request: NextRequest) {
  if (!studioConfigured()) {
    return NextResponse.json({ error: "后台尚未配置管理员密码。" }, { status: 503 });
  }

  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= 8) {
    return NextResponse.json({ error: "尝试次数过多，请稍后再试。" }, { status: 429 });
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyStudioPassword(password)) {
    attempts.set(key, {
      count: current && current.resetAt > now ? current.count + 1 : 1,
      resetAt: current && current.resetAt > now ? current.resetAt : now + 10 * 60 * 1000,
    });
    return NextResponse.json({ error: "密码不正确。" }, { status: 401 });
  }

  attempts.delete(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE, createStudioSession(), studioCookieOptions());
  return response;
}

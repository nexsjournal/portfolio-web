import { NextResponse } from "next/server";

import { STUDIO_COOKIE } from "@/lib/studio-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

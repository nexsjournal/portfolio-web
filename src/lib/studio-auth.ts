import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const STUDIO_COOKIE = "lex-studio-session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function password() {
  return process.env.STUDIO_PASSWORD?.trim() ?? "";
}

function sessionSecret() {
  return process.env.STUDIO_SESSION_SECRET?.trim() ?? "";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function studioConfigured() {
  return Boolean(password() && sessionSecret());
}

export function verifyStudioPassword(value: string) {
  const expected = password();
  if (!expected || !value) return false;
  return timingSafeEqual(digest(expected), digest(value));
}

export function createStudioSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyStudioSession(token?: string | null) {
  if (!token || !studioConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(parts[2]);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

  const expiresAt = Number(parts[1]);
  return Number.isFinite(expiresAt) && expiresAt > Math.floor(Date.now() / 1000);
}

export function hasStudioSession(request: NextRequest) {
  return verifyStudioSession(request.cookies.get(STUDIO_COOKIE)?.value);
}

export function studioCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

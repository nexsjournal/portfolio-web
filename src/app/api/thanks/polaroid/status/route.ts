import { NextResponse } from "next/server";

import { getPolaroidQuotaStatus } from "@/lib/polaroid-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getPolaroidQuotaStatus();
  const now = Date.now();

  if (!status || status.resetAt <= now) {
    return NextResponse.json(
      { exhausted: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      exhausted: true,
      resetAt: status.resetAt,
      retryAfter: Math.ceil((status.resetAt - now) / 1000),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

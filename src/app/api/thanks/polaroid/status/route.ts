import { NextResponse } from "next/server";

import { getWorkersAiQuotaResetAt } from "@/lib/cloudflare-usage";
import { getPolaroidQuotaStatus, savePolaroidQuotaStatus } from "@/lib/polaroid-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const status = await getPolaroidQuotaStatus();
  let resetAt = status && status.resetAt > now ? status.resetAt : null;

  if (!resetAt) {
    const computedResetAt = await getWorkersAiQuotaResetAt(now).catch(() => null);
    if (computedResetAt && computedResetAt > now) {
      resetAt = computedResetAt;
      await savePolaroidQuotaStatus(computedResetAt).catch((error) => {
        console.error(
          "[polaroid-quota]",
          error instanceof Error ? error.message : "Unknown quota status error",
        );
      });
    }
  }

  if (!resetAt) {
    return NextResponse.json(
      { exhausted: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      exhausted: true,
      resetAt,
      retryAfter: Math.ceil((resetAt - now) / 1000),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

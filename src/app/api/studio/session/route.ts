import { NextRequest, NextResponse } from "next/server";

import { hasStudioSession, studioConfigured, studioUsername } from "@/lib/studio-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    configured: studioConfigured(),
    authenticated: hasStudioSession(request),
    user: studioUsername(),
  });
}

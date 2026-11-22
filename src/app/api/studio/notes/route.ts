import { NextRequest, NextResponse } from "next/server";

import { getRemoteNoteSummaries } from "@/content/remote-notes";
import { hasStudioSession } from "@/lib/studio-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasStudioSession(request)) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }
  return NextResponse.json({ notes: await getRemoteNoteSummaries() });
}

import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { localPolaroidFilePath } from "@/lib/polaroid-gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const file = localPolaroidFilePath(path);
  if (!file) return new NextResponse("Not found", { status: 404 });

  try {
    const image = await readFile(file);
    return new NextResponse(new Uint8Array(image), {
      headers: {
        "content-type": "image/jpeg",
        "content-length": String(image.byteLength),
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

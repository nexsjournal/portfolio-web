import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { deleteRemoteNote } from "@/content/remote-notes";
import { hasStudioSession } from "@/lib/studio-auth";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasStudioSession(request)) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deleteRemoteNote(slug);
  if (!deleted) return NextResponse.json({ error: "文章不存在。" }, { status: 404 });

  revalidatePath("/notes");
  revalidatePath(`/notes/${slug}`);
  return NextResponse.json({ ok: true });
}

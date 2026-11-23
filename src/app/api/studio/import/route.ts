import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  deleteRemoteAssets,
  getRemoteNoteBySlug,
  saveRemoteNote,
  uploadNoteAsset,
  type StoredNote,
} from "@/content/remote-notes";
import { applyImageUrls, parseArticle, type ImportMode } from "@/lib/article-import";
import { optimizeImageBytes, replaceImageExtension } from "@/lib/image-optimize";
import { hasStudioSession } from "@/lib/studio-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

function removeImage(markdown: string, marker: string) {
  return markdown.replace(new RegExp(`!\\[[^\\]]*\\]\\(${marker}\\)`, "g"), "");
}

export async function POST(request: NextRequest) {
  if (!hasStudioSession(request)) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "粘贴内容过大，请控制在 8MB 以内。" }, { status: 413 });
  }

  const body = await request.json().catch(() => null) as {
    mode?: ImportMode;
    value?: unknown;
    type?: unknown;
    tags?: unknown;
    canonicalSelf?: unknown;
    imageMode?: unknown;
  } | null;
  const mode = body?.mode === "html" || body?.mode === "text" ? body.mode : "url";
  const value = typeof body?.value === "string" ? body.value : "";
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  try {
    const parsed = await parseArticle({
      mode,
      value,
      type: typeof body?.type === "string" ? body.type : undefined,
      tags,
      canonicalSelf: body?.canonicalSelf === true,
      imageMode: body?.imageMode === "link" ? "link" : "upload",
    });
    const assets: string[] = [];
    const imageUrls = new Map<string, string>();

    for (const image of parsed.images) {
      try {
        const optimized = await optimizeImageBytes(image.bytes, image.contentType);
        const uploaded = await uploadNoteAsset(
          parsed.slug,
          replaceImageExtension(image.fileName, optimized.extension),
          optimized.bytes,
          optimized.contentType,
        );
        imageUrls.set(image.marker, uploaded.url);
        assets.push(uploaded.url);
      } catch {
        parsed.markdown = removeImage(parsed.markdown, image.marker);
      }
    }

    let coverUrl = parsed.coverUrl;
    if (parsed.cover) {
      try {
        const optimized = await optimizeImageBytes(parsed.cover.bytes, parsed.cover.contentType);
        const uploaded = await uploadNoteAsset(
          parsed.slug,
          replaceImageExtension(parsed.cover.fileName, optimized.extension),
          optimized.bytes,
          optimized.contentType,
        );
        coverUrl = uploaded.url;
        assets.push(uploaded.url);
      } catch {
        /* cover is optional */
      }
    }

    const now = new Date().toISOString();
    const existing = await getRemoteNoteBySlug(parsed.slug);
    const note: StoredNote = {
      slug: parsed.slug,
      title: parsed.title,
      date: parsed.date,
      type: parsed.type,
      tags: parsed.tags,
      excerpt: parsed.excerpt,
      cover: coverUrl,
      sourceUrl: parsed.sourceUrl,
      sourceLabel: parsed.sourceLabel,
      canonical: parsed.canonical,
      lang: "zh",
      content: applyImageUrls(parsed.markdown, imageUrls),
      assets,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    const summary = await saveRemoteNote(note);
    if (existing?.assets.length) {
      await deleteRemoteAssets(existing.assets.filter((url) => !assets.includes(url))).catch(() => {});
    }
    revalidateTag("remote-notes", "max");
    revalidatePath("/notes");
    revalidatePath(`/notes/${note.slug}`);

    return NextResponse.json({
      ok: true,
      slug: note.slug,
      title: note.title,
      url: `/notes/${note.slug}`,
      images: parsed.images.length,
      summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "解析失败。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

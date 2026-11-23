import { unstable_cache } from "next/cache";
import { del, get, list, put } from "@vercel/blob";

import { getAllNotes, type Note, type NoteSummary } from "@/content/notes";

const POST_PREFIX = "notes/posts";
const NOTES_CACHE_TAG = "remote-notes";

export type StoredNote = Note & {
  assets: string[];
  createdAt: string;
  updatedAt: string;
};

export function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN
    || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

async function readBlobJson<T>(urlOrPathname: string): Promise<T> {
  const result = await get(urlOrPathname, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) throw new Error("Blob 内容不可用");
  return new Response(result.stream).json() as Promise<T>;
}

function summaryFromNote(note: StoredNote): NoteSummary {
  return {
    slug: note.slug,
    title: note.title,
    date: note.date,
    publishedAt: note.createdAt,
    type: note.type,
    tags: note.tags,
    excerpt: note.excerpt,
    cover: note.cover,
    sourceUrl: note.sourceUrl,
    sourceLabel: note.sourceLabel,
    lang: note.lang,
    canonical: note.canonical,
  };
}

function noteTimestamp(note: NoteSummary) {
  return Date.parse(note.publishedAt ?? `${note.date}T00:00:00+08:00`) || 0;
}

const readRemoteNoteSummaries = unstable_cache(
  async (): Promise<NoteSummary[]> => {
    if (!blobConfigured()) return [];
    return (await getAllRemoteNotes())
      .map(summaryFromNote)
      .sort((a, b) => noteTimestamp(b) - noteTimestamp(a));
  },
  ["remote-note-summaries"],
  { tags: [NOTES_CACHE_TAG], revalidate: 300 },
);

export async function getRemoteNoteSummaries() {
  return readRemoteNoteSummaries();
}

export async function getAllRemoteNotes(): Promise<StoredNote[]> {
  if (!blobConfigured()) return [];
  const result = await list({ prefix: `${POST_PREFIX}/`, limit: 1000 });
  const notes = await Promise.all(
    result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map((blob) => readBlobJson<StoredNote>(blob.url).catch(() => null)),
  );
  return notes.filter((note): note is StoredNote => note !== null);
}

export async function getRemoteNoteBySlug(slug: string): Promise<StoredNote | undefined> {
  if (!blobConfigured()) return undefined;
  try {
    return await readBlobJson<StoredNote>(`${POST_PREFIX}/${slug}.json`);
  } catch {
    return undefined;
  }
}

export async function getAllNotesWithRemote() {
  const local = getAllNotes();
  const remote = await getRemoteNoteSummaries();
  const seen = new Set(remote.map((note) => note.slug));
  const localNotes = local.filter((note) => !seen.has(note.slug));

  return [
    ...remote.map((note) => ({ ...note, content: "" })),
    ...localNotes,
  ].sort((a, b) => noteTimestamp(b) - noteTimestamp(a));
}

export async function getNoteWithRemoteBySlug(slug: string) {
  return (await getRemoteNoteBySlug(slug)) ?? getAllNotes().find((note) => note.slug === slug);
}

export async function uploadNoteAsset(
  slug: string,
  fileName: string,
  data: Uint8Array,
  contentType: string,
) {
  return put(`notes/assets/${slug}/${Date.now()}-${fileName}`, Buffer.from(data), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    contentType,
  });
}

export async function saveRemoteNote(note: StoredNote) {
  const pathname = `${POST_PREFIX}/${note.slug}.json`;
  const result = await put(pathname, JSON.stringify(note), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  return { ...summaryFromNote(note), url: result.url };
}

export async function deleteRemoteNote(slug: string) {
  const note = await getRemoteNoteBySlug(slug);
  if (!note) return false;

  await del([`${POST_PREFIX}/${slug}.json`, ...note.assets]);
  return true;
}

export async function deleteRemoteAssets(urls: string[]) {
  if (!urls.length) return;
  await del(urls);
}

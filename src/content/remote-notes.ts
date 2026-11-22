import { del, get, put } from "@vercel/blob";

import { getAllNotes, type Note, type NoteSummary } from "@/content/notes";

const MANIFEST_PATH = "notes/index.json";
const POST_PREFIX = "notes/posts";

type ManifestNote = NoteSummary & {
  url: string;
  updatedAt: string;
};

type Manifest = {
  version: 1;
  updatedAt: string;
  notes: ManifestNote[];
};

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

async function readManifest(): Promise<Manifest> {
  if (!blobConfigured()) return { version: 1, updatedAt: "", notes: [] };

  try {
    const manifest = await readBlobJson<Manifest>(MANIFEST_PATH);
    return {
      version: 1,
      updatedAt: typeof manifest.updatedAt === "string" ? manifest.updatedAt : "",
      notes: Array.isArray(manifest.notes) ? manifest.notes : [],
    };
  } catch {
    return { version: 1, updatedAt: "", notes: [] };
  }
}

function summaryFromManifest(note: ManifestNote): NoteSummary {
  return {
    slug: note.slug,
    title: note.title,
    date: note.date,
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

export async function getRemoteNoteSummaries() {
  return (await readManifest()).notes.map(summaryFromManifest);
}

export async function getRemoteNoteBySlug(slug: string): Promise<StoredNote | undefined> {
  const item = (await readManifest()).notes.find((note) => note.slug === slug);
  if (!item) return undefined;

  try {
    return await readBlobJson<StoredNote>(item.url);
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
  ].sort((a, b) => b.date.localeCompare(a.date));
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
  const result = await put(`notes/assets/${slug}/${Date.now()}-${fileName}`, Buffer.from(data), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    contentType,
  });
  return result;
}

export async function saveRemoteNote(note: StoredNote) {
  const manifest = await readManifest();
  const postPath = `${POST_PREFIX}/${note.slug}.json`;
  const post = await put(postPath, JSON.stringify(note), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });

  const summary = summaryFromManifest({ ...note, url: post.url, updatedAt: note.updatedAt });
  const nextManifest: Manifest = {
    version: 1,
    updatedAt: note.updatedAt,
    notes: [
      ...manifest.notes.filter((item) => item.slug !== note.slug),
      { ...summary, url: post.url, updatedAt: note.updatedAt },
    ].sort((a, b) => b.date.localeCompare(a.date)),
  };

  await put(MANIFEST_PATH, JSON.stringify(nextManifest), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  return summary;
}

export async function deleteRemoteNote(slug: string) {
  const manifest = await readManifest();
  const item = manifest.notes.find((note) => note.slug === slug);
  if (!item) return false;

  const stored = await getRemoteNoteBySlug(slug);
  const urls = [item.url, ...(stored?.assets ?? [])];
  if (urls.length) await del(urls);

  const nextManifest: Manifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    notes: manifest.notes.filter((note) => note.slug !== slug),
  };
  await put(MANIFEST_PATH, JSON.stringify(nextManifest), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  return true;
}

export async function deleteRemoteAssets(urls: string[]) {
  if (!urls.length) return;
  await del(urls);
}

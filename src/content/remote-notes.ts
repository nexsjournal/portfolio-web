import { del, head, put } from "@vercel/blob";

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

let manifestUrl: string | null | undefined;

export function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN
    || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

async function resolveManifestUrl() {
  if (manifestUrl !== undefined) return manifestUrl;
  if (!blobConfigured()) {
    manifestUrl = null;
    return null;
  }

  try {
    manifestUrl = (await head(MANIFEST_PATH)).url;
  } catch {
    manifestUrl = null;
  }
  return manifestUrl;
}

async function fetchJson<T>(url: string): Promise<T> {
  const joiner = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${joiner}v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Blob 读取失败：HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

async function readManifest(): Promise<Manifest> {
  const url = await resolveManifestUrl();
  if (!url) return { version: 1, updatedAt: "", notes: [] };

  try {
    const manifest = await fetchJson<Manifest>(url);
    return {
      version: 1,
      updatedAt: typeof manifest.updatedAt === "string" ? manifest.updatedAt : "",
      notes: Array.isArray(manifest.notes) ? manifest.notes : [],
    };
  } catch {
    manifestUrl = undefined;
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
    return await fetchJson<StoredNote>(item.url);
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

  const saved = await put(MANIFEST_PATH, JSON.stringify(nextManifest), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  manifestUrl = saved.url;
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
  const saved = await put(MANIFEST_PATH, JSON.stringify(nextManifest), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  manifestUrl = saved.url;
  return true;
}

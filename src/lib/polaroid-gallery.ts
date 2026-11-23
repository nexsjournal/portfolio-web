import { list, put } from "@vercel/blob";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const GALLERY_PREFIX = "polaroids/";
const QUOTA_PATH = "polaroids/quota-status.json";
const LOCAL_GALLERY_ROOT = path.join(process.cwd(), ".data", "polaroids");
const LOCAL_GALLERY_URL = "/api/polaroids";

export type GalleryPhoto = {
  id: string;
  url: string;
  uploadedAt: string;
};

export function polaroidGalleryConfigured() {
  return blobConfigured() || localGalleryEnabled();
}

function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN
    || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

function localGalleryEnabled() {
  return !process.env.VERCEL && !blobConfigured();
}

export async function savePolaroidPhoto(image: Buffer) {
  const id = crypto.randomUUID();
  const day = new Date().toISOString().slice(0, 10);

  if (!blobConfigured()) {
    if (!localGalleryEnabled()) return null;

    const directory = path.join(LOCAL_GALLERY_ROOT, day);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${id}.jpg`), image);

    return {
      id: `${day}/${id}`,
      url: `${LOCAL_GALLERY_URL}/${day}/${id}.jpg`,
      uploadedAt: new Date().toISOString(),
    } satisfies GalleryPhoto;
  }

  const result = await put(`${GALLERY_PREFIX}${day}/${id}.jpg`, image, {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    contentType: "image/jpeg",
  });

  return {
    id: `${day}/${id}`,
    url: result.url,
    uploadedAt: new Date().toISOString(),
  } satisfies GalleryPhoto;
}

export async function listPolaroidPhotos(limit = 1000): Promise<GalleryPhoto[]> {
  if (!blobConfigured()) return localGalleryEnabled() ? listLocalPolaroidPhotos(limit) : [];

  try {
    const result = await list({ prefix: GALLERY_PREFIX, limit });
    return result.blobs
      .filter((blob) => blob.pathname.endsWith(".jpg"))
      .map((blob) => ({
        id: blob.pathname,
        url: blob.url,
        uploadedAt: new Date(blob.uploadedAt).toISOString(),
      }))
      .sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt));
  } catch (error) {
    console.error("[polaroid-gallery]", error instanceof Error ? error.message : "Unknown gallery error");
    return [];
  }
}

export type PolaroidQuotaStatus = {
  resetAt: number;
};

export async function savePolaroidQuotaStatus(resetAt: number) {
  if (!blobConfigured()) {
    if (!localGalleryEnabled()) return;
    await mkdir(LOCAL_GALLERY_ROOT, { recursive: true });
    await writeFile(
      path.join(LOCAL_GALLERY_ROOT, "quota-status.json"),
      JSON.stringify({ resetAt } satisfies PolaroidQuotaStatus),
    );
    return;
  }

  await put(QUOTA_PATH, JSON.stringify({ resetAt } satisfies PolaroidQuotaStatus), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function getPolaroidQuotaStatus(): Promise<PolaroidQuotaStatus | null> {
  if (!blobConfigured()) {
    if (!localGalleryEnabled()) return null;
    try {
      const raw = await readFile(path.join(LOCAL_GALLERY_ROOT, "quota-status.json"), "utf8");
      const parsed = JSON.parse(raw) as Partial<PolaroidQuotaStatus>;
      return typeof parsed.resetAt === "number" ? { resetAt: parsed.resetAt } : null;
    } catch {
      return null;
    }
  }

  try {
    const result = await list({ prefix: QUOTA_PATH, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === QUOTA_PATH);
    if (!blob) return null;
    const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return null;
    const parsed = await response.json() as Partial<PolaroidQuotaStatus>;
    return typeof parsed.resetAt === "number" ? { resetAt: parsed.resetAt } : null;
  } catch {
    return null;
  }
}

async function listLocalPolaroidPhotos(limit: number): Promise<GalleryPhoto[]> {
  try {
    const days = await readdir(LOCAL_GALLERY_ROOT, { withFileTypes: true });
    const photos: GalleryPhoto[] = [];

    for (const day of days) {
      if (!day.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/.test(day.name)) continue;
      const directory = path.join(LOCAL_GALLERY_ROOT, day.name);
      const files = await readdir(directory, { withFileTypes: true }).catch(() => []);

      for (const file of files) {
        if (!file.isFile() || !/^[a-f0-9-]{36}\.jpg$/.test(file.name)) continue;
        const info = await stat(path.join(directory, file.name)).catch(() => null);
        if (!info) continue;
        photos.push({
          id: `${day.name}/${file.name}`,
          url: `${LOCAL_GALLERY_URL}/${day.name}/${file.name}`,
          uploadedAt: info.mtime.toISOString(),
        });
      }
    }

    return photos
      .sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function localPolaroidFilePath(segments: string[]) {
  if (!localGalleryEnabled() || segments.length !== 2) return null;

  const [day, file] = segments;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^[a-f0-9-]{36}\.jpg$/.test(file)) return null;

  const root = path.resolve(LOCAL_GALLERY_ROOT);
  const resolved = path.resolve(LOCAL_GALLERY_ROOT, day, file);
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

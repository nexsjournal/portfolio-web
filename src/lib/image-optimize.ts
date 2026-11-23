import sharp from "sharp";

export type OptimizedImage = {
  bytes: Buffer;
  contentType: string;
  extension: string;
};

const OPTIMIZABLE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_STATIC_WIDTH = 1280;

function extensionFromContentType(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/svg+xml") return "svg";
  return "jpg";
}

function original(bytes: Uint8Array, contentType: string, extension: string): OptimizedImage {
  return { bytes: Buffer.from(bytes), contentType, extension };
}

export async function optimizeImageBytes(
  bytes: Uint8Array,
  contentType: string,
): Promise<OptimizedImage> {
  const fallbackExtension = extensionFromContentType(contentType);
  if (!OPTIMIZABLE_TYPES.has(contentType)) return original(bytes, contentType, fallbackExtension);

  try {
    const metadata = await sharp(bytes).metadata();
    const animated = contentType === "image/gif" || (metadata.pages ?? 1) > 1;
    const pipeline = sharp(bytes, { animated });
    const output = animated
      ? await pipeline.webp({ quality: 58, effort: 3 }).toBuffer()
      : await pipeline
          .rotate()
          .resize({ width: MAX_STATIC_WIDTH, withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();

    if (!output.byteLength || output.byteLength >= bytes.byteLength * 0.96) {
      return original(bytes, contentType, fallbackExtension);
    }

    return { bytes: output, contentType: "image/webp", extension: "webp" };
  } catch {
    return original(bytes, contentType, fallbackExtension);
  }
}

export function replaceImageExtension(fileName: string, extension: string) {
  return fileName.replace(/\.[a-z0-9]+$/i, "") + `.${extension}`;
}

import { createBrandOgImage, OG_IMAGE_SIZE } from "@/lib/og-brand-image";

export const runtime = "edge";

export const size = OG_IMAGE_SIZE;

export const contentType = "image/png";

export default function OpenGraphImage() {
  return createBrandOgImage();
}

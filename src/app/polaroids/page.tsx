import { PolaroidGallery } from "@/components/sections/polaroid-gallery";
import { listPolaroidPhotos, polaroidGalleryConfigured } from "@/lib/polaroid-gallery";
import { createPageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata = {
  ...createPageMetadata({
    path: "/polaroids",
    title: "合影墙｜Lex Ray",
    description: "在 Lex Ray 的感谢相机前拍下的 Aqua 风格合影，由访客主动选择公开。",
  }),
  robots: { index: false, follow: true },
};

export default async function PolaroidsPage() {
  const photos = await listPolaroidPhotos();
  return <PolaroidGallery photos={photos} storageConfigured={polaroidGalleryConfigured()} />;
}

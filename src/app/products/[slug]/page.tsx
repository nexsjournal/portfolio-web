import { notFound } from "next/navigation";

import { ProductDetailContent } from "@/components/sections/product-detail-content";
import { getProductBySlug } from "@/content/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.comingSoon) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}

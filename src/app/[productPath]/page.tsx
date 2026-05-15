import { notFound } from "next/navigation";

import { ProductDetailContent } from "@/components/sections/product-detail-content";
import { getProductByPath, getProductPathsForStaticGeneration } from "@/content/products";

type Props = {
  params: Promise<{ productPath: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProductPathsForStaticGeneration().map((productPath) => ({ productPath }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { productPath } = await params;
  const product = getProductByPath(productPath);

  if (!product || product.comingSoon) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}

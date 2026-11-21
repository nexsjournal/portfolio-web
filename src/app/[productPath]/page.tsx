import { notFound, permanentRedirect } from "next/navigation";

import { getCaseStudyByProductSlug } from "@/content/case-studies";
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

  const study = getCaseStudyByProductSlug(product.slug);
  permanentRedirect(study ? `/projects/${study.slug}` : "/projects");
}

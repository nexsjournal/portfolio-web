import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/sections/case-study-page";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { getProductBySlug } from "@/content/products";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = {
  params: Promise<{ caseSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ caseSlug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { caseSlug } = await params;
  const study = getCaseStudy(caseSlug);
  const product = study && getProductBySlug(study.productSlug);
  if (!study || !product) notFound();

  const name = product.nameEn && product.nameEn !== product.name
    ? `${product.name} ${product.nameEn}`
    : product.name;
  const screenshot = product.screenshots?.[0];

  return createPageMetadata({
    path: `/projects/${study.slug}`,
    title: `${name}：${study.seoTitle}｜Lex Ray`,
    description: product.summary,
    image: screenshot ? { url: screenshot, alt: `${name} 产品截图` } : undefined,
  });
}

function getTestCheckoutUrl() {
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  if (environment !== "development" && environment !== "preview") return undefined;

  const checkoutUrl = process.env.ARAY_STRIPE_TEST_PAYMENT_LINK?.trim();
  if (!checkoutUrl || !/^https:\/\/buy\.stripe\.com\/test_[A-Za-z0-9]+$/.test(checkoutUrl)) {
    return undefined;
  }

  return checkoutUrl;
}

export default async function CasePage({ params }: Props) {
  const { caseSlug } = await params;
  const study = getCaseStudy(caseSlug);
  if (!study) notFound();

  return (
    <CaseStudyPage
      study={study}
      testCheckoutUrl={study.productSlug === "aray-studio" ? getTestCheckoutUrl() : undefined}
    />
  );
}

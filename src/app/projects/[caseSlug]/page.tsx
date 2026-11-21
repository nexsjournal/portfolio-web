import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/sections/case-study-page";
import { caseStudies, getCaseStudy } from "@/content/case-studies";

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
  if (!study) return {};

  return {
    title: `${study.title.zh.replace("\n", " ")} · Lex Ray`,
    description: study.subtitle.zh,
    alternates: { canonical: `/projects/${study.slug}` },
  };
}

export default async function CasePage({ params }: Props) {
  const { caseSlug } = await params;
  const study = getCaseStudy(caseSlug);
  if (!study) notFound();

  return <CaseStudyPage study={study} />;
}

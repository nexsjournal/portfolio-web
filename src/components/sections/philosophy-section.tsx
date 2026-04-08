"use client";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { WobbleCard } from "@/components/ui/wobble-card";
import { FadeInBlock, FadeInTitle } from "@/components/ui/scroll-reveal";

const pointsZh: { title: string; body: string }[] = [
  {
    title: "只做自己会用的产品",
    body: "先说服自己，再谈上线。",
  },
  {
    title: "功能克制，但体验优先",
    body: "少即是多，交互要经得起日常。",
  },
  {
    title: "让记录更简单，而不是更复杂",
    body: "把路径缩短，把反馈说清楚。",
  },
];

const pointsEn: { title: string; body: string }[] = [
  {
    title: "Build what I’d use myself",
    body: "If it doesn’t convince me, it doesn’t ship.",
  },
  {
    title: "Fewer features, better feel",
    body: "Less noise; interactions that hold up daily.",
  },
  {
    title: "Make capturing easier, not heavier",
    body: "Shorter paths, clearer feedback.",
  },
];

export function PhilosophySection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const points = lang === "zh" ? pointsZh : pointsEn;

  return (
    <section id="philosophy" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <FadeInTitle className="section-title">{copy.sections.philosophy}</FadeInTitle>
          <FadeInBlock delay={0.12} className="mx-auto mt-5 max-w-2xl">
            <p className="text-sm leading-relaxed text-white/55">
              {copy.sections.philosophyDesc}
            </p>
          </FadeInBlock>
        </div>
        <FadeInBlock delay={0.08} className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <WobbleCard key={point.title} title={point.title} body={point.body} />
          ))}
        </FadeInBlock>
      </div>
    </section>
  );
}

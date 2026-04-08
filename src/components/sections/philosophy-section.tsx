"use client";

import { Compass, Layers3, Sparkles } from "lucide-react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { WobbleCard } from "@/components/ui/wobble-card";
import { FadeInBlock, FadeInTitle } from "@/components/ui/scroll-reveal";

/** 站点主题色（浅色/深色随变量切换） */
const THEME_PRIMARY = "var(--primary)";

const pointsZh: { title: string; body: string; imageSrc: string }[] = [
  {
    title: "只做自己会用的产品",
    body: "先说服自己，再谈上线。",
    imageSrc: "/assets/philosophy/01.png",
  },
  {
    title: "功能克制，但体验优先",
    body: "少即是多，交互要经得起日常。",
    imageSrc: "/assets/philosophy/02.png",
  },
  {
    title: "让记录更简单，而不是更复杂",
    body: "把路径缩短，把反馈说清楚。",
    imageSrc: "/assets/philosophy/03.png",
  },
];

const pointsEn: { title: string; body: string; imageSrc: string }[] = [
  {
    title: "Build what I’d use myself",
    body: "If it doesn’t convince me, it doesn’t ship.",
    imageSrc: "/assets/philosophy/01.png",
  },
  {
    title: "Fewer features, better feel",
    body: "Less noise; interactions that hold up daily.",
    imageSrc: "/assets/philosophy/02.png",
  },
  {
    title: "Make capturing easier, not heavier",
    body: "Shorter paths, clearer feedback.",
    imageSrc: "/assets/philosophy/03.png",
  },
];

export function PhilosophySection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const points = lang === "zh" ? pointsZh : pointsEn;
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="philosophy" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <FadeInTitle className="section-title">{copy.sections.philosophy}</FadeInTitle>
          <FadeInBlock delay={0.12} className="mx-auto mt-5 max-w-2xl">
            <p
              className={isLight ? "text-sm leading-relaxed text-slate-700/65" : "text-sm leading-relaxed text-white/55"}
            >
              {copy.sections.philosophyDesc}
            </p>
          </FadeInBlock>
        </div>
        <FadeInBlock delay={0.08} className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point, idx) => (
            <WobbleCard
              key={point.title}
              title={point.title}
              body={point.body}
              imageSrc={point.imageSrc}
              iconTint={THEME_PRIMARY}
              icon={
                idx === 0 ? (
                  <Compass className="h-5 w-5 text-primary" />
                ) : idx === 1 ? (
                  <Sparkles className="h-5 w-5 text-primary" />
                ) : (
                  <Layers3 className="h-5 w-5 text-primary" />
                )
              }
            />
          ))}
        </FadeInBlock>
      </div>
    </section>
  );
}

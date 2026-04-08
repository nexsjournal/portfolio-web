"use client";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { DotPattern } from "@/components/ui/dot-pattern";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen min-h-[100svh] flex-col overflow-hidden px-6 md:px-10"
    >
      <div className="absolute inset-0 bg-[#06080e]" aria-hidden />
      <DotPattern
        glow
        width={18}
        height={18}
        className={cn(
          "text-white/42",
          "[mask-image:radial-gradient(ellipse_780px_640px_at_50%_52%,white,transparent)]",
        )}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_28%,rgba(31,240,255,0.1),transparent_58%)]"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col justify-center pb-16 pt-[calc(0.75rem+3rem+1.25rem)] md:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <p className="rounded-full bg-[#1FF0FF] px-5 py-1.5 text-xs font-medium tracking-[0.22em] text-[#051016]">
            {copy.heroBadge}
          </p>
          <TextGenerateEffect
            key={lang}
            text={copy.heroTitle}
            className="mt-10 text-5xl font-semibold leading-[1.1] text-white md:mt-12 md:text-7xl md:leading-[1.08] lg:text-8xl"
          />
          <TextGenerateEffect
            key={`${lang}-sub`}
            as="p"
            splitBy="word"
            delayStep={0.012}
            text={copy.heroSub}
            className="mt-9 max-w-2xl text-base text-white/75 md:mt-10 md:text-lg"
          />
        </div>
      </div>
    </section>
  );
}

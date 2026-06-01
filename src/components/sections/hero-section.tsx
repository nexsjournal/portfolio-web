"use client";

import { useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { HeroEntrance } from "@/components/ui/hero-entrance";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const [gridPointer, setGridPointer] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleGridPointerMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setGridPointer({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [reduceMotion],
  );

  const handleGridPointerLeave = useCallback(() => {
    setGridPointer(null);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen min-h-[100svh] flex-col overflow-hidden px-6 md:px-10"
      onMouseMove={handleGridPointerMove}
      onMouseLeave={handleGridPointerLeave}
    >
      <div
        className={cn(
          "absolute inset-0",
          theme === "light" ? "bg-[#f5f5fb]" : "bg-[#06080e]",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "[mask-image:linear-gradient(to_bottom,black_0%,black_42%,rgba(0,0,0,0.55)_68%,transparent_100%)]",
        )}
        aria-hidden
      >
        <InteractiveGridPattern
          pointer={gridPointer}
          interactive={!reduceMotion}
          width={isLight ? 22 : 24}
          height={isLight ? 22 : 24}
          className={cn(
            isLight
              ? "[mask-image:radial-gradient(ellipse_78%_56%_at_50%_38%,black,transparent)]"
              : "[mask-image:radial-gradient(ellipse_74%_52%_at_50%_40%,black,transparent)]",
          )}
          linesClassName={cn(
            isLight ? "text-[#0b1220]/[0.048]" : "text-white/[0.055]",
          )}
          activeSquaresClassName={
            isLight
              ? "fill-[#2b7cff]/38 stroke-[#2b7cff]/90 stroke-[1.25] drop-shadow-[0_0_14px_rgba(43,124,255,0.65)]"
              : "fill-[#1ff0ff]/32 stroke-[#1ff0ff]/95 stroke-[1.25] drop-shadow-[0_0_16px_rgba(31,240,255,0.75)]"
          }
        />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-[radial-gradient(ellipse_95%_70%_at_50%_4%,rgba(43,124,255,0.14),transparent_58%)]"
            : "bg-[radial-gradient(ellipse_95%_70%_at_50%_4%,rgba(31,240,255,0.07),transparent_58%)]",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-[min(34vh,280px)]",
          isLight
            ? "bg-gradient-to-t from-[#f5f5fb] from-[12%] via-[#f5f5fb]/75 via-[48%] to-transparent"
            : "bg-gradient-to-t from-[#06080e] from-[12%] via-[#06080e]/80 via-[48%] to-transparent",
        )}
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col justify-center pb-16 pt-[calc(0.75rem+3rem+1.25rem)] md:pb-20">
        <HeroEntrance
          lang={lang}
          title={copy.heroTitle}
          subtitle={copy.heroSub}
          ctaLabel={copy.heroCta}
          isLight={isLight}
        />
      </div>
    </section>
  );
}

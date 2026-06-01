"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { NoiseBackground } from "@/components/ui/noise-background";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const ctaLabel = copy.heroCta;
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

  /** 与 TextGenerateEffect 节奏对齐：主副标题并行播完后稍晚再出按钮 */
  const ctaEntranceDelay = useMemo(() => {
    const titleLen = copy.heroTitle.length;
    const subParts = copy.heroSub.split(/(\s+)/);
    const titleStep = 0.03;
    const subStep = 0.012;
    const dur = 0.38;
    const titleEnd =
      titleLen > 0 ? (titleLen - 1) * titleStep + dur : 0;
    const subEnd =
      subParts.length > 0 ? (subParts.length - 1) * subStep + dur : 0;
    return Math.max(titleEnd, subEnd) + 0.12;
  }, [copy.heroTitle, copy.heroSub]);

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
          // 底部线性渐隐：网格在接近下一模块前逐渐消失
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
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <TextGenerateEffect
            key={lang}
            text={copy.heroTitle}
            className={cn(
              "mt-10 text-5xl font-semibold leading-[1.1] md:mt-12 md:text-7xl md:leading-[1.08] lg:text-8xl",
              isLight ? "text-[#0b1220]" : "text-white",
            )}
          />
          <TextGenerateEffect
            key={`${lang}-sub`}
            as="p"
            splitBy="word"
            delayStep={0.012}
            text={copy.heroSub}
            className={cn(
              "mt-9 max-w-2xl text-base md:mt-10 md:text-lg",
              isLight ? "text-[#0b1220]/75" : "text-white/75",
            )}
          />
          <div className="mt-12 flex justify-center md:mt-14">
            {/* 用 wrapper 统一 group：hover 到按钮任意区域都触发背景流动与文字动画 */}
            <motion.div
              key={lang}
              className="group/cta"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: ctaEntranceDelay,
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              <NoiseBackground
                containerClassName="w-fit rounded-full p-2"
                gradientColors={[
                  "rgb(31, 240, 255)", // 左：主色蓝青
                  "rgb(101, 238, 190)", // 过渡：薄荷青
                  "rgb(187, 255, 42)", // 右：青黄色辅助色
                ]}
                flowOnHover
              >
                <a
                  href="/#products"
                  className={cn(
                    "inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-10 py-3.5 text-base font-semibold text-black shadow-[0_22px_54px_-30px_rgba(0,0,0,0.55),0_2px_0_0_rgba(255,255,255,0.65)_inset] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] group-hover/cta:shadow-[0_26px_60px_-32px_rgba(0,0,0,0.7),0_2px_0_0_rgba(255,255,255,0.8)_inset]",
                    isLight ? "border border-slate-200/80" : "",
                  )}
                >
                  <span aria-label={ctaLabel}>
                    {ctaLabel.split("").map((ch, idx) => (
                      <span
                        key={idx}
                        className="inline-block transition-transform duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:-translate-x-2"
                        style={{ transitionDelay: `${idx * 12}ms` }}
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </span>
                </a>
              </NoiseBackground>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

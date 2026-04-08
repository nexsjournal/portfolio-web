"use client";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { DotPattern } from "@/components/ui/dot-pattern";
import { NoiseBackground } from "@/components/ui/noise-background";
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
          // dot 略微更明显，但仍保持克制（只提升一点对比与可见范围）
          "text-white/55",
          "[mask-image:radial-gradient(ellipse_900px_720px_at_50%_52%,white,transparent)]",
        )}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_4%,rgba(31,240,255,0.1),transparent_58%)]"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col justify-center pb-16 pt-[calc(0.75rem+3rem+1.25rem)] md:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
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
          <div className="mt-12 flex justify-center md:mt-14">
            {/* 用 wrapper 统一 group：hover 到按钮任意区域都触发背景流动与文字动画 */}
            <div className="group/cta">
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
                  className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-10 py-3.5 text-base font-semibold text-black shadow-[0_22px_54px_-30px_rgba(0,0,0,0.55),0_2px_0_0_rgba(255,255,255,0.65)_inset] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] group-hover/cta:shadow-[0_26px_60px_-32px_rgba(0,0,0,0.7),0_2px_0_0_rgba(255,255,255,0.8)_inset]"
                >
                  <span aria-label="查看产品 →">
                    {"查看产品 →".split("").map((ch, idx) => (
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

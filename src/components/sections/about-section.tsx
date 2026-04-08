"use client";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { FadeInBlock, FadeInTitle } from "@/components/ui/scroll-reveal";

export function AboutSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);

  return (
    <section id="about" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">
        <FadeInBlock className="relative flex w-full justify-center md:justify-start">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,rgba(31,240,255,0.12),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(31,240,255,0.12),transparent_50%)] blur-2xl md:-inset-6"
            aria-hidden
          />
          <div className="relative w-full max-w-[350px] md:max-w-[380px]">
            <PixelatedCanvas
              src="/assets/about/portrait.png"
              width={380}
              height={470}
              cellSize={4}
              dotScale={0.92}
              shape="square"
              backgroundColor="#000000"
              dropoutStrength={0}
              interactive
              distortionStrength={3}
              distortionRadius={90}
              distortionMode="swirl"
              followSpeed={0.22}
              jitterStrength={0}
              jitterSpeed={0}
              sampleAverage
              tintColor="#FFFFFF"
              tintStrength={0.12}
              className="w-full rounded-2xl border border-neutral-800 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)]"
            />
          </div>
        </FadeInBlock>
        <div className="w-full min-w-0">
          <FadeInTitle className="section-title">{copy.sections.about}</FadeInTitle>
          {lang === "zh" ? (
            <FadeInBlock delay={0.12} className="mt-6 space-y-4">
              <p className="text-base leading-8 text-white/78">
                我是 Lex，一名专注产品体验与细节表达的独立开发者。相比堆叠功能，我更在意
                每一步交互是否自然、每一个反馈是否有温度。
              </p>
              <p className="text-base leading-8 text-white/78">
                这座网站会持续记录我的产品实验、思考与迭代过程。它不是展示「我会什么」，而是
                展示「我在解决什么问题」。
              </p>
            </FadeInBlock>
          ) : (
            <FadeInBlock delay={0.12} className="mt-6 space-y-4">
              <p className="text-base leading-8 text-white/78">
                I&apos;m Lex—an indie developer focused on product feel and
                small details. I care more about natural interaction and humane
                feedback than feature count.
              </p>
              <p className="text-base leading-8 text-white/78">
                This site is a log of experiments and iteration. Less “what I
                can do,” more “what problems I’m trying to solve.”
              </p>
            </FadeInBlock>
          )}
        </div>
      </div>
    </section>
  );
}

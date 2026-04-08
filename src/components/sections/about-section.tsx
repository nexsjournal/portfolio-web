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
                嘿，我是 Lex。
                <br />
                我不追求成为那个“什么都会”的万能开发者，我更想做一个会“感受”的创造者。微小的细节总能偷走用户的注意力——或者把他们吓跑——所以我痴迷于这些细节。
              </p>
              <p className="text-base leading-8 text-white/78">
                你可以把我想象成生活的玩家：我用相机捕捉光影，用脚步丈量城市，在篮球场上挥洒汗水，在电影院里体验百种人生。这些经历是我的灵感燃料，它们告诉我，最棒的设计，总是源自最真实的生活体验。
              </p>
              <p className="text-base leading-8 text-white/78">
                这里是我的一个灵感仓库，我希望能记录我的每一次冒险、每一次挑战，以及我如何用技能解决现实问题——让科技多一点人情味，少一点冷冰冰的公式感。
              </p>
            </FadeInBlock>
          ) : (
            <FadeInBlock delay={0.12} className="mt-6 space-y-4">
              <p className="text-base leading-8 text-white/78">
                Hey, I&apos;m Lex.
                <br />
                I&apos;m not trying to be the “can-do-everything” developer. I
                would rather be a creator who can truly feel. Tiny details
                either steal a user&apos;s attention—or scare them away—so I&apos;m
                obsessed with getting them right.
              </p>
              <p className="text-base leading-8 text-white/78">
                Think of me as someone who plays life like a game: I capture
                light with a camera, measure cities with my steps, sweat it out
                on the basketball court, and live a hundred lives in the
                cinema. Those experiences are my fuel—they remind me that the
                best design always comes from real life.
              </p>
              <p className="text-base leading-8 text-white/78">
                This is my personal copy of the world. I want to record every
                adventure, every challenge, and how I use skills to solve
                real-world problems—so tech feels a little more human, and a
                little less like cold formulas.
              </p>
            </FadeInBlock>
          )}
        </div>
      </div>
    </section>
  );
}

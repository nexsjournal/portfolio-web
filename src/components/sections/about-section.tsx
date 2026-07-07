"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { registerGsapPlugins, SCROLL_START, SITE_EASE } from "@/lib/gsap/register";

registerGsapPlugins();

export function AboutSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const paragraphClass = isLight ? "text-slate-700/80" : "text-white/78";
  const portraitFrameClass = isLight
    ? "w-full rounded-2xl border border-slate-200 shadow-[0_18px_60px_-40px_rgba(2,6,23,0.25)]"
    : "w-full rounded-2xl border border-neutral-800 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)]";

  useGSAP(
    () => {
      const portrait = portraitRef.current;
      const title = titleRef.current;
      const textWrap = textRef.current;
      if (!portrait || !title || !textWrap) return;

      const paragraphs = gsap.utils.toArray<HTMLElement>(
        "[data-about-p]",
        textWrap,
      );

      if (reduceMotion) {
        gsap.set([portrait, title, ...paragraphs], {
          clearProps: "opacity,transform",
        });
        return;
      }

      gsap.set(portrait, { opacity: 0, x: -36, scale: 0.96 });
      gsap.set(title, { opacity: 0, y: 36 });
      gsap.set(paragraphs, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: SCROLL_START,
          once: true,
        },
        defaults: { ease: SITE_EASE },
      });

      tl.to(title, { opacity: 1, y: 0, duration: 0.68 })
        .to(portrait, { opacity: 1, x: 0, scale: 1, duration: 0.72 }, "-=0.48")
        .to(
          paragraphs,
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 },
          "-=0.42",
        );

      gsap.to(portrait, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: portrait,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    {
      scope: sectionRef,
      dependencies: [lang, reduceMotion],
      revertOnUpdate: true,
    },
  );

  const zhParagraphs = [
    <>
      嘿，我是 Lex。
      <br />
      我不追求成为那个“什么都会”的万能开发者，我更想做一个会“感受”的创造者。微小的细节总能偷走用户的注意力——或者把他们吓跑——所以我痴迷于这些细节。
    </>,
    <>
      你可以把我想象成生活的玩家：我用相机捕捉光影，用脚步丈量城市，在篮球场上挥洒汗水，在电影院里体验百种人生。这些经历是我的灵感燃料，它们告诉我，最棒的设计，总是源自最真实的生活体验。
    </>,
    <>
      这里是我的一个灵感仓库，我希望能记录我的每一次冒险、每一次挑战，以及我如何用技能解决现实问题——让科技多一点人情味，少一点冷冰冰的公式感。
    </>,
  ];

  const enParagraphs = [
    <>
      Hey, I&apos;m Lex.
      <br />
      I&apos;m not trying to be the “can-do-everything” developer. I would rather
      be a creator who can truly feel. Tiny details either steal a user&apos;s
      attention—or scare them away—so I&apos;m obsessed with getting them right.
    </>,
    <>
      Think of me as someone who plays life like a game: I capture light with a
      camera, measure cities with my steps, sweat it out on the basketball
      court, and live a hundred lives in the cinema. Those experiences are my
      fuel—they remind me that the best design always comes from real life.
    </>,
    <>
      This is my personal copy of the world. I want to record every adventure,
      every challenge, and how I use skills to solve real-world problems—so tech
      feels a little more human, and a little less like cold formulas.
    </>,
  ];

  const paragraphs = lang === "zh" ? zhParagraphs : enParagraphs;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">
        <div className="relative flex w-full justify-center md:justify-start">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,rgba(31,240,255,0.12),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(31,240,255,0.12),transparent_50%)] blur-2xl md:-inset-6"
            aria-hidden
          />
          <div
            ref={portraitRef}
            className="relative w-full max-w-[350px] md:max-w-[380px]"
          >
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
              className={portraitFrameClass}
            />
          </div>
        </div>
        <div ref={textRef} className="w-full min-w-0">
          <h2 ref={titleRef} className="section-title">
            {copy.sections.about}
          </h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((content, index) => (
              <p
                key={index}
                data-about-p
                className={`text-base leading-8 ${paragraphClass}`}
              >
                {content}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

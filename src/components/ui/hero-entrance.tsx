"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { NoiseBackground } from "@/components/ui/noise-background";
import { registerGsapPlugins, SITE_EASE } from "@/lib/gsap/register";
import { cn } from "@/lib/utils";

registerGsapPlugins();

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  isLight: boolean;
  lang: string;
};

export function HeroEntrance({
  title,
  subtitle,
  ctaLabel,
  isLight,
  lang,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const titleEl = titleRef.current;
      const subEl = subtitleRef.current;
      const ctaEl = ctaRef.current;
      if (!titleEl || !subEl || !ctaEl) return;

      if (reduceMotion) {
        gsap.set([titleEl, subEl, ctaEl], {
          opacity: 1,
          y: 0,
          clearProps: "transform",
        });
        return;
      }

      const titleSplit = SplitText.create(titleEl, {
        type: "chars",
        charsClass: "hero-char inline-block",
      });
      const subSplit = SplitText.create(subEl, {
        type: "words",
        wordsClass: "hero-word inline-block",
      });

      gsap.set(titleSplit.chars, { opacity: 0, y: 24 });
      gsap.set(subSplit.words, { opacity: 0, y: 16 });
      gsap.set(ctaEl, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ defaults: { ease: SITE_EASE } });
      tl.to(titleSplit.chars, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.025,
      })
        .to(
          subSplit.words,
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 },
          "-=0.25",
        )
        .to(ctaEl, { opacity: 1, y: 0, duration: 0.5 }, "-=0.15");

      return () => {
        titleSplit.revert();
        subSplit.revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [lang, reduceMotion, title, subtitle],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
    >
      <h1
        ref={titleRef}
        className={cn(
          "mt-10 text-5xl font-semibold leading-[1.1] md:mt-12 md:text-7xl md:leading-[1.08] lg:text-8xl",
          isLight ? "text-[#0b1220]" : "text-white",
        )}
      >
        {title}
      </h1>
      <p
        ref={subtitleRef}
        className={cn(
          "mt-9 max-w-2xl text-base md:mt-10 md:text-lg",
          isLight ? "text-[#0b1220]/75" : "text-white/75",
        )}
      >
        {subtitle}
      </p>
      <div ref={ctaRef} className="group/cta mt-12 flex justify-center md:mt-14">
        <NoiseBackground
          containerClassName="w-fit rounded-full p-2"
          gradientColors={[
            "rgb(31, 240, 255)",
            "rgb(101, 238, 190)",
            "rgb(187, 255, 42)",
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
      </div>
    </div>
  );
}

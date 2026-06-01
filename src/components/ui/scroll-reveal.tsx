"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  registerGsapPlugins,
  SCROLL_START,
  SITE_EASE,
} from "@/lib/gsap/register";

registerGsapPlugins();

type Props = {
  children: React.ReactNode;
  className?: string;
};

type FadeOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  parallax?: boolean;
};

function useGsapScrollFade(
  reduce: boolean,
  { y = 40, duration = 0.55, delay = 0, parallax = false }: FadeOptions,
) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduce) {
        gsap.set(el, { clearProps: "opacity,transform" });
        return;
      }

      gsap.set(el, { opacity: 0, y });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: SITE_EASE,
        scrollTrigger: {
          trigger: el,
          start: SCROLL_START,
          once: true,
        },
      });

      if (parallax) {
        gsap.to(el, {
          y: -22,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    },
    {
      scope: ref,
      dependencies: [reduce, y, duration, delay, parallax],
      revertOnUpdate: true,
    },
  );

  return ref;
}

export function ScrollReveal({ children, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useGsapScrollFade(!!reduce, { y: 40, duration: 0.55 });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}

export function FadeInTitle({
  children,
  className,
  parallax = false,
}: Props & { parallax?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useGsapScrollFade(!!reduce, {
    y: 44,
    duration: 0.68,
    parallax,
  });

  return (
    <h2 ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {children}
    </h2>
  );
}

export function FadeInBlock({
  children,
  className,
  delay = 0.1,
}: Props & { delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useGsapScrollFade(!!reduce, {
    y: 32,
    duration: 0.58,
    delay,
  });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}

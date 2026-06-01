"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  REVEAL_ITEM_CLASS,
  registerGsapPlugins,
  SCROLL_START,
  SITE_EASE,
} from "@/lib/gsap/register";

registerGsapPlugins();

type Options = {
  stagger?: number;
  y?: number;
  duration?: number;
  dependencies?: unknown[];
};

export function useScrollRevealBatch<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
) {
  const { stagger = 0.1, y = 32, duration = 0.58, dependencies = [] } =
    options;
  const containerRef = useRef<T>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLElement>(
        `.${REVEAL_ITEM_CLASS}`,
        container,
      );
      if (!items.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (context.conditions?.reduceMotion) {
            gsap.set(items, { clearProps: "opacity,transform" });
            return;
          }

          gsap.set(items, { opacity: 0, y });

          ScrollTrigger.batch(items, {
            start: SCROLL_START,
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration,
                stagger,
                ease: SITE_EASE,
                overwrite: true,
              });
            },
          });
        },
      );

      ScrollTrigger.refresh();

      return () => mm.revert();
    },
    {
      scope: containerRef,
      dependencies,
      revertOnUpdate: true,
    },
  );

  return { containerRef, revealClass: REVEAL_ITEM_CLASS };
}

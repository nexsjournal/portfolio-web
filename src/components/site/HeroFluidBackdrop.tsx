"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";

/**
 * 全宽流体光斑背景（GSAP），仅用于首页首屏。
 * 父级需为 `relative w-full`，勿放在 `max-w-*` 内，避免出现左右硬边。
 */
export function HeroFluidBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const blobs = rootRef.current!.querySelectorAll<HTMLElement>("[data-fluid-blob]");
      blobs.forEach((el, i) => {
        const dx = [55, -48, 42, -38][i] ?? 30;
        const dy = [-40, 35, -28, 32][i] ?? -25;
        const sc = [1.1, 0.92, 1.06, 0.96][i] ?? 1.05;
        const dur = [19, 24, 21, 26][i] ?? 20;

        gsap.fromTo(
          el,
          { x: 0, y: 0, scale: 1 },
          {
            x: dx,
            y: dy,
            scale: sc,
            duration: dur,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.45,
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-x-hidden overflow-y-visible"
    >
      {/* 静态底层：百分比定位，铺满视口，避免与 body 纯色形成竖向接缝 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 130% 90% at 50% -15%, rgba(37, 99, 235, 0.32), transparent 58%),
            radial-gradient(ellipse 90% 70% at 105% 25%, rgba(45, 212, 191, 0.16), transparent 52%),
            radial-gradient(ellipse 85% 65% at -5% 75%, rgba(59, 130, 246, 0.14), transparent 55%)
          `,
        }}
      />

      {!reduceMotion ? (
        <>
          <div
            data-fluid-blob
            className="absolute -left-[12%] top-[8%] h-[min(95vmin,580px)] w-[min(95vmin,580px)] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.55),rgba(37,99,235,0.15)_55%,transparent_70%)] blur-[100px] will-change-transform"
          />
          <div
            data-fluid-blob
            className="absolute -right-[8%] top-[35%] h-[min(85vmin,480px)] w-[min(85vmin,480px)] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(45,212,191,0.45),rgba(20,184,166,0.12)_50%,transparent_68%)] blur-[90px] will-change-transform"
          />
          <div
            data-fluid-blob
            className="absolute bottom-[5%] left-[15%] h-[min(75vmin,420px)] w-[min(75vmin,420px)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.4),transparent_65%)] blur-[85px] will-change-transform"
          />
          <div
            data-fluid-blob
            className="absolute bottom-[18%] right-[10%] h-[min(70vmin,380px)] w-[min(70vmin,380px)] rounded-full bg-[radial-gradient(circle_at_40%_60%,rgba(34,211,238,0.25),transparent_62%)] blur-[75px] will-change-transform"
          />
        </>
      ) : (
        <div className="absolute inset-0 opacity-80">
          <div className="absolute -left-[10%] top-[12%] h-[420px] w-[420px] rounded-full bg-primary/25 blur-[100px]" />
          <div className="absolute -right-[5%] top-[40%] h-[380px] w-[380px] rounded-full bg-accent/18 blur-[90px]" />
        </div>
      )}

      {/* 交给外层做首屏与下一区块的衔接，避免这里再叠一层造成条带感 */}
    </div>
  );
}

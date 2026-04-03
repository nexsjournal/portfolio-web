"use client";

import type { ReactNode } from "react";
import { useCallback, useRef } from "react";

import { useReducedMotion } from "framer-motion";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type Props = {
  children: ReactNode;
  className?: string;
  /** 最大倾斜角度（度） */
  maxTilt?: number;
};

/**
 * 鼠标驱动的 3D 倾斜卡片（perspective + rotateX/Y）
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 10,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = clamp((py - 0.5) * -2 * maxTilt, -maxTilt, maxTilt);
      const ry = clamp((px - 0.5) * 2 * maxTilt, -maxTilt, maxTilt);
      targetRef.current = { rx, ry };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        if (!ref.current) return;
        const { rx: rxx, ry: ryy } = targetRef.current;
        ref.current.style.transform = `perspective(1000px) rotateX(${rxx}deg) rotateY(${ryy}deg) scale3d(1.01,1.01,1)`;
      });
    },
    [maxTilt, reduceMotion],
  );

  const onLeave = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (ref.current) {
      ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: reduceMotion
          ? undefined
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transformStyle: "preserve-3d",
        transition: reduceMotion ? undefined : "transform 0.14s linear",
        willChange: reduceMotion ? undefined : "transform",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

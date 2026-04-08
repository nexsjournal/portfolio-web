"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/theme";

type ShootingStar = {
  top: string;
  left: string;
  delay: number;
};

export function ShootingStars() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const stars = useMemo<ShootingStar[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        top: `${Math.random() * 88}%`,
        left: `${Math.random() * 88}%`,
        delay: i * 2.1 + Math.random() * 0.8,
      })),
    [],
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((star, idx) => (
        <span
          key={idx}
          className={isLight ? "absolute h-[2px] w-28 rotate-[28deg] rounded-full bg-gradient-to-r from-[#1FF0FF] via-slate-200 to-transparent" : "absolute h-[2px] w-28 rotate-[28deg] rounded-full bg-gradient-to-r from-[#1FF0FF] via-white to-transparent"}
          style={{
            top: star.top,
            left: star.left,
            opacity: 0,
            animation: `shootingStar 11s linear ${star.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shootingStar {
          0% {
            transform: translate3d(0, 0, 0) rotate(28deg);
            opacity: 0;
          }
          6% {
            opacity: 0;
          }
          10% {
            opacity: 0.92;
          }
          18% {
            transform: translate3d(760px, 430px, 0) rotate(28deg);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

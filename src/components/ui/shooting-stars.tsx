"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/theme";

type ShootingStar = {
  top: string;
  left: string;
  delay: string;
};

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 91.7 + salt * 37.3) * 10000;
  return value - Math.floor(value);
}

export function ShootingStars() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const stars = useMemo<ShootingStar[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        top: `${(seeded(i, 1) * 88).toFixed(4)}%`,
        left: `${(seeded(i, 2) * 88).toFixed(4)}%`,
        delay: `${(i * 2.1 + seeded(i, 3) * 0.8).toFixed(3)}s`,
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
            animation: `shootingStar 11s linear ${star.delay} infinite`,
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

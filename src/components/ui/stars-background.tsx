"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/theme";

type Star = {
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
};

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 77.13 + salt * 29.91) * 10000;
  return value - Math.floor(value);
}

export function StarsBackground() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        left: `${(seeded(index, 1) * 100).toFixed(4)}%`,
        top: `${(seeded(index, 2) * 100).toFixed(4)}%`,
        size: `${(seeded(index, 3) * 2 + 1).toFixed(3)}px`,
        duration: `${(seeded(index, 4) * 3 + 2.8).toFixed(3)}s`,
        delay: `${(seeded(index, 5) * 3.5).toFixed(3)}s`,
        opacity: (seeded(index, 6) * 0.55 + 0.25).toFixed(3),
      })),
    [],
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((star, idx) => (
        <span
          key={idx}
          className={isLight ? "absolute rounded-full bg-slate-300" : "absolute rounded-full bg-white"}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `starTwinkle ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes starTwinkle {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.22;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}

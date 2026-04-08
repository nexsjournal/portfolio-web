"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/theme";

type Star = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export function StarsBackground() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 70 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2.8,
        delay: Math.random() * 3.5,
        opacity: Math.random() * 0.55 + 0.25,
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
            animation: `starTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
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

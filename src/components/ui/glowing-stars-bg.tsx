"use client";

import { motion } from "framer-motion";

const stars = Array.from({ length: 26 }).map((_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  delay: (i % 7) * 0.35,
  size: (i % 3) + 1,
}));

export function GlowingStarsBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(31,240,255,0.16),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(162,96,255,0.2),transparent_45%),#07090f]" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-[#1FF0FF]"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size * 3}px`,
            height: `${star.size * 3}px`,
            boxShadow: "0 0 20px rgba(31,240,255,0.9)",
          }}
          animate={{ opacity: [0.2, 1, 0.25] }}
          transition={{
            duration: 2.4 + star.size * 0.7,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

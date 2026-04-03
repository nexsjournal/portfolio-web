"use client";

import { m, useReducedMotion } from "framer-motion";

/** 首屏左上角 / 右上角光束，在内容进场后再亮起 */
export function HeroLightBeams({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-30"
      >
        <div className="absolute -left-[20%] -top-[10%] h-[55%] w-[45%] rotate-[-12deg] bg-gradient-to-br from-primary/25 via-transparent to-transparent blur-2xl" />
        <div className="absolute -right-[18%] -top-[8%] h-[50%] w-[42%] rotate-[10deg] bg-gradient-to-bl from-accent/20 via-transparent to-transparent blur-2xl" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <m.div
        className="absolute -left-[22%] -top-[12%] h-[58%] w-[48%] rotate-[-14deg]"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(125deg, rgba(59,130,246,0.45) 0%, rgba(37,99,235,0.12) 35%, transparent 65%)",
          filter: "blur(28px)",
        }}
      />
      <m.div
        className="absolute -right-[20%] -top-[10%] h-[52%] w-[44%] rotate-[12deg]"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.08,
        }}
        style={{
          background:
            "linear-gradient(235deg, rgba(45,212,191,0.38) 0%, rgba(20,184,166,0.1) 38%, transparent 68%)",
          filter: "blur(26px)",
        }}
      />
    </div>
  );
}

"use client";

import { motion, useMotionTemplate, useSpring, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export function Spotlight() {
  const reduceMotion = useReducedMotion();

  const x = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 });
  const y = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  const spotlight = useMotionTemplate`radial-gradient(720px circle at ${x}px ${y}px, rgba(37,99,235,0.22), transparent 62%)`;

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-10%,rgba(37,99,235,0.2),transparent_65%)]"
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: spotlight }}
    />
  );
}

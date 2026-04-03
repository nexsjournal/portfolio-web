"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function MagneticButton({
  children,
  className,
  strength = 10,
  href,
  target,
  rel,
  "aria-label": ariaLabel,
}: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.35 });

  return (
    <m.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      style={reduceMotion ? undefined : { x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        x.set(px * strength);
        y.set(py * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </m.a>
  );
}

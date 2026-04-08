"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export function Spotlight({ className, fill = "#1FF0FF" }: SpotlightProps) {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute h-[64%] w-[64%] opacity-0",
        className,
      )}
      style={{ animation: "spotlightReveal 2.2s cubic-bezier(0.22,1,0.36,1) forwards" }}
      viewBox="0 0 600 500"
      aria-hidden
    >
      <defs>
        <filter id="spotlight-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <ellipse
        cx="360"
        cy="230"
        rx="80"
        ry="240"
        transform="rotate(-60 360 230)"
        fill={fill}
        fillOpacity="0.10"
        filter="url(#spotlight-blur)"
      />
      <ellipse
        cx="350"
        cy="245"
        rx="130"
        ry="280"
        transform="rotate(-22 350 245)"
        fill={fill}
        fillOpacity="0.1"
        filter="url(#spotlight-blur)"
      />
      <style jsx>{`
        @keyframes spotlightReveal {
          0% {
            opacity: 0;
            transform: translate3d(-26px, -22px, 0) scale(0.92);
            filter: blur(8px);
          }
          100% {
            opacity: 0.92;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </svg>
  );
}

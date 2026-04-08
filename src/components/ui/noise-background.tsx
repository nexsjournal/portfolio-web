"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
  gradientColors: string[];
  animate?: boolean;
  /** hover 时让渐变“流动”（改变背景渐变位置），不移动容器本身 */
  flowOnHover?: boolean;
};

const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="160" height="160" filter="url(#n)" opacity="0.55"/>
  </svg>`,
);

export function NoiseBackground({
  children,
  containerClassName,
  gradientColors,
  animate = false,
  flowOnHover = false,
}: Props) {
  const stops = gradientColors?.length
    ? gradientColors.join(", ")
    : "rgb(31, 240, 255), rgb(162, 96, 255), rgb(187, 255, 42)";

  return (
    <div
      className={cn(
        "relative isolate inline-flex",
        animate && "motion-safe:animate-[noise-flow_7s_linear_infinite]",
        containerClassName,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-[inherit] bg-[length:220%_220%] bg-[position:50%_50%]",
          flowOnHover && "motion-safe:group-hover/cta:animate-[gradient-flow_3.2s_ease_infinite]",
        )}
        style={{
          backgroundImage: `linear-gradient(120deg, ${stops})`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] opacity-[0.28] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
          backgroundSize: "160px 160px",
        }}
      />
      <div aria-hidden className="absolute inset-0 rounded-[inherit] bg-black/15" />
      <div className="relative">{children}</div>
    </div>
  );
}


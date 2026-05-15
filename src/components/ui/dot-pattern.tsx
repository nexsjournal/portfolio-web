"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type DotPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
};

/** 0–1 稳定伪随机，避免每次渲染 Math.random 导致子节点抖动与布局抖动 */
function stable01(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

const MAX_DOTS = 640;

type Dot = {
  key: string;
  cx: number;
  cy: number;
  delay: number;
  duration: number;
};

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setDimensions((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };

    update();
    const ro = new ResizeObserver(() => requestAnimationFrame(update));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dots = useMemo(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0) return [];

    let cellW = width;
    let cellH = height;
    let cols = Math.max(1, Math.ceil(dimensions.width / cellW));
    let rows = Math.max(1, Math.ceil(dimensions.height / cellH));

    while (cols * rows > MAX_DOTS && cellW < 96) {
      cellW += 3;
      cellH += 3;
      cols = Math.max(1, Math.ceil(dimensions.width / cellW));
      rows = Math.max(1, Math.ceil(dimensions.height / cellH));
    }

    const out: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        out.push({
          key: `${col}-${row}`,
          cx: col * cellW + cx + x,
          cy: row * cellH + cy + y,
          delay: stable01(i * 3 + 7) * 5,
          duration: 2 + stable01(i * 5 + 11) * 3,
        });
      }
    }
    return out;
  }, [dimensions.width, dimensions.height, width, height, cx, cy, x, y]);

  return (
    <svg
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-white/45",
        className,
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={dot.cx}
          cy={dot.cy}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : "currentColor"}
          style={
            glow
              ? {
                  animation: `dot-pattern-pulse ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

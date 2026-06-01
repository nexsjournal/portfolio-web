"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type InteractiveGridPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  /** 父级 section 坐标系下的指针位置，网格在内容层下方时仍可响应 hover */
  pointer?: { x: number; y: number } | null;
  interactive?: boolean;
  className?: string;
  linesClassName?: string;
  squaresClassName?: string;
  activeSquaresClassName?: string;
};

const MAX_SQUARES = 2400;

export function InteractiveGridPattern({
  width: cellW = 20,
  height: cellH = 20,
  pointer = null,
  interactive = true,
  className,
  linesClassName,
  squaresClassName,
  activeSquaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [localHovered, setLocalHovered] = useState<number | null>(null);

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

  const { cols, rows, cellWidth, cellHeight } = useMemo(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      return { cols: 0, rows: 0, cellWidth: cellW, cellHeight: cellH };
    }

    let cw = cellW;
    let ch = cellH;
    let c = Math.max(1, Math.ceil(dimensions.width / cw));
    let r = Math.max(1, Math.ceil(dimensions.height / ch));

    while (c * r > MAX_SQUARES && cw < 80) {
      cw += 4;
      ch += 4;
      c = Math.max(1, Math.ceil(dimensions.width / cw));
      r = Math.max(1, Math.ceil(dimensions.height / ch));
    }

    return { cols: c, rows: r, cellWidth: cw, cellHeight: ch };
  }, [dimensions.width, dimensions.height, cellW, cellH]);

  const hoveredSquare = useMemo(() => {
    if (!interactive) return null;

    if (pointer) {
      const col = Math.floor(pointer.x / cellWidth);
      const row = Math.floor(pointer.y / cellHeight);
      if (col < 0 || row < 0 || col >= cols || row >= rows) return null;
      return row * cols + col;
    }

    return localHovered;
  }, [
    pointer,
    localHovered,
    interactive,
    cellWidth,
    cellHeight,
    cols,
    rows,
  ]);

  const squareCount = cols * rows;
  const w = dimensions.width;
  const h = dimensions.height;

  return (
    <svg
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      {w > 0 && h > 0 && (
        <g className={cn("text-current", linesClassName)}>
          {Array.from({ length: rows + 1 }).map((_, row) => (
            <line
              key={`h-${row}`}
              x1={0}
              y1={row * cellHeight}
              x2={w}
              y2={row * cellHeight}
              stroke="currentColor"
              strokeWidth={0.65}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {Array.from({ length: cols + 1 }).map((_, col) => (
            <line
              key={`v-${col}`}
              x1={col * cellWidth}
              y1={0}
              x2={col * cellWidth}
              y2={h}
              stroke="currentColor"
              strokeWidth={0.65}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      )}

      {squareCount > 0 &&
        Array.from({ length: squareCount }).map((_, index) => {
          const x = (index % cols) * cellWidth;
          const y = Math.floor(index / cols) * cellHeight;
          const isActive = hoveredSquare === index;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={cellWidth}
              height={cellHeight}
              className={cn(
                "fill-transparent stroke-transparent transition-[fill,stroke,filter] duration-300 ease-out",
                squaresClassName,
                isActive && activeSquaresClassName,
              )}
              onMouseEnter={
                !pointer && interactive
                  ? () => setLocalHovered(index)
                  : undefined
              }
              onMouseLeave={
                !pointer && interactive
                  ? () => setLocalHovered(null)
                  : undefined
              }
            />
          );
        })}
    </svg>
  );
}

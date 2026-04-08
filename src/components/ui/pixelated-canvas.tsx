"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type PixelatedCanvasProps = {
  src: string;
  width?: number;
  height?: number;
  cellSize?: number;
  dotScale?: number;
  shape?: "square" | "circle";
  backgroundColor?: string;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "swirl" | "push";
  followSpeed?: number;
  jitterStrength?: number;
  jitterSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  className?: string;
  imageSrc?: string;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function samplePixel(
  data: Uint8ClampedArray,
  iw: number,
  ih: number,
  sx: number,
  sy: number,
  average: boolean,
): [number, number, number, number] {
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  if (!average) {
    if (x0 < 0 || y0 < 0 || x0 >= iw || y0 >= ih) return [0, 0, 0, 0];
    const i = (y0 * iw + x0) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  let c = 0;
  for (let oy = 0; oy <= 1; oy++) {
    for (let ox = 0; ox <= 1; ox++) {
      const x = x0 + ox;
      const y = y0 + oy;
      if (x < 0 || y < 0 || x >= iw || y >= ih) continue;
      const i = (y * iw + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      a += data[i + 3];
      c++;
    }
  }
  if (c === 0) return [0, 0, 0, 0];
  return [r / c, g / c, b / c, a / c];
}

export function PixelatedCanvas({
  src,
  width = 400,
  height = 500,
  cellSize = 3,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000000",
  dropoutStrength = 0.4,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.2,
  jitterStrength = 4,
  jitterSpeed = 4,
  sampleAverage = true,
  tintColor = "#FFFFFF",
  tintStrength = 0.2,
  className,
  imageSrc,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<{ data: Uint8ClampedArray; iw: number; ih: number } | null>(
    null,
  );
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: width / 2, y: height / 2 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const source = imageSrc ?? src;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const buf = bufferRef.current;
    if (!canvas || !buf) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cs = Math.max(2, cellSize);
    const scale = dotScale;
    const { data, iw, ih } = buf;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const tint = hexToRgb(tintColor);
    const mx = smoothRef.current.x;
    const my = smoothRef.current.y;
    const t = timeRef.current;

    const dropThreshold =
      dropoutStrength > 0
        ? Math.min(9999, Math.floor(dropoutStrength * 0.012 * 10000))
        : 0;

    for (let y = 0; y < h; y += cs) {
      for (let x = 0; x < w; x += cs) {
        if (dropThreshold > 0) {
          const gx = Math.floor(x / cs);
          const gy = Math.floor(y / cs);
          const seed = ((gx * 73856093) ^ (gy * 19349663)) >>> 0;
          if (seed % 10000 < dropThreshold) continue;
        }

        const cx = x + cs / 2;
        const cy = y + cs / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.hypot(dx, dy);

        let sx = (cx / w) * iw;
        let sy = (cy / h) * ih;

        if (interactive && dist < distortionRadius && dist > 0.001) {
          const f = 1 - dist / distortionRadius;
          const angle = Math.atan2(dy, dx);
          if (distortionMode === "swirl") {
            const turn = distortionStrength * f * 1.2;
            sx += Math.cos(angle + Math.PI / 2) * turn * 8;
            sy += Math.sin(angle + Math.PI / 2) * turn * 8;
          } else {
            sx += (dx / dist) * distortionStrength * f * 3;
            sy += (dy / dist) * distortionStrength * f * 3;
          }
        }

        if (jitterStrength > 0) {
          sx +=
            Math.sin(t * jitterSpeed * 0.01 + x * 0.05) * jitterStrength * 0.15;
          sy +=
            Math.cos(t * jitterSpeed * 0.01 + y * 0.05) * jitterStrength * 0.15;
        }

        sx = Math.max(0, Math.min(iw - 1, sx));
        sy = Math.max(0, Math.min(ih - 1, sy));

        let [r, g, b, a] = samplePixel(data, iw, ih, sx, sy, sampleAverage);

        if (tint && tintStrength > 0) {
          r = r * (1 - tintStrength) + tint.r * tintStrength;
          g = g * (1 - tintStrength) + tint.g * tintStrength;
          b = b * (1 - tintStrength) + tint.b * tintStrength;
        }

        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a / 255})`;
        const drawSize = cs * scale;

        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(cx, cy, drawSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            cx - drawSize / 2,
            cy - drawSize / 2,
            drawSize,
            drawSize,
          );
        }
      }
    }
  }, [
    backgroundColor,
    cellSize,
    distortionMode,
    distortionRadius,
    distortionStrength,
    dotScale,
    dropoutStrength,
    interactive,
    jitterSpeed,
    jitterStrength,
    sampleAverage,
    shape,
    tintColor,
    tintStrength,
  ]);

  const scheduleDraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame((ts) => {
      timeRef.current = ts;
      const target = mouseRef.current;
      smoothRef.current.x += (target.x - smoothRef.current.x) * followSpeed;
      smoothRef.current.y += (target.y - smoothRef.current.y) * followSpeed;
      draw();
    });
  }, [draw, followSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    if (source.startsWith("http://") || source.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.src = source;
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = img.naturalWidth;
      off.height = img.naturalHeight;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0);
      const imageData = octx.getImageData(0, 0, off.width, off.height);
      bufferRef.current = {
        data: imageData.data,
        iw: off.width,
        ih: off.height,
      };
      scheduleDraw();
    };

    return () => {
      bufferRef.current = null;
    };
  }, [source, width, height, scheduleDraw]);

  useEffect(() => {
    if (jitterStrength <= 0) return;
    let id = 0;
    let running = true;
    const loop = (ts: number) => {
      timeRef.current = ts;
      const target = mouseRef.current;
      smoothRef.current.x += (target.x - smoothRef.current.x) * followSpeed;
      smoothRef.current.y += (target.y - smoothRef.current.y) * followSpeed;
      draw();
      if (running) id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(id);
    };
  }, [jitterStrength, draw, followSpeed]);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    scheduleDraw();
  };

  const onLeave = () => {
    mouseRef.current = { x: width / 2, y: height / 2 };
    scheduleDraw();
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="像素化画布展示"
      className={cn(className)}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
    />
  );
}

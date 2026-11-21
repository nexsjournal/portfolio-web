"use client";

import { useEffect, useRef } from "react";

const ATLAS_SRC = "/assets/hero/lex-look-atlas.webp";
const COLUMNS = 16;
const ROWS = 16;
const NEUTRAL_COLUMN = 8;
const NEUTRAL_ROW = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PortfolioGazeAvatar({ label }: { label: string }) {
  const sprite = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = sprite.current;
    if (!target) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canTrack = () => finePointer.matches && !reducedMotion.matches;
    let atlas: HTMLImageElement | undefined;
    let pointer: Pick<PointerEvent, "clientX" | "clientY"> | null = null;
    let frameId = 0;
    let lastFrameTime = 0;
    let needsMeasure = false;
    let column = NEUTRAL_COLUMN;
    let row = NEUTRAL_ROW;
    let targetColumn = NEUTRAL_COLUMN;
    let targetRow = NEUTRAL_ROW;
    let paintedFrame = -1;

    const paint = () => {
      const frameColumn = Math.round(column);
      const frameRow = Math.round(row);
      const frame = frameRow * COLUMNS + frameColumn;
      if (frame === paintedFrame) return;

      paintedFrame = frame;
      target.style.setProperty("--gaze-position", `${frameColumn / (COLUMNS - 1) * 100}% ${frameRow / (ROWS - 1) * 100}%`);
    };

    const measure = () => {
      targetColumn = NEUTRAL_COLUMN;
      targetRow = NEUTRAL_ROW;
      if (!pointer) return;

      const rect = target.getBoundingClientRect();
      if (!rect.width || rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height * 0.4;
      const offsetX = pointer.clientX - centerX;
      const offsetY = pointer.clientY - eyeY;
      const horizontalRange = offsetX < 0 ? centerX : window.innerWidth - centerX;
      const verticalRange = offsetY < 0 ? eyeY : window.innerHeight - eyeY;
      const yaw = clamp(offsetX / Math.max(1, Math.min(horizontalRange, rect.width * 1.45)), -1, 1);
      const pitch = clamp(offsetY / Math.max(1, Math.min(verticalRange, rect.height * 2.7)), -1, 1);

      targetColumn += yaw * (yaw < 0 ? NEUTRAL_COLUMN : COLUMNS - 1 - NEUTRAL_COLUMN);
      targetRow += pitch * (pitch < 0 ? NEUTRAL_ROW : ROWS - 1 - NEUTRAL_ROW);
    };

    const animate = (time: number) => {
      frameId = 0;
      if (needsMeasure) {
        needsMeasure = false;
        measure();
      }

      const easing = 1 - Math.exp(-clamp(time - lastFrameTime, 0, 64) / 48);
      lastFrameTime = time;
      column += (targetColumn - column) * easing;
      row += (targetRow - row) * easing;

      if (Math.abs(targetColumn - column) > 0.02 || Math.abs(targetRow - row) > 0.02) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        column = targetColumn;
        row = targetRow;
      }
      paint();
    };

    const update = () => {
      needsMeasure = true;
      if (!frameId && canTrack() && target.dataset.ready) {
        lastFrameTime = performance.now();
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const loadAtlas = () => {
      if (atlas || !canTrack()) return;
      const image = new window.Image();
      atlas = image;
      image.decoding = "async";
      image.onload = () => {
        target.style.setProperty("--gaze-atlas", `url("${ATLAS_SRC}")`);
        target.style.setProperty("--gaze-size", `${COLUMNS * 100}% ${ROWS * 100}%`);
        paint();
        target.dataset.ready = "true";
        update();
      };
      image.src = ATLAS_SRC;
    };

    const reset = () => {
      pointer = null;
      update();
    };

    const syncInputMode = () => {
      if (canTrack()) {
        loadAtlas();
        return;
      }

      pointer = null;
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      column = NEUTRAL_COLUMN;
      row = NEUTRAL_ROW;
      paint();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canTrack() || event.pointerType === "touch") return;
      pointer = { clientX: event.clientX, clientY: event.clientY };
      update();
    };

    const handleViewportChange = () => { if (pointer) update(); };

    loadAtlas();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("mouseleave", reset);
    finePointer.addEventListener("change", syncInputMode);
    reducedMotion.addEventListener("change", syncInputMode);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (atlas) atlas.onload = null;
      delete target.dataset.ready;
      target.style.removeProperty("--gaze-position");
      target.style.removeProperty("--gaze-atlas");
      target.style.removeProperty("--gaze-size");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("mouseleave", reset);
      finePointer.removeEventListener("change", syncInputMode);
      reducedMotion.removeEventListener("change", syncInputMode);
    };
  }, []);

  return <span ref={sprite} className="portfolio-computer-avatar" role="img" aria-label={label} />;
}

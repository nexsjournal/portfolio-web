"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const moments = [
  { src: "/assets/hero/polaroid-moment-01-v2.webp", fanX: -96, fanXMobile: -58, fanY: 24, tilt: -8, stackOrder: 0 },
  { src: "/assets/hero/polaroid-moment-02-v2.webp", fanX: 0, fanXMobile: 0, fanY: 0, tilt: 2, stackOrder: 2 },
  { src: "/assets/hero/polaroid-moment-03-v2.webp", fanX: 96, fanXMobile: 58, fanY: 24, tilt: 9, stackOrder: 1 },
];

type DragPosition = { x: number; y: number };
type DragSession = {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const restingPositions = moments.map(() => ({ x: 0, y: 0 }));

export function ThankYouScroll({ lang }: { lang: SiteLang }) {
  const copy = portfolioCopy[lang];
  const [revealed, setRevealed] = useState(0);
  const [positions, setPositions] = useState<DragPosition[]>(restingPositions);
  const dragSession = useRef<DragSession | null>(null);

  const shutter = () => {
    if (revealed === moments.length) {
      setPositions(restingPositions);
      setRevealed(0);
      return;
    }
    setRevealed((current) => current + 1);
  };

  const startDrag = (index: number, event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    dragSession.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: positions[index].x,
      originY: positions[index].y,
    };
  };

  const moveDrag = (index: number, event: PointerEvent<HTMLElement>) => {
    const session = dragSession.current;
    if (!session || session.index !== index || session.pointerId !== event.pointerId) return;
    const x = session.originX + event.clientX - session.startX;
    const y = session.originY + event.clientY - session.startY;
    setPositions((current) => current.map((position, positionIndex) => (
      positionIndex === index ? { x, y } : position
    )));
  };

  const endDrag = (index: number, event: PointerEvent<HTMLElement>) => {
    const session = dragSession.current;
    if (!session || session.index !== index || session.pointerId !== event.pointerId) return;
    event.currentTarget.classList.remove("is-dragging");
    dragSession.current = null;
  };

  return (
    <section className="portfolio-section portfolio-thanks" aria-labelledby="thanks-title">
      <div className="portfolio-thanks-card">
        <div className="portfolio-thanks-light" aria-hidden />

        <header className="portfolio-thanks-heading">
          <span>{copy.thanksEyebrow}</span>
          <h2 id="thanks-title">{copy.thanksTitle}</h2>
        </header>

        <div className="portfolio-thanks-note">
          <h3>{copy.thanksNoteTitle}</h3>
          <p>{copy.thanksNoteBody}</p>
          <span className="portfolio-thanks-signature">— {copy.introName}</span>
        </div>

        <div className="portfolio-thanks-stage">
          <div className="portfolio-polaroid-stack" aria-live="polite">
            {moments.map((moment, index) => {
              const isVisible = index < revealed;
              return (
                <div
                  key={moment.src}
                  className={`portfolio-polaroid-slot${isVisible ? " is-visible" : ""}`}
                  style={{
                    "--fan-x": `${moment.fanX}px`,
                    "--fan-x-mobile": `${moment.fanXMobile}px`,
                    "--fan-y": `${moment.fanY}px`,
                    "--fan-tilt": `${moment.tilt}deg`,
                    "--stack-order": moment.stackOrder,
                  } as CSSProperties}
                  aria-hidden={!isVisible}
                >
                  <figure
                    className="portfolio-polaroid"
                    style={{
                      "--drag-x": `${positions[index].x}px`,
                      "--drag-y": `${positions[index].y}px`,
                    } as CSSProperties}
                    onPointerDown={(event) => startDrag(index, event)}
                    onPointerMove={(event) => moveDrag(index, event)}
                    onPointerUp={(event) => endDrag(index, event)}
                    onPointerCancel={(event) => endDrag(index, event)}
                  >
                    <div className="portfolio-polaroid-photo">
                      <Image src={moment.src} alt={copy.thanksMoments[index]} width={800} height={800} loading="eager" unoptimized />
                    </div>
                    <figcaption>{copy.thanksMoments[index]}</figcaption>
                  </figure>
                </div>
              );
            })}
          </div>

          <div className="portfolio-polaroid-camera">
            <Image
              src="/assets/hero/polaroid-camera.webp"
              alt=""
              width={1200}
              height={800}
              sizes="(max-width: 670px) 260px, 360px"
            />
            <button
              type="button"
              className="portfolio-polaroid-shutter"
              onClick={shutter}
              aria-label={revealed === moments.length ? copy.thanksShutterAgain : copy.thanksShutter}
              aria-describedby="thanks-shot-status"
            />
          </div>

          <p id="thanks-shot-status" className="portfolio-thanks-status">
            <span>{revealed} / {moments.length}</span>
            <span>{revealed ? copy.thanksDragHint : copy.thanksShutter}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";

import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";

type CameraState = "idle" | "requesting" | "ready" | "capturing" | "error";
type ShotPhase = "developing" | "ready" | "error";

type Shot = {
  id: number;
  rawUrl: string;
  generatedUrl?: string;
  phase: ShotPhase;
  error?: string;
  savedToGallery?: boolean;
  galleryRequested?: boolean;
};

type DragPosition = { x: number; y: number };
type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const PHOTO_WIDTH = 1200;
const PHOTO_HEIGHT = 900;
const DEVELOP_MIN_MS = 2400;

function cameraErrorMessage(error: unknown, copy: (typeof portfolioCopy)[SiteLang]) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return copy.thanksCameraDenied;
  if (name === "NotFoundError" || name === "OverconstrainedError") return copy.thanksCameraMissing;
  if (name === "NotReadableError") return copy.thanksCameraBusy;
  if (error instanceof Error && error.message === "unsupported") return copy.thanksCameraUnsupported;
  return copy.thanksCameraFailed;
}

async function requestCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
    });
  } catch (error) {
    if (error instanceof DOMException && (error.name === "OverconstrainedError" || error.name === "NotFoundError")) {
      return navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    }
    throw error;
  }
}

function waitForVideoFrame(video: HTMLVideoElement) {
  if (video.readyState >= 2 && video.videoWidth > 0) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const finish = () => {
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      resolve();
    };
    video.addEventListener("loadeddata", finish);
    video.addEventListener("canplay", finish);
    window.setTimeout(finish, 1500);
  });
}

export function ThankYouScroll({ lang }: { lang: SiteLang }) {
  const copy = portfolioCopy[lang];
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [flash, setFlash] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragSession = useRef<DragSession | null>(null);
  const shotId = useRef(0);
  const rawUrlRef = useRef<string | null>(null);
  const generatedUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const flashTimer = useRef<number | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const closeCamera = useCallback(() => {
    stopStream();
    setCameraState("idle");
    setCameraError(null);
    setDialogOpen(false);
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [stopStream]);

  useEffect(() => {
    document.body.classList.toggle("portfolio-camera-open", dialogOpen);
    return () => document.body.classList.remove("portfolio-camera-open");
  }, [dialogOpen]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      abortRef.current?.abort();
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (rawUrlRef.current) URL.revokeObjectURL(rawUrlRef.current);
      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
    };
  }, []);

  const triggerFlash = () => {
    setFlash(true);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(false), 280);
  };

  const developPhoto = useCallback(async (blob: Blob, rawUrl: string, shouldSaveToGallery: boolean) => {
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = Date.now();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 65_000);
    const form = new FormData();
    form.append("photo", blob, "lex-polaroid.jpg");
    form.append("save", shouldSaveToGallery ? "1" : "0");

    try {
      const response = await fetch("/api/thanks/polaroid", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { code?: string } | null;
        throw new Error(payload?.code === "rate_limited" ? copy.thanksRateLimited : copy.thanksDevelopError);
      }

      const generated = await response.blob();
      if (!generated.type.startsWith("image/")) throw new Error(copy.thanksDevelopError);

      const generatedUrl = URL.createObjectURL(generated);
      const savedToGallery = response.headers.get("x-polaroid-saved") === "1";
      const decoded = document.createElement("img");
      decoded.src = generatedUrl;
      await decoded.decode().catch(() => undefined);

      const remaining = DEVELOP_MIN_MS - (Date.now() - startedAt);
      if (remaining > 0) await new Promise((resolve) => window.setTimeout(resolve, remaining));

      if (controller.signal.aborted || rawUrlRef.current !== rawUrl) {
        URL.revokeObjectURL(generatedUrl);
        return;
      }

      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = generatedUrl;
      setShot((current) => current?.rawUrl === rawUrl
        ? { ...current, generatedUrl, phase: "ready", error: undefined, savedToGallery }
        : current);
    } catch (error) {
      if (rawUrlRef.current !== rawUrl || (controller.signal.aborted && !timedOut)) return;
      const message = timedOut
        ? copy.thanksDevelopError
        : error instanceof Error ? error.message : copy.thanksDevelopError;
      setShot((current) => current?.rawUrl === rawUrl
        ? { ...current, phase: "error", error: message }
        : current);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, [copy.thanksDevelopError, copy.thanksRateLimited]);

  const openCamera = useCallback(async () => {
    setCameraError(null);
    setCameraState("requesting");
    setDialogOpen(true);
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();

    if (!window.isSecureContext) {
      setCameraState("error");
      setCameraError(copy.thanksCameraInsecure);
      return;
    }

    try {
      const stream = await requestCameraStream();
      if (!dialogRef.current?.open) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => undefined);
        await waitForVideoFrame(video);
      }
      setCameraState("ready");
    } catch (error) {
      if (!dialogRef.current?.open) return;
      setCameraState("error");
      setCameraError(cameraErrorMessage(error, copy));
    }
  }, [copy]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (cameraState !== "ready" || !video) return;

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      await waitForVideoFrame(video);
    }
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

    setCameraState("capturing");
    triggerFlash();

    const canvas = document.createElement("canvas");
    canvas.width = PHOTO_WIDTH;
    canvas.height = PHOTO_HEIGHT;
    const context = canvas.getContext("2d");

    if (context) {
      const scale = Math.max(PHOTO_WIDTH / video.videoWidth, PHOTO_HEIGHT / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      context.translate(PHOTO_WIDTH, 0);
      context.scale(-1, 1);
      context.drawImage(
        video,
        (PHOTO_WIDTH - drawWidth) / 2,
        (PHOTO_HEIGHT - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));

    closeCamera();
    if (!blob || !context) {
      setShot((current) => current ? { ...current, phase: "error", error: copy.thanksCameraFailed } : current);
      return;
    }

    navigator.vibrate?.(12);
    abortRef.current?.abort();
    if (rawUrlRef.current) URL.revokeObjectURL(rawUrlRef.current);
    if (generatedUrlRef.current) {
      URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = null;
    }

    const rawUrl = URL.createObjectURL(blob);
    rawUrlRef.current = rawUrl;
    setPosition({ x: 0, y: 0 });
    setShot({ id: ++shotId.current, rawUrl, phase: "developing", galleryRequested: saveToGallery });
    void developPhoto(blob, rawUrl, saveToGallery);
  }, [cameraState, closeCamera, copy.thanksCameraFailed, developPhoto, saveToGallery]);

  const shutter = () => {
    if (shot?.phase === "developing" || cameraState === "requesting" || cameraState === "capturing") return;
    void openCamera();
  };

  const handleDialogClose = () => {
    stopStream();
    setCameraState("idle");
    setCameraError(null);
    setDialogOpen(false);
  };

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeCamera();
  };

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    dragSession.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const session = dragSession.current;
    if (!session || session.pointerId !== event.pointerId) return;
    setPosition({
      x: session.originX + event.clientX - session.startX,
      y: session.originY + event.clientY - session.startY,
    });
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    const session = dragSession.current;
    if (!session || session.pointerId !== event.pointerId) return;
    event.currentTarget.classList.remove("is-dragging");
    dragSession.current = null;
  };

  const shutterBusy = cameraState === "requesting" || cameraState === "capturing" || shot?.phase === "developing";
  const shutterLabel = shutterBusy
    ? copy.thanksShutterBusy
    : shot
      ? copy.thanksShutterAgain
      : copy.thanksShutter;
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
          {shot ? (
            <div
              key={shot.id}
              className="portfolio-polaroid-slot is-visible is-ejecting"
              style={{
                "--fan-x": "0px",
                "--fan-x-mobile": "0px",
                "--fan-y": "0px",
                "--fan-tilt": "-2deg",
                "--stack-order": 2,
              } as CSSProperties}
            >
              <figure
                className={[
                  "portfolio-polaroid",
                  shot.phase === "developing" ? "is-developing" : "",
                  shot.phase === "ready" ? "is-developed" : "",
                  shot.phase === "error" ? "is-failed" : "",
                ].filter(Boolean).join(" ")}
                style={{
                  "--drag-x": `${position.x}px`,
                  "--drag-y": `${position.y}px`,
                } as CSSProperties}
                title={shot.error}
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <div className="portfolio-polaroid-photo">
                  <img
                    className="portfolio-polaroid-raw"
                    src={shot.rawUrl}
                    alt=""
                    draggable={false}
                  />
                  {shot.generatedUrl ? (
                    <img
                      className="portfolio-polaroid-generated"
                      src={shot.generatedUrl}
                      alt={copy.thanksPhotoCaption}
                      draggable={false}
                    />
                  ) : null}
                  {shot.phase === "developing" ? (
                    <span className="portfolio-polaroid-noise" aria-hidden />
                  ) : null}
                  {shot.phase === "error" ? (
                    <span className="portfolio-polaroid-failed">{copy.thanksPhotoFailed}</span>
                  ) : null}
                  <span className="portfolio-polaroid-sheen" aria-hidden />
                </div>
                <figcaption>
                  {shot.phase === "ready"
                    ? copy.thanksPhotoCaption
                    : shot.phase === "error"
                      ? shot.error || copy.thanksPhotoFailed
                      : copy.thanksShutterBusy}
                </figcaption>
              </figure>
            </div>
          ) : null}

          <div className={`portfolio-polaroid-camera${cameraState === "ready" ? " is-live" : ""}${shutterBusy ? " is-busy" : ""}`}>
            <NextImage
              src="/assets/hero/polaroid-camera-front-v2.webp"
              alt=""
              width={1200}
              height={800}
              sizes="(max-width: 670px) 260px, 360px"
            />
            <button
              type="button"
              className="portfolio-polaroid-shutter"
              onClick={shutter}
              disabled={shutterBusy}
              aria-label={shutterLabel}
            >
              {!shot && !shutterBusy ? <span className="portfolio-polaroid-hand" aria-hidden>👇</span> : null}
              <span className="portfolio-polaroid-ripple" aria-hidden />
            </button>
          </div>

          {flash ? <span className="portfolio-thanks-flash" aria-hidden /> : null}

          {!shot && cameraState === "idle" ? (
            <p className="portfolio-thanks-hint" aria-live="polite">{copy.thanksShutterTry}</p>
          ) : null}
          <Link className="portfolio-action portfolio-action-silver portfolio-thanks-gallery-button" href="/polaroids">
            {copy.thanksGalleryLink}
          </Link>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="portfolio-camera-dialog"
        aria-labelledby="camera-title"
        onClose={handleDialogClose}
        onClick={handleDialogClick}
      >
        <div className="portfolio-camera-panel">
          <header className="portfolio-camera-heading">
            <div>
              <span>{copy.thanksCameraEyebrow}</span>
              <h2 id="camera-title">{copy.thanksCameraTitle}</h2>
            </div>
            <button type="button" className="portfolio-camera-close" onClick={closeCamera} aria-label={copy.thanksCameraClose}>
              <X size={18} aria-hidden />
            </button>
          </header>

          <div className={`portfolio-camera-viewfinder is-${cameraState}`}>
            <video
              ref={videoRef}
              className="portfolio-camera-video"
              autoPlay
              muted
              playsInline
              aria-label={copy.thanksCameraPreview}
            />
            <span className="portfolio-camera-grid" aria-hidden />
            {cameraState === "requesting" ? (
              <div className="portfolio-camera-overlay">
                <span className="portfolio-camera-spinner" aria-hidden />
                <p>{copy.thanksCameraRequesting}</p>
              </div>
            ) : null}
            {cameraState === "error" ? (
              <div className="portfolio-camera-overlay is-error">
                <p>{cameraError}</p>
                <button type="button" className="portfolio-camera-retry" onClick={() => void openCamera()}>
                  {copy.thanksCameraRetry}
                </button>
              </div>
            ) : null}
            {cameraState === "ready" ? (
              <span className="portfolio-camera-live"><i aria-hidden />{copy.thanksCameraLive}</span>
            ) : null}
            {flash ? <span className="portfolio-camera-flash" aria-hidden /> : null}
          </div>

          <p className="portfolio-camera-hint">
            {cameraState === "ready" ? copy.thanksCameraReady : copy.thanksCameraHint}
          </p>

          <label className="portfolio-camera-consent">
            <input
              type="checkbox"
              checked={saveToGallery}
              onChange={(event) => setSaveToGallery(event.target.checked)}
            />
            <span>
              <strong>{copy.thanksSaveToGallery}</strong>
              <small>{copy.thanksSaveToGalleryHint}</small>
            </span>
          </label>

          <div className="portfolio-camera-actions">
            <button type="button" className="portfolio-camera-cancel" onClick={closeCamera}>
              {copy.thanksCancel}
            </button>
            <button
              type="button"
              className="portfolio-camera-shutter"
              onClick={() => void capture()}
              disabled={cameraState !== "ready"}
              aria-label={copy.thanksCapture}
            >
              <span aria-hidden />
            </button>
            <span className="portfolio-camera-privacy">{copy.thanksPrivacy}</span>
          </div>
        </div>
      </dialog>
    </section>
  );
}

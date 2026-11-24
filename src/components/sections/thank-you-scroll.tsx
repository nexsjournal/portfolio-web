"use client";

import { ImagePlus, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type MouseEvent, type PointerEvent } from "react";

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
const QUOTA_STORAGE_KEY = "lex-polaroid-quota-reset";

function formatQuotaCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function cameraErrorMessage(error: unknown, copy: (typeof portfolioCopy)[SiteLang]) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return copy.thanksCameraDenied;
  if (name === "NotFoundError" || name === "OverconstrainedError") return copy.thanksCameraMissing;
  if (name === "NotReadableError") return copy.thanksCameraBusy;
  if (error instanceof Error && error.message === "unsupported") return copy.thanksCameraUnsupported;
  if (error instanceof Error && error.message === "preview") return copy.thanksCameraNoPreview;
  return copy.thanksCameraFailed;
}

function cameraEnvironmentHint(copy: (typeof portfolioCopy)[SiteLang]) {
  if (typeof window === "undefined") return "";
  if (window.self !== window.top) return copy.thanksCameraFrameHint;

  const ua = navigator.userAgent;
  if (/MicroMessenger|QQ\/|DingTalk|Lark|Feishu|aweme|xhsdiscover/i.test(ua)) {
    return copy.thanksCameraEmbeddedHint;
  }
  return "";
}

function cameraErrorHint(error: unknown, copy: (typeof portfolioCopy)[SiteLang]) {
  const name = error instanceof DOMException ? error.name : "";
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const platformHint = /Macintosh|Mac OS X/i.test(ua)
    ? copy.thanksCameraMacHint
    : /Windows/i.test(ua)
      ? copy.thanksCameraWindowsHint
      : "";
  const environmentHint = cameraEnvironmentHint(copy);

  if (name === "NotAllowedError" || name === "SecurityError") {
    return [copy.thanksCameraDeniedHint, platformHint, environmentHint].filter(Boolean).join(" ");
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return [copy.thanksCameraMissingHint, platformHint, environmentHint].filter(Boolean).join(" ");
  }
  if (name === "NotReadableError") {
    return [copy.thanksCameraBusyHint, environmentHint].filter(Boolean).join(" ");
  }
  if (error instanceof Error && error.message === "preview") {
    return [copy.thanksCameraBusyHint, platformHint, environmentHint].filter(Boolean).join(" ");
  }
  return [environmentHint, platformHint].filter(Boolean).join(" ");
}

async function applyPreferredCameraConstraints(stream: MediaStream) {
  const track = stream.getVideoTracks()[0];
  if (!track?.applyConstraints) return;
  try {
    await track.applyConstraints({
      width: { ideal: 1280 },
      height: { ideal: 960 },
    });
  } catch {
    // The stream is already usable; ignore browsers that reject post-constraints.
  }
}

async function listCameras(mediaDevices: MediaDevices) {
  try {
    const devices = await mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput" && device.deviceId);
  } catch {
    return [];
  }
}

function isMobileCameraDevice() {
  const { userAgent, maxTouchPoints, userAgentData } = navigator as Navigator & {
    userAgentData?: { mobile?: boolean };
  };
  return userAgentData?.mobile === true || /Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)
    || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
}

function isBuiltInCamera(camera: MediaDeviceInfo) {
  const { label } = camera;
  if (/iPhone|Android|Continuity|Desk View|接续相机|連續互通|Camo|DroidCam|Virtual|虚拟|虛擬|External|外接/i.test(label)) return false;
  return /FaceTime(?: HD)? Camera|\b(?:built[- ]?in|integrated|internal)\b|内置|內置|内建|內建|内蔵|내장/i.test(label);
}

async function requestCameraStream(deviceId: string, {
  isCurrent,
  showPreview,
  releaseStream,
  setDevices,
}: {
  isCurrent: () => boolean;
  showPreview: (stream: MediaStream) => Promise<boolean>;
  releaseStream: () => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
}) {
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices?.getUserMedia) throw new Error("unsupported");

  const assertCurrent = () => {
    if (!isCurrent()) throw new DOMException("Camera request cancelled", "AbortError");
  };

  let cameras: MediaDeviceInfo[] = [];
  let listedWithStream = false;
  const attemptedIds = new Set<string>();
  const scanCameras = async () => {
    const devices = await listCameras(mediaDevices);
    assertCurrent();
    if (devices.length) {
      cameras = devices;
      setDevices(devices);
    }
  };

  const open = async (video: true | MediaTrackConstraints, exactId = "") => {
    assertCurrent();
    if (exactId) attemptedIds.add(exactId);
    const stream = await mediaDevices.getUserMedia({ audio: false, video });
    if (!isCurrent()) {
      stream.getTracks().forEach((track) => track.stop());
      assertCurrent();
    }
    const track = stream.getVideoTracks()[0];
    const [hasFrame] = await Promise.all([
      showPreview(stream),
      listedWithStream ? undefined : scanCameras(),
    ]);
    listedWithStream = true;
    assertCurrent();

    const trackId = track?.getSettings?.().deviceId;
    const label = track?.label;
    const camera = cameras.find((camera) => camera.deviceId === (trackId || exactId))
      ?? (label ? cameras.find((camera) => camera.label === label) : undefined);
    const activeId = camera?.deviceId || trackId || exactId;
    if (activeId) attemptedIds.add(activeId);
    if (!hasFrame || track?.readyState !== "live") throw new Error("preview");
    return { stream, activeId, label: camera?.label || label };
  };

  const exactCamera = (id: string) => ({ deviceId: { exact: id } });
  if (deviceId) return open(exactCamera(deviceId), deviceId);

  let firstError: unknown;
  const tryCamera = async (video: true | MediaTrackConstraints, exactId = "", afterUsablePreview = false) => {
    try {
      return await open(video, exactId);
    } catch (error) {
      assertCurrent();
      releaseStream();
      if (!afterUsablePreview && error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError")) throw error;
      firstError ??= error;
      return null;
    }
  };
  const tryExactCamera = (id: string, afterUsablePreview = false) => tryCamera(exactCamera(id), id, afterUsablePreview);
  const availableBuiltIn = () => cameras.find((camera) => isBuiltInCamera(camera) && !attemptedIds.has(camera.deviceId));

  const mobile = isMobileCameraDevice();
  if (mobile) {
    const frontCamera = await tryCamera({ facingMode: { ideal: "user" } });
    if (frontCamera) return frontCamera;
  } else {
    await scanCameras();
    const knownBuiltIn = availableBuiltIn();
    if (knownBuiltIn) {
      const builtIn = await tryExactCamera(knownBuiltIn.deviceId);
      if (builtIn) return builtIn;
    }
  }

  const defaultCamera = await tryCamera(true);
  const builtIn = mobile ? undefined : availableBuiltIn();
  if (defaultCamera) {
    if (!builtIn || defaultCamera.label === builtIn.label) return defaultCamera;
    releaseStream();
    const preferred = await tryExactCamera(builtIn.deviceId, true);
    if (preferred) return preferred;

    if (defaultCamera.activeId) {
      const previous = await tryExactCamera(defaultCamera.activeId, true);
      if (previous) return previous;
    }
    const restored = await tryCamera(true, "", true);
    if (restored) return restored;
  }

  if (!listedWithStream) await scanCameras();
  const fallbackCameras = cameras.filter((camera) => !attemptedIds.has(camera.deviceId));
  if (!mobile) fallbackCameras.sort((left, right) => Number(isBuiltInCamera(right)) - Number(isBuiltInCamera(left)));
  for (const camera of fallbackCameras.slice(0, 4)) {
    const fallback = await tryExactCamera(camera.deviceId, Boolean(defaultCamera));
    if (fallback) return fallback;
  }

  throw firstError ?? new Error("camera");
}

function waitForVideoFrame(video: HTMLVideoElement) {
  const hasFrame = () => video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
  if (hasFrame()) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const finish = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("loadeddata", checkFrame);
      video.removeEventListener("canplay", checkFrame);
      resolve(hasFrame());
    };
    const checkFrame = () => {
      if (hasFrame()) finish();
    };
    video.addEventListener("loadeddata", checkFrame);
    video.addEventListener("canplay", checkFrame);
    const timeout = window.setTimeout(finish, 4000);
  });
}

export function ThankYouScroll({ lang }: { lang: SiteLang }) {
  const copy = portfolioCopy[lang];
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraHint, setCameraHint] = useState<string | null>(null);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraDeviceId, setCameraDeviceId] = useState("");
  const [activeCameraLabel, setActiveCameraLabel] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [flash, setFlash] = useState(false);
  const [quotaResetAt, setQuotaResetAt] = useState<number | null>(null);
  const [quotaNow, setQuotaNow] = useState(() => Date.now());

  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestId = useRef(0);
  const dragSession = useRef<DragSession | null>(null);
  const shotId = useRef(0);
  const rawUrlRef = useRef<string | null>(null);
  const generatedUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const flashTimer = useRef<number | null>(null);

  const activateQuota = useCallback((resetAt: number) => {
    setQuotaResetAt(resetAt);
    setQuotaNow(Date.now());
    try {
      window.localStorage.setItem(QUOTA_STORAGE_KEY, String(resetAt));
    } catch {
      // Ignore private-mode or storage-disabled failures.
    }
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const stopStream = useCallback(() => {
    cameraRequestId.current += 1;
    releaseStream();
  }, [releaseStream]);

  const closeCamera = useCallback(() => {
    stopStream();
    setCameraState("idle");
    setCameraError(null);
    setCameraHint(null);
    setCameraDevices([]);
    setCameraDeviceId("");
    setActiveCameraLabel("");
    setDialogOpen(false);
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [stopStream]);

  useEffect(() => {
    document.body.classList.toggle("portfolio-camera-open", dialogOpen);
    return () => document.body.classList.remove("portfolio-camera-open");
  }, [dialogOpen]);

  useEffect(() => {
    return () => {
      stopStream();
      abortRef.current?.abort();
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (rawUrlRef.current) URL.revokeObjectURL(rawUrlRef.current);
      if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
    };
  }, [stopStream]);

  useEffect(() => {
    let cancelled = false;

    try {
      const stored = Number(window.localStorage.getItem(QUOTA_STORAGE_KEY));
      if (stored > Date.now()) activateQuota(stored);
      else if (stored) window.localStorage.removeItem(QUOTA_STORAGE_KEY);
    } catch {
      // Ignore private-mode or storage-disabled failures.
    }

    fetch("/api/thanks/polaroid/status", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { exhausted?: boolean; resetAt?: number } | null) => {
        if (cancelled || !data?.exhausted || typeof data.resetAt !== "number") return;
        if (data.resetAt > Date.now()) activateQuota(data.resetAt);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [activateQuota]);

  useEffect(() => {
    if (!dialogOpen || !quotaResetAt) return;
    const timer = window.setInterval(() => setQuotaNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [dialogOpen, quotaResetAt]);

  useEffect(() => {
    if (!quotaResetAt || quotaResetAt > quotaNow) return;
    setQuotaResetAt(null);
    try {
      window.localStorage.removeItem(QUOTA_STORAGE_KEY);
    } catch {
      // Ignore private-mode or storage-disabled failures.
    }
  }, [quotaNow, quotaResetAt]);

  const quotaActive = Boolean(quotaResetAt && quotaResetAt > quotaNow);
  const quotaCountdown = quotaActive && quotaResetAt
    ? formatQuotaCountdown(quotaResetAt - quotaNow)
    : "";

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
        const payload = await response.json().catch(() => null) as { code?: string; resetAt?: number } | null;
        if (payload?.code === "quota_exhausted") {
          const retryAfter = Number(response.headers.get("retry-after")) || 0;
          const resetAt = typeof payload.resetAt === "number"
            ? payload.resetAt
            : Date.now() + retryAfter * 1000;
          if (resetAt > Date.now()) activateQuota(resetAt);
          throw new Error(copy.thanksQuotaExhausted);
        }
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
  }, [activateQuota, copy.thanksDevelopError, copy.thanksQuotaExhausted, copy.thanksRateLimited]);

  const openCamera = useCallback(async (deviceId = "") => {
    stopStream();
    const requestId = cameraRequestId.current;
    const isCurrent = () => requestId === cameraRequestId.current && Boolean(dialogRef.current?.open);
    setCameraError(null);
    setCameraHint(cameraEnvironmentHint(copy) || null);
    setCameraDeviceId(deviceId);
    setActiveCameraLabel("");
    setCameraState("requesting");
    setQuotaNow(Date.now());
    setDialogOpen(true);
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();

    if (!window.isSecureContext) {
      setCameraState("error");
      setCameraError(copy.thanksCameraInsecure);
      return;
    }

    try {
      const { stream, label } = await requestCameraStream(deviceId, {
        isCurrent,
        releaseStream,
        setDevices: setCameraDevices,
        showPreview: (stream) => {
          streamRef.current = stream;
          const video = videoRef.current;
          if (!video || !stream.getVideoTracks().length) return Promise.resolve(false);
          video.srcObject = stream;
          void video.play().catch(() => undefined);
          return waitForVideoFrame(video);
        },
      });
      if (!isCurrent()) return;

      setActiveCameraLabel(label ?? "");
      setCameraState("ready");
      setCameraHint(null);
      void applyPreferredCameraConstraints(stream);
    } catch (error) {
      if (!isCurrent()) return;
      releaseStream();
      setCameraState("error");
      setCameraError(cameraErrorMessage(error, copy));
      setCameraHint(cameraErrorHint(error, copy) || null);
    }
  }, [copy, releaseStream, stopStream]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (quotaActive || cameraState !== "ready" || !video) return;

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
  }, [cameraState, closeCamera, copy.thanksCameraFailed, developPhoto, quotaActive, saveToGallery]);

  const uploadPhoto = useCallback(async (file: File) => {
    if (quotaActive) return;

    if (!file.type.startsWith("image/")) {
      stopStream();
      setCameraState("error");
      setCameraError(copy.thanksUploadInvalid);
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      stopStream();
      setCameraState("error");
      setCameraError(copy.thanksUploadTooLarge);
      return;
    }

    closeCamera();
    abortRef.current?.abort();
    if (rawUrlRef.current) URL.revokeObjectURL(rawUrlRef.current);
    if (generatedUrlRef.current) {
      URL.revokeObjectURL(generatedUrlRef.current);
      generatedUrlRef.current = null;
    }

    const rawUrl = URL.createObjectURL(file);
    rawUrlRef.current = rawUrl;
    setPosition({ x: 0, y: 0 });
    setShot({ id: ++shotId.current, rawUrl, phase: "developing", galleryRequested: saveToGallery });
    void developPhoto(file, rawUrl, saveToGallery);
  }, [
    closeCamera,
    copy.thanksUploadInvalid,
    copy.thanksUploadTooLarge,
    developPhoto,
    quotaActive,
    saveToGallery,
    stopStream,
  ]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadPhoto(file);
  };

  const shutterBusy = cameraState === "requesting" || cameraState === "capturing" || shot?.phase === "developing";

  const shutter = () => {
    if (shutterBusy) return;
    void openCamera();
  };

  const handleDialogClose = () => {
    if (!dialogRef.current?.open) closeCamera();
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

  const shutterLabel = shutterBusy ? copy.thanksShutterBusy : shot ? copy.thanksShutterAgain : copy.thanksShutter;
  const cameraReadyHint = quotaActive ? copy.thanksCameraPreviewReady : copy.thanksCameraReady;
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
              <h2 id="camera-title">{quotaActive ? copy.thanksCameraPreview : copy.thanksCameraTitle}</h2>
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
                <p>{cameraDeviceId ? copy.thanksCameraSwitching : copy.thanksCameraRequesting}</p>
              </div>
            ) : null}
            {cameraState === "error" ? (
              <div className="portfolio-camera-overlay is-error">
                <p>{cameraError}</p>
                <div className="portfolio-camera-error-actions">
                  <button type="button" className="portfolio-camera-retry" onClick={() => void openCamera(cameraDeviceId)}>
                    {copy.thanksCameraRetry}
                  </button>
                  <button type="button" className="portfolio-camera-fallback" onClick={() => fileInputRef.current?.click()} disabled={quotaActive}>
                    {copy.thanksCameraUploadCta}
                  </button>
                </div>
              </div>
            ) : null}
            {cameraState === "ready" ? (
              <span className="portfolio-camera-live"><i aria-hidden />{copy.thanksCameraLive}</span>
            ) : null}
            {flash ? <span className="portfolio-camera-flash" aria-hidden /> : null}
          </div>

          <p className={`portfolio-camera-hint${cameraState === "error" ? " is-error" : ""}`} aria-live="polite">
            {cameraState === "error" && cameraHint
              ? cameraHint
              : cameraState === "ready"
                ? cameraReadyHint
                : cameraState === "requesting" && cameraHint
                  ? cameraHint
                  : copy.thanksCameraHint}
          </p>

          {cameraDevices.length ? (
            <label className="portfolio-camera-device">
              <span>{copy.thanksCameraDevice}</span>
              <select
                value={cameraDeviceId}
                onChange={(event) => void openCamera(event.target.value)}
                disabled={cameraState === "requesting" || cameraState === "capturing"}
              >
                <option value="">
                  {!cameraDeviceId && activeCameraLabel
                    ? `${copy.thanksCameraAutomatic} · ${activeCameraLabel}`
                    : copy.thanksCameraAutomatic}
                </option>
                {cameraDevices.map((camera, index) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `${copy.thanksCameraDevice} ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="portfolio-camera-source-row">
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
            <button
              type="button"
              className="portfolio-camera-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={quotaActive || cameraState === "capturing"}
            >
              <ImagePlus size={18} aria-hidden />
              <span>
                <strong>{copy.thanksUploadTitle}</strong>
                <small>{copy.thanksUploadHint}</small>
              </span>
            </button>
            <input
              ref={fileInputRef}
              className="portfolio-camera-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={quotaActive || cameraState === "capturing"}
            />
          </div>

          {quotaActive ? (
            <div className="portfolio-camera-quota" id="camera-quota">
              <p>{copy.thanksCameraQuotaHint}</p>
              <p className="portfolio-camera-quota-timer" role="timer">
                <span>{copy.thanksQuotaCountdown}</span>
                <strong>{quotaCountdown}</strong>
              </p>
            </div>
          ) : null}

          <div className="portfolio-camera-actions">
            <button type="button" className="portfolio-camera-cancel" onClick={closeCamera}>
              {copy.thanksCancel}
            </button>
            <button
              type="button"
              className="portfolio-camera-shutter"
              onClick={() => void capture()}
              disabled={quotaActive || cameraState !== "ready"}
              aria-label={copy.thanksCapture}
              aria-describedby={quotaActive ? "camera-quota" : undefined}
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

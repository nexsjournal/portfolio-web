"use client";

import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import {
  Aperture,
  Bookmark,
  CalendarDays,
  CameraSparkle,
  Compass,
  Export,
  Film,
  GalleryView,
  Gauge,
  Images,
  Keyboard,
  Luggage,
  MapPinned,
  Monitor,
  Mountain,
  Navigation,
  NotebookPen,
  PhotoFrame,
  Plane,
  Play,
  Record,
  Route,
  Scissors,
  Sparkles,
  Subtitles,
  Sunrise,
  type KubaiIconComponent,
} from "kubai-icons-react";

import { type CaseStudy, type Localized, caseStudies, getCaseStudy } from "@/content/case-studies";
import { type Product, getProductBySlug, getProductIconPath } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { SiteChrome } from "./site-chrome";

function localized(value: Localized, lang: "zh" | "en") {
  return value[lang];
}
type CaseOrigin = "home" | "projects" | "index";

function subscribeToHistory(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSearchSnapshot() {
  return window.location.search;
}

function getServerSearchSnapshot() {
  return "";
}

function normalizeOrigin(value: string | null): CaseOrigin | null {
  return value === "home" || value === "projects" || value === "index" ? value : null;
}

function getBackHref(origin: CaseOrigin | null) {
  if (origin === "index") return "/projects";
  if (origin === "projects") return "/#products";
  return "/";
}

function getBackLabel(origin: CaseOrigin | null, lang: "zh" | "en") {
  if (origin === "index") return lang === "zh" ? "返回全部项目" : "Back to all projects";
  if (origin === "projects") return lang === "zh" ? "返回更多项目" : "Back to more projects";
  return lang === "zh" ? "返回首页" : "Back home";
}

const caseDecor: Record<string, { color: string; icons: KubaiIconComponent[] }> = {
  echosnap: {
    color: "#2f9e75",
    icons: [Images, GalleryView, PhotoFrame, Aperture, CameraSparkle, Sparkles],
  },
  "travel-route": {
    color: "#3f7fb8",
    icons: [Route, MapPinned, Plane, Luggage, Compass, Sparkles],
  },
  altitudeshot: {
    color: "#2f8f76",
    icons: [Mountain, Gauge, Compass, Sunrise, Navigation, Sparkles],
  },
  flowdo: {
    color: "#6e60db",
    icons: [CalendarDays, NotebookPen, Bookmark, Keyboard, Monitor, Sparkles],
  },
  "aray-studio": {
    color: "#1e8fb3",
    icons: [Record, Film, Scissors, Subtitles, Export, Play],
  },
  colpix: {
    color: "#24c98b",
    icons: [Images, GalleryView, PhotoFrame, Aperture, CameraSparkle, Sparkles],
  },
  mycelia: {
    color: "#ef8b3c",
    icons: [CalendarDays, NotebookPen, Bookmark, Monitor, Compass, Sparkles],
  },
  "folovibe-key": {
    color: "#24c98b",
    icons: [Record, Keyboard, Subtitles, Monitor, Sparkles],
  },
};

type OrbitPlacement = { x: number; y: number; rotate: number };

const orbitZones = [
  { x: [4, 17], y: [10, 21] },
  { x: [79, 91], y: [8, 19] },
  { x: [3, 13], y: [31, 47] },
  { x: [83, 93], y: [29, 45] },
  { x: [10, 24], y: [62, 76] },
  { x: [72, 86], y: [61, 77] },
  { x: [27, 37], y: [5, 13] },
  { x: [62, 72], y: [5, 13] },
] as const;

const compactOrbitZones = [
  { x: [4, 16], y: [6, 15] },
  { x: [79, 92], y: [4, 13] },
  { x: [7, 20], y: [80, 90] },
  { x: [72, 86], y: [82, 92] },
] as const;

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomOrbit(count: number, compact = false): OrbitPlacement[] {
  const zones = [...(compact ? compactOrbitZones : orbitZones)].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, index) => {
    const zone = zones[index % zones.length];
    return {
      x: randomInRange(zone.x[0], zone.x[1]),
      y: randomInRange(zone.y[0], zone.y[1]),
      rotate: randomInRange(-15, 15),
    };
  });
}

export function CaseStudyPage({ study, testCheckoutUrl }: { study: CaseStudy; testCheckoutUrl?: string }) {
  const { lang } = useSiteLanguage();
  const product = getProductBySlug(study.productSlug);
  const next = getCaseStudy(study.next);
  const studyIndex = caseStudies.findIndex((item) => item.slug === study.slug);
  const previous = caseStudies[(studyIndex - 1 + caseStudies.length) % caseStudies.length];
  const [orbit, setOrbit] = useState<OrbitPlacement[]>([]);
  const [draggingOrbit, setDraggingOrbit] = useState<number | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const orbitDrag = useRef<{
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    width: number;
    height: number;
  } | null>(null);
  const search = useSyncExternalStore(subscribeToHistory, getSearchSnapshot, getServerSearchSnapshot);
  const origin = normalizeOrigin(new URLSearchParams(search).get("from"));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const randomize = () => {
      const count = media.matches ? compactOrbitZones.length : caseDecor[study.productSlug]?.icons.length ?? 6;
      setOrbit(randomOrbit(count, media.matches));
    };
    const frame = window.requestAnimationFrame(randomize);
    media.addEventListener("change", randomize);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", randomize);
    };
  }, [study.productSlug]);

  if (!product) return null;
  const decor = caseDecor[product.slug] ?? caseDecor.echosnap;
  const appStoreUrl = product.platformUrl;
  const appLinkLabel = lang === "zh"
    ? product.actionLabel ?? "打开 App"
    : product.actionLabelEn ?? "View app";
  const titleLines = localized(study.title, lang).split("\n");
  const summary = `${lang === "zh" ? product.summary : product.summaryEn ?? product.summary} ${localized(study.intro, lang)}`;
  const backHref = getBackHref(origin);
  const backLabel = getBackLabel(origin, lang);

  function startOrbitDrag(event: ReactPointerEvent<HTMLSpanElement>, index: number) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const placement = orbit[index];
    const bounds = orbitRef.current?.getBoundingClientRect();
    if (!placement || !bounds) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    orbitDrag.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: placement.x,
      originY: placement.y,
      width: bounds.width,
      height: bounds.height,
    };
    setDraggingOrbit(index);
  }

  function moveOrbitDrag(event: ReactPointerEvent<HTMLSpanElement>) {
    const drag = orbitDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const x = Math.min(97, Math.max(1, drag.originX + ((event.clientX - drag.startX) / drag.width) * 100));
    const y = Math.min(94, Math.max(1, drag.originY + ((event.clientY - drag.startY) / drag.height) * 100));
    setOrbit((current) => current.map((item, index) => index === drag.index ? { ...item, x, y } : item));
  }

  function endOrbitDrag(event: ReactPointerEvent<HTMLSpanElement>) {
    if (orbitDrag.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    orbitDrag.current = null;
    setDraggingOrbit(null);
  }

  return (
    <main id="main-content" className="case-page" data-case={study.slug} tabIndex={-1}>
      <SiteChrome
        backHref={backHref}
        backLabel={backLabel}
        extraActions={
          <>
            <Link href="/projects" className="case-chrome-link">{lang === "zh" ? "全部案例" : "Case studies"}</Link>
            {appStoreUrl ? (
              <a className="case-try" href={appStoreUrl} target="_blank" rel="noreferrer">
                {appLinkLabel} <ArrowUpRight size={14} aria-hidden />
              </a>
            ) : null}
            {testCheckoutUrl ? (
              <a className="case-try" href={testCheckoutUrl} target="_blank" rel="noreferrer">
                {lang === "zh" ? "测试购买 · 不扣款" : "Test purchase · No charge"} <ArrowUpRight size={14} aria-hidden />
              </a>
            ) : null}
          </>
        }
      />

      <header className="case-hero">
        <div ref={orbitRef} className="case-orbit" aria-hidden>
          {orbit.map((placement, index) => {
            const Icon = decor.icons[index];
            if (!Icon) return null;
            return (
              <span
                key={Icon.displayName ?? index}
                className={`case-orbit-item case-orbit-glyph case-orbit-${index + 1}${draggingOrbit === index ? " is-dragging" : ""}`}
                style={{ left: `${placement.x}%`, top: `${placement.y}%`, transform: `rotate(${placement.rotate}deg)` }}
                onPointerDown={(event) => startOrbitDrag(event, index)}
                onPointerMove={moveOrbitDrag}
                onPointerUp={endOrbitDrag}
                onPointerCancel={endOrbitDrag}
              >
                <Icon size={72} color={decor.color} trigger="none" />
              </span>
            );
          })}
        </div>
        <p className="case-kicker">{product.platform} · CASE STUDY</p>
        <h1>{titleLines.map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="case-hero-summary">{summary}</p>
        <p className="case-meta">
          {localized(study.meta.role, lang)} <span /> {study.meta.platform} <span /> {study.meta.year}
        </p>
      </header>

      <section id="what-i-designed" className="case-what" aria-labelledby="what-title">
        <h2 id="what-title">{lang === "zh" ? "产品展示" : "Product showcase"}</h2>
        <CasePreview product={product} lang={lang} />
      </section>

      {previous || next ? (
        <section className="case-next" aria-labelledby="next-title">
          <p className="case-next-kicker">{lang === "zh" ? "继续浏览" : "Keep exploring"}</p>
          <h2 id="next-title">{lang === "zh" ? "继续看作品" : "Keep exploring"}</h2>
          <div className="case-next-grid">
            {previous ? (
              <Link href={`/projects/${previous.slug}${origin ? `?from=${origin}` : ""}`} className="case-next-card case-next-card-prev">
                <NextCaseIcon slug={previous.productSlug} />
                <span>
                  <small className="case-next-label">{lang === "zh" ? "上一件" : "Previous"}</small>
                  <strong>{localized(previous.title, lang).replace("\n", " ")}</strong>
                  <em>{localized(previous.subtitle, lang)}</em>
                </span>
                <ArrowLeft size={22} aria-hidden />
              </Link>
            ) : null}
            {next ? (
              <Link href={`/projects/${next.slug}${origin ? `?from=${origin}` : ""}`} className="case-next-card case-next-card-next">
                <NextCaseIcon slug={next.productSlug} />
                <span>
                  <small className="case-next-label">{lang === "zh" ? "下一件" : "Up next"}</small>
                  <strong>{localized(next.title, lang).replace("\n", " ")}</strong>
                  <em>{localized(next.subtitle, lang)}</em>
                </span>
                <ArrowUpRight size={22} aria-hidden />
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="case-footer">
        <Link href="/#top"><ArrowLeft size={15} aria-hidden /> {lang === "zh" ? "回到首页" : "Back home"}</Link>
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}
function NextCaseIcon({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;
  return <Image src={getProductIconPath(product)} alt="" width={64} height={64} />;
}

function CasePreview({ product, lang }: { product: Product; lang: "zh" | "en" }) {
  const shots = product.screenshots ?? [];
  const [index, setIndex] = useState(0);
  if (!shots.length) return null;
  const layout = product.screenshotLayout ?? "phone";
  const imageWidth = product.screenshotWidth ?? 1284;
  const imageHeight = product.screenshotHeight ?? 2778;
  const total = shots.length;
  const previousIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  const slideClass = layout === "desktop" ? "case-screen-window" : "case-phone";
  const slides = total === 1
    ? [{ offset: 0, shotIndex: 0 }]
    : total === 2
      ? [{ offset: -1, shotIndex: previousIndex }, { offset: 0, shotIndex: index }]
      : [
          { offset: -1, shotIndex: previousIndex },
          { offset: 0, shotIndex: index },
          { offset: 1, shotIndex: nextIndex },
        ];

  return (
    <div className="case-demo" data-app={product.slug} data-layout={layout}>
      <div className="case-demo-head">
        <span><i /> {lang === "zh" ? "真实界面预览" : "Live screen preview"}</span>
        <span aria-live="polite">{product.nameEn ?? product.name} · {index + 1}/{total}</span>
      </div>
      <div className="case-demo-stage">
        {slides.map(({ offset, shotIndex }) => (
          <div
            key={shotIndex}
            className={`${slideClass} case-phone-slide`}
            data-offset={offset}
            aria-hidden={offset !== 0}
          >
            <Image
              src={shots[shotIndex]}
              alt={offset === 0 ? `${product.name} ${shotIndex + 1}` : ""}
              width={imageWidth}
              height={imageHeight}
              sizes={layout === "desktop" ? "(max-width: 760px) 82vw, 700px" : "(max-width: 760px) 52vw, 260px"}
              priority={shotIndex === 0}
            />
          </div>
        ))}
        <button className="case-arrow case-arrow-left" type="button" onClick={() => setIndex(previousIndex)} aria-label={lang === "zh" ? "上一张" : "Previous screen"}>
          <ChevronLeft size={18} aria-hidden />
        </button>
        <button className="case-arrow case-arrow-right" type="button" onClick={() => setIndex(nextIndex)} aria-label={lang === "zh" ? "下一张" : "Next screen"}>
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
      <div className={`case-demo-controls${product.platformUrl ? " case-demo-controls--with-link" : ""}`}>
        <div className="case-demo-app">
          <Image src={getProductIconPath(product)} alt="" width={42} height={42} />
          <span><strong>{lang === "zh" ? product.name : product.nameEn ?? product.name}</strong><em>{product.platform} · {product.size}</em></span>
        </div>
        <div className="case-demo-thumbs" role="group" aria-label={lang === "zh" ? "界面缩略图" : "Screen thumbnails"}>
          {shots.map((src, shotIndex) => (
            <button
              key={src}
              type="button"
              className={shotIndex === index ? "is-active" : ""}
              onClick={() => setIndex(shotIndex)}
              aria-label={`${lang === "zh" ? "查看第" : "Show screen"} ${shotIndex + 1}`}
              aria-pressed={shotIndex === index}
            >
              <Image src={src} alt="" width={imageWidth} height={imageHeight} sizes="56px" />
            </button>
          ))}
        </div>
        {product.platformUrl ? (
          <a className="case-demo-link" href={product.platformUrl} target="_blank" rel="noreferrer">
            {lang === "zh" ? product.actionLabel ?? "App Store" : product.actionLabelEn ?? "App Store"} <ArrowUpRight size={14} aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}

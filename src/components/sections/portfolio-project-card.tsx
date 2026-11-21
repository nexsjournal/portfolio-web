"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";

import { getCaseStudyByProductSlug } from "@/content/case-studies";
import { type Product, getProductIconPath } from "@/content/products";
import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const projectHighlights: Partial<Record<string, { zh: string; en: string; badge: string }>> = {
  echosnap: { zh: "滑一滑，整理相册里的照片和视频。", en: "Sort photos and videos with a swipe.", badge: "Swipe to sort" },
  "travel-route": { zh: "把走过的路线，变成一段能分享的动画。", en: "Turn the route you took into an animated travel video.", badge: "On the road" },
  altitudeshot: { zh: "实时看海拔，把到达这一刻拍成一张登顶卡片。", en: "See your altitude live and capture the moment with a summit card.", badge: "Take it higher" },
  flowdo: { zh: "待办、句子与手账，先记下来，再慢慢整理。", en: "Tasks, saved sentences, and journal pages. Capture first, organize later.", badge: "Quietly local" },
  "aray-studio": { zh: "录屏、剪辑、字幕与导出，在一个 Mac App 里做完。", en: "Record, edit, caption, and export in one Mac app.", badge: "One take, one app" },
  colpix: { zh: "网页图片、截图与影音素材，收进一个本地图库。", en: "Web images, screenshots, and media references in one local library.", badge: "Drag it in" },
  mycelia: { zh: "把九个平台的内容运营，收进一个本地工作台。", en: "Run nine-platform content operations from one local workspace.", badge: "One local desk" },
};

const projectStickers: Partial<Record<string, { left: string; right: string }>> = {
  flowdo: {
    left: "/assets/hero/project-stickers/flowdo-left.png",
    right: "/assets/hero/project-stickers/flowdo-right.png",
  },
  "aray-studio": {
    left: "/assets/hero/project-stickers/aray-studio-left.png",
    right: "/assets/hero/project-stickers/aray-studio-right.png",
  },
  colpix: {
    left: "/assets/hero/project-stickers/colpix-left.png",
    right: "/assets/hero/project-stickers/colpix-right.png",
  },
  mycelia: {
    left: "/assets/hero/project-stickers/mycelia-left.png",
    right: "/assets/hero/project-stickers/mycelia-right.png",
  },
};

type CollagePreset = { x: number; y: number; rotate: number; width: number; z: number };

const collagePresets: Record<"phone" | "desktop", CollagePreset[][]> = {
  phone: [
    [{ x: 0, y: 4, rotate: -3, width: 38, z: 2 }],
    [
      { x: -18, y: 5, rotate: -6, width: 32, z: 2 },
      { x: 18, y: 1, rotate: 5, width: 36, z: 3 },
    ],
    [
      { x: -24, y: 6, rotate: -8, width: 28, z: 1 },
      { x: 0, y: 2, rotate: 2, width: 36, z: 4 },
      { x: 25, y: 6, rotate: 7, width: 30, z: 3 },
    ],
    [
      { x: -28, y: 8, rotate: -10, width: 25, z: 1 },
      { x: -8, y: 3, rotate: -4, width: 32, z: 3 },
      { x: 12, y: 5, rotate: 4, width: 34, z: 4 },
      { x: 30, y: 2, rotate: 9, width: 26, z: 2 },
    ],
    [
      { x: -31, y: 8, rotate: -10, width: 23, z: 1 },
      { x: -17, y: 2, rotate: -5, width: 28, z: 2 },
      { x: 0, y: 5, rotate: 1, width: 38, z: 5 },
      { x: 18, y: 1, rotate: 5, width: 29, z: 3 },
      { x: 32, y: 8, rotate: 9, width: 24, z: 4 },
    ],
  ],
  desktop: [
    [{ x: 0, y: 18, rotate: -2, width: 70, z: 2 }],
    [
      { x: -16, y: 10, rotate: -5, width: 55, z: 2 },
      { x: 17, y: 22, rotate: 4, width: 58, z: 3 },
    ],
    [
      { x: -23, y: 20, rotate: -7, width: 45, z: 1 },
      { x: 0, y: 8, rotate: 1, width: 50, z: 2 },
      { x: 24, y: 23, rotate: 6, width: 45, z: 3 },
    ],
    [
      { x: -27, y: 19, rotate: -8, width: 41, z: 2 },
      { x: -8, y: 7, rotate: -3, width: 45, z: 4 },
      { x: 10, y: 21, rotate: 3, width: 45, z: 1 },
      { x: 28, y: 9, rotate: 8, width: 41, z: 3 },
    ],
    [
      { x: -31, y: 23, rotate: -8, width: 36, z: 1 },
      { x: -15, y: 8, rotate: -4, width: 40, z: 3 },
      { x: 0, y: 20, rotate: 1, width: 44, z: 5 },
      { x: 16, y: 7, rotate: 4, width: 40, z: 2 },
      { x: 32, y: 23, rotate: 8, width: 36, z: 4 },
    ],
  ],
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCollage(shots: string[], layout: "phone" | "desktop", slug: string) {
  const preset = collagePresets[layout][Math.min(shots.length, 5) - 1] ?? collagePresets[layout][4];
  const random = seededRandom(hashString(`${slug}-${layout}-${shots.length}`));
  return shots.map((src, index) => {
    const base = preset[index % preset.length];
    const jitter = (range: number) => (random() * 2 - 1) * range;
    return {
      src,
      style: {
        "--collage-x": `${base.x + jitter(2.2)}%`,
        "--collage-y": `${base.y + jitter(2)}%`,
        "--collage-rotate": `${base.rotate + jitter(2.4)}deg`,
        "--collage-width": `${base.width + jitter(1.5)}%`,
        "--collage-z": base.z,
      } as CSSProperties,
    };
  });
}

function trackProjectPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty("--project-pointer-x", `${event.clientX - bounds.left}px`);
  card.style.setProperty("--project-pointer-y", `${event.clientY - bounds.top}px`);
}

export function PortfolioProjectCard({
  product,
  lang,
  origin = "home",
}: {
  product: Product;
  lang: SiteLang;
  origin?: "home" | "index";
}) {
  const english = lang === "en";
  const title = english ? product.nameEn ?? product.name : product.name;
  const titleId = `work-${product.slug}`;
  const highlight = projectHighlights[product.slug];
  const stickers = projectStickers[product.slug];
  const caseStudy = getCaseStudyByProductSlug(product.slug);
  const screenshotLayout = product.screenshotLayout ?? "phone";
  const imageWidth = product.screenshotWidth ?? 1284;
  const imageHeight = product.screenshotHeight ?? 2778;
  const screenshots = product.screenshots ?? [];
  const cardShots = screenshots.filter((src): src is string => Boolean(src));
  const collage = buildCollage(cardShots, screenshotLayout, product.slug);
  const href = caseStudy
    ? `/projects/${caseStudy.slug}?from=${origin === "index" ? "index" : "home"}`
    : "/projects";

  return (
    <article className="portfolio-project" data-project={product.slug} data-layout={screenshotLayout} data-origin={origin} data-count={cardShots.length}>
      <Link href={href} aria-labelledby={titleId} className="portfolio-project-link" onPointerEnter={trackProjectPointer} onPointerMove={trackProjectPointer}>
        <div className="portfolio-project-copy">
          <span className="portfolio-project-arrow" aria-hidden><ArrowUpRight size={21} /></span>
          <h3 id={titleId}>{title}</h3>
          <p>{highlight?.[lang] ?? (english ? product.taglineEn ?? product.tagline : product.tagline)}</p>
          <ul className="portfolio-tags">
            <li>{english ? product.categoryEn ?? product.category : product.category}</li>
            <li>{product.platform}</li>
          </ul>
        </div>
        {cardShots.length ? (
          <div className="portfolio-project-art" aria-hidden>
            {collage.map(({ src, style }) => (
              <span key={src} className="portfolio-collage-item" style={style}>
                <Image
                  src={src}
                  alt=""
                  width={imageWidth}
                  height={imageHeight}
                  sizes={screenshotLayout === "desktop" ? "(max-width: 670px) 72vw, 480px" : "(max-width: 670px) 52vw, 320px"}
                />
              </span>
            ))}
          </div>
        ) : null}
        <div className="portfolio-project-stickers" aria-hidden>
          <span className="portfolio-project-sticker portfolio-sticker-brand">
            <Image src={getProductIconPath(product)} alt="" width={20} height={20} loading="eager" /> {product.nameEn ?? product.name}
          </span>
          {highlight ? (
            <>
              <span className="portfolio-project-sticker portfolio-sticker-badge" lang="en">{highlight.badge} <ArrowUpRight size={15} /></span>
              <span className={`portfolio-project-sticker portfolio-sticker-left${stickers ? " portfolio-sticker-image" : ""}`}>
                {stickers ? <Image src={stickers.left} alt="" width={300} height={300} /> : null}
              </span>
              <span className={`portfolio-project-sticker portfolio-sticker-right${stickers ? " portfolio-sticker-image" : ""}`}>
                {stickers ? <Image src={stickers.right} alt="" width={300} height={300} /> : null}
              </span>
            </>
          ) : null}
        </div>
        <span className="portfolio-project-cursor" aria-hidden>{portfolioCopy[lang].viewProject}</span>
      </Link>
    </article>
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getCaseStudyByProductSlug } from "@/content/case-studies";
import type { Product } from "@/content/products";
import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";

type FolderNoteCopy = {
  kicker: string;
  title: string;
  body: string;
};

const folderNotes: Record<"travel-route" | "mycelia" | "colpix" | "altitudeshot", Record<SiteLang, FolderNoteCopy>> = {
  "travel-route": {
    zh: { kicker: "ON THE ROAD", title: "把路线变成一段视频", body: "添加地点、选择交通方式\n导出你的旅行故事。" },
    en: { kicker: "ON THE ROAD", title: "Turn a route into a video", body: "Add stops, pick a transport mode,\nexport your travel story." },
  },
  altitudeshot: {
    zh: { kicker: "HIGHER GROUND", title: "把到达这一刻留下", body: "实时海拔、坐标与气压\n合成一张登顶卡片。" },
    en: { kicker: "HIGHER GROUND", title: "Keep the moment you arrive", body: "Live altitude, coordinates, pressure.\nOne summit card to keep." },
  },
  colpix: {
    zh: { kicker: "DRAG IT IN", title: "拖一下，灵感归你", body: "网页图片、截图与影音素材\n都留在自己的文件夹。" },
    en: { kicker: "DRAG IT IN", title: "Drag it in, keep it yours", body: "Web images, screenshots, and media.\nAll in your own folder." },
  },
  mycelia: {
    zh: { kicker: "ONE LOCAL DESK", title: "九个平台，一处管理", body: "选题、创作、排期、数据\n每一步都接得上。" },
    en: { kicker: "ONE LOCAL DESK", title: "Nine platforms, one desk", body: "Ideas, writing, scheduling, data.\nEvery step stays connected." },
  },
};

function getProjectHref(product: Product) {
  const study = getCaseStudyByProductSlug(product.slug);
  if (study) return `/projects/${study.slug}?from=projects`;
  return "/projects";
}

export function PortfolioProjects({ lang, products }: { lang: SiteLang; products: Product[] }) {
  const copy = portfolioCopy[lang];
  const travelRoute = products.find((product) => product.slug === "travel-route");
  const altitude = products.find((product) => product.slug === "altitudeshot");
  const colpix = products.find((product) => product.slug === "colpix");
  const mycelia = products.find((product) => product.slug === "mycelia");

  if (!travelRoute?.screenshots || !altitude?.screenshots || !colpix?.screenshots || !mycelia?.screenshots) return null;

  return (
    <section id="products" className="portfolio-section portfolio-projects" aria-labelledby="work-title">
      <div className="portfolio-heading">
        <h2 id="work-title">{copy.workTitle}</h2>
        <Link href="/projects" className="portfolio-projects-more">
          {copy.viewAllProjects} <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="project-board">
        <Image className="project-board-paper" src="/assets/hero/paper-texture.webp" alt="" width={1400} height={933} sizes="(max-width: 900px) 100vw, 900px" />

        <div className="board-phone-stack">
          <Link href={getProjectHref(travelRoute)} className="board-card board-card-travel" aria-label={`${travelRoute.name} · ${copy.openCase}`}>
            <FolderShell />
            <FolderNote copy={folderNotes["travel-route"][lang]} lang={lang} />
            <span className="board-folder-face">
              <span className="board-travel-shot">
                <Image src={travelRoute.screenshots[0]} alt="" width={1284} height={2778} sizes="(max-width: 670px) 82vw, 200px" />
              </span>
            </span>
            <span className="board-open">{copy.openCase} <ArrowUpRight size={14} aria-hidden /></span>
          </Link>

          <Link href={getProjectHref(altitude)} className="board-card board-card-altitude" aria-label={`${altitude.name} · ${copy.openCase}`}>
            <FolderShell />
            <FolderNote copy={folderNotes.altitudeshot[lang]} lang={lang} />
            <span className="board-folder-face">
              <span className="board-altitude-shot">
                <Image src={altitude.screenshots[0]} alt="" width={1284} height={2778} sizes="(max-width: 670px) 82vw, 200px" />
              </span>
            </span>
            <span className="board-open">{copy.openCase} <ArrowUpRight size={14} aria-hidden /></span>
          </Link>
        </div>

        <Link href={getProjectHref(mycelia)} className="board-card board-card-mycelia" aria-label={`${mycelia.name} · ${copy.openCase}`}>
          <FolderShell />
          <FolderNote copy={folderNotes.mycelia[lang]} lang={lang} />
          <span className="board-folder-face">
            <span className="board-mycelia-shot">
              <Image src={mycelia.screenshots[1]} alt="" width={1600} height={968} sizes="(max-width: 670px) 46vw, 250px" />
            </span>
            <span className="board-mycelia-metrics" aria-hidden><i>320</i><i>573</i><i>1.9k</i></span>
          </span>
          <span className="board-open">{copy.openCase} <ArrowUpRight size={14} aria-hidden /></span>
        </Link>

        <Link href={getProjectHref(colpix)} className="board-card board-card-colpix" aria-label={`${colpix.name} · ${copy.openCase}`}>
          <FolderShell />
          <FolderNote copy={folderNotes.colpix[lang]} lang={lang} />
          <span className="board-folder-face">
            <span className="board-colpix-shot">
              <Image src={colpix.screenshots[0]} alt="" width={1600} height={955} sizes="(max-width: 670px) 42vw, 225px" />
            </span>
            <span className="board-colpix-swatches" aria-hidden><i /><i /><i /><i /></span>
          </span>
          <span className="board-open">{copy.openCase} <ArrowUpRight size={14} aria-hidden /></span>
        </Link>

        <Image className="board-deco board-deco-pin" src="/assets/hero/board-pin.webp" alt="" width={340} height={460} sizes="140px" />
        <Image className="board-deco board-deco-clips" src="/assets/hero/board-clips-v3.webp" alt="" width={480} height={364} sizes="150px" />
        <Image className="board-deco board-deco-pen" src="/assets/hero/board-highlighter.webp" alt="" width={700} height={500} sizes="260px" />
      </div>
    </section>
  );
}

function FolderShell() {
  return (
    <span className="board-folder-back" aria-hidden>
      <span className="board-folder-tab" />
      <span className="board-folder-body" />
    </span>
  );
}

function FolderNote({ copy, lang }: { copy: FolderNoteCopy; lang: SiteLang }) {
  return (
    <span className="board-folder-peek" aria-hidden lang={lang === "zh" ? "zh-CN" : "en"}>
      <span className="board-folder-peek-kicker">{copy.kicker}</span>
      <strong>{copy.title}</strong>
      <em>{copy.body}</em>
    </span>
  );
}

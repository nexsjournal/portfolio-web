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
  tag: string;
};

const folderNotes: Record<"colpix" | "mycelia" | "flowdo", Record<SiteLang, FolderNoteCopy>> = {
  colpix: {
    zh: { kicker: "DRAG IT IN", title: "拖一下，灵感归你", body: "网页图片、截图与影音素材\n都留在自己的文件夹。", tag: "06" },
    en: { kicker: "DRAG IT IN", title: "Drag it in, keep it yours", body: "Web images, screenshots, and media.\nAll in your own folder.", tag: "06" },
  },
  mycelia: {
    zh: { kicker: "ONE LOCAL DESK", title: "九个平台，一处管理", body: "选题、创作、排期、数据\n每一步都接得上。", tag: "07" },
    en: { kicker: "ONE LOCAL DESK", title: "Nine platforms, one desk", body: "Ideas, writing, scheduling, data.\nEvery step stays connected.", tag: "07" },
  },
  flowdo: {
    zh: { kicker: "CAPTURE FIRST", title: "先记下来，再整理", body: "菜单栏、快捷键、五个标签页\n把今天过清楚一点。", tag: "04" },
    en: { kicker: "CAPTURE FIRST", title: "Capture first, organize later", body: "Menu bar, shortcuts, five tabs.\nA clearer way through today.", tag: "04" },
  },
};

function getProjectHref(product: Product) {
  const study = getCaseStudyByProductSlug(product.slug);
  if (study) return `/projects/${study.slug}?from=projects`;
  return "/projects";
}

export function PortfolioProjects({ lang, products }: { lang: SiteLang; products: Product[] }) {
  const copy = portfolioCopy[lang];
  const colpix = products.find((product) => product.slug === "colpix");
  const mycelia = products.find((product) => product.slug === "mycelia");
  const flowdo = products.find((product) => product.slug === "flowdo");

  if (!colpix?.screenshots || !mycelia?.screenshots || !flowdo?.screenshots) return null;

  return (
    <section id="projects" className="portfolio-section portfolio-projects" aria-labelledby="projects-title">
      <div className="portfolio-heading">
        <h2 id="projects-title">{copy.projectsTitle}</h2>
        <Link href="/projects" className="portfolio-projects-more">
          {copy.viewAllProjects} <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="project-board">
        <Image className="project-board-paper" src="/assets/hero/paper-texture.webp" alt="" width={1400} height={933} sizes="(max-width: 900px) 100vw, 868px" />

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

        <Link href={getProjectHref(flowdo)} className="board-card board-card-flowdo" aria-label={`${flowdo.name} · ${copy.openCase}`}>
          <FolderShell />
          <FolderNote copy={folderNotes.flowdo[lang]} lang={lang} />
          <span className="board-folder-face">
            <span className="board-flowdo-shot">
              <Image src="/assets/products/flowdo/flowdo-01.jpg" alt="" width={2438} height={1454} sizes="(max-width: 670px) 82vw, 260px" />
            </span>
          </span>
          <span className="board-open">{copy.openCase} <ArrowUpRight size={14} aria-hidden /></span>
        </Link>

        <Image className="board-deco board-deco-pin" src="/assets/hero/board-pin.webp" alt="" width={340} height={460} sizes="140px" />
        <Image className="board-deco board-deco-clips" src="/assets/hero/board-clips-v2.webp" alt="" width={480} height={420} sizes="150px" />
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
      <span className="board-folder-peek-tag">{copy.tag}</span>
    </span>
  );
}

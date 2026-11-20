"use client";

import { ArrowUpRight, Github, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";

import { type Product, getProductIconPath, products } from "@/content/products";
import { type SiteLang, useSiteLanguage } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { PortfolioIntro } from "./portfolio-intro";

const publishedProducts = products.filter((item) => item.path && !item.comingSoon);
const projectHighlights: Partial<Record<string, { zh: string; en: string; badge: string }>> = {
  echosnap: { zh: "滑一滑，整理相册里的照片和视频。", en: "Sort photos and videos with a swipe.", badge: "Swipe to sort" },
  "travel-route": { zh: "把走过的路线，变成一段能分享的动画。", en: "Turn the route you took into an animated travel video.", badge: "On the road" },
  altitudeshot: { zh: "实时看海拔，把到达这一刻拍成一张登顶卡片。", en: "See your altitude live and capture the moment with a summit card.", badge: "Take it higher" },
};

function trackProjectPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty("--project-pointer-x", `${event.clientX - bounds.left}px`);
  card.style.setProperty("--project-pointer-y", `${event.clientY - bounds.top}px`);
}

export function PortfolioHome() {
  const { lang } = useSiteLanguage();
  const copy = portfolioCopy[lang];

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap" tabIndex={-1}>
      <PortfolioIntro lang={lang} products={publishedProducts} />

      <section id="products" className="portfolio-section" aria-labelledby="work-title">
        <div className="portfolio-heading">
          <h2 id="work-title">{copy.workTitle}</h2>
        </div>
        <div className="portfolio-works">
          {publishedProducts.map((product) => (
            <ProjectCard key={product.slug} product={product} lang={lang} />
          ))}
        </div>
      </section>

      <section id="about" className="portfolio-section" aria-labelledby="about-title">
        <div className="portfolio-heading"><h2 id="about-title">{copy.aboutTitle}</h2></div>
        <div className="portfolio-about">
          <div className="portfolio-about-art">
            <Image
              src="/assets/reference/avatar-front.png"
              alt=""
              width={680}
              height={1000}
              sizes="(max-width: 600px) 130px, 188px"
            />
          </div>
          <div className="portfolio-about-copy">
            <h3>{copy.aboutHeading}</h3>
            <p>{copy.aboutBody}</p>
            <ul className="portfolio-tags" aria-label={lang === "zh" ? "方向" : "Disciplines"}>
              <li>PM</li><li>UX Design</li><li>FDE</li><li>Indie Apps</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="build" className="portfolio-section" aria-labelledby="build-title">
        <div className="portfolio-heading"><h2 id="build-title">{copy.buildTitle}</h2></div>
        <ol id="philosophy" className="portfolio-principles">
          {copy.principles.map((item, index) => (
            <li key={item.title}>
              <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className="portfolio-section portfolio-contact" aria-labelledby="contact-title">
        <h2 id="contact-title">{copy.contactTitle}</h2>
        <p>{copy.contactBody}</p>
        <div className="portfolio-contact-links">
          <a href="mailto:lextellsyou@gmail.com" className="portfolio-action">
            <Mail size={17} aria-hidden /> lextellsyou@gmail.com
          </a>
          <a href="https://www.xiaohongshu.com/user/profile/5dc92e8000000000010092a6" target="_blank" rel="noreferrer">
            {copy.xiaohongshu} <ArrowUpRight size={16} aria-hidden />
          </a>
          <a href="https://github.com/nexsjournal" target="_blank" rel="noreferrer">
            <Github size={16} aria-hidden /> GitHub <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </section>

      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

function ProjectCard({ product, lang }: { product: Product; lang: SiteLang }) {
  const english = lang === "en";
  const title = english ? product.nameEn ?? product.name : product.name;
  const titleId = `work-${product.slug}`;
  const highlight = projectHighlights[product.slug];

  return (
    <article className="portfolio-project" data-project={product.slug}>
      <Link href={`/${product.path}`} aria-labelledby={titleId} className="portfolio-project-link" onPointerEnter={trackProjectPointer} onPointerMove={trackProjectPointer}>
        <div className="portfolio-project-copy">
          <span className="portfolio-project-arrow" aria-hidden><ArrowUpRight size={21} /></span>
          <h3 id={titleId}>{title}</h3>
          <p>{highlight?.[lang] ?? (english ? product.taglineEn ?? product.tagline : product.tagline)}</p>
          <ul className="portfolio-tags">
            <li>{english ? product.categoryEn ?? product.category : product.category}</li>
            <li>{product.platform}</li>
          </ul>
        </div>
        {product.screenshots?.length ? (
          <div className="portfolio-project-art" aria-hidden>
            {product.screenshots.slice(0, 3).map((src) => (
              <Image key={src} src={src} alt="" width={1284} height={2778} sizes="(max-width: 670px) 31vw, 180px" />
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
              <span className="portfolio-project-sticker portfolio-sticker-left" />
              <span className="portfolio-project-sticker portfolio-sticker-right" />
            </>
          ) : null}
        </div>
        <span className="portfolio-project-cursor" aria-hidden>{portfolioCopy[lang].viewProject}</span>
      </Link>
    </article>
  );
}

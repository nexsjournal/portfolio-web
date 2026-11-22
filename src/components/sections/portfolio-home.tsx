"use client";

import { ArrowUpRight, Github, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { featuredProductSlugs, moreProductSlugs, products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { PortfolioIntro } from "./portfolio-intro";
import { PortfolioProjectCard } from "./portfolio-project-card";
import { PortfolioProjects } from "./portfolio-projects";
import { ThankYouScroll } from "./thank-you-scroll";

const publishedProducts = products.filter((item) => item.path && !item.comingSoon);
const featuredProducts = featuredProductSlugs.flatMap((slug) => {
  const product = publishedProducts.find((item) => item.slug === slug);
  return product ? [product] : [];
});
const moreProducts = publishedProducts.filter(
  (item) => moreProductSlugs.some((slug) => slug === item.slug),
);
const contactScenes = [
  "/assets/contact/desk-camera.webp",
  "/assets/contact/iceland-road.webp",
  "/assets/contact/iceland-coast.webp",
  "/assets/contact/lake.webp",
  "/assets/contact/forest.webp",
  "/assets/contact/mountain.webp",
];

export function PortfolioHome() {
  const { lang } = useSiteLanguage();
  const copy = portfolioCopy[lang];
  const storyStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = storyStackRef.current;
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>(".portfolio-story-card")];
    if (cards.length < 2) return;
    const desktop = window.matchMedia("(min-width: 801px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateScale = () => {
      frame = 0;
      if (!desktop.matches || reducedMotion.matches) {
        cards.forEach((card) => card.style.removeProperty("--story-scale"));
        return;
      }

      const progress = cards.slice(0, -1).map((card, index) => {
        const next = cards[index + 1];
        const cardTop = Number.parseFloat(getComputedStyle(card).top) || 0;
        const nextTop = Number.parseFloat(getComputedStyle(next).top) || 0;
        const startTop = cardTop + card.offsetHeight + 14;
        return Math.min(1, Math.max(0, (startTop - next.getBoundingClientRect().top) / Math.max(1, startTop - nextTop)));
      });

      cards.forEach((card, index) => {
        const coverDepth = progress.slice(index).reduce((total, value) => total + value, 0);
        card.style.setProperty("--story-scale", String(1 - coverDepth * 0.03));
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScale);
    };

    updateScale();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    desktop.addEventListener("change", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      desktop.removeEventListener("change", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap" tabIndex={-1}>
      <PortfolioIntro lang={lang} products={publishedProducts} />

      <section id="products" className="portfolio-section" aria-labelledby="work-title">
        <div className="portfolio-heading">
          <h2 id="work-title">{copy.workTitle}</h2>
        </div>
        <div className="portfolio-works">
          {featuredProducts.map((product) => (
            <PortfolioProjectCard key={product.slug} product={product} lang={lang} />
          ))}
        </div>
      </section>

      <PortfolioProjects lang={lang} products={moreProducts} />

      <section id="about" className="portfolio-section portfolio-about-intro" aria-labelledby="about-title">
        <div className="portfolio-heading"><h2 id="about-title">{copy.aboutTitle}</h2></div>
      </section>

      <div ref={storyStackRef} className="portfolio-story-stack">
        <section className="portfolio-story-card portfolio-about-card" aria-labelledby="about-title">
          <Image className="portfolio-about-paper" src="/assets/hero/paper-texture.webp" alt="" width={1400} height={933} sizes="(max-width: 900px) 100vw, 868px" />
          <div className="portfolio-about-art">
            <Image
              src="/assets/hero/lex-camera-ip-v2.webp"
              alt={copy.portrait}
              width={1200}
              height={800}
              sizes="(max-width: 670px) 82vw, 380px"
            />
            <span className="portfolio-name-tag" aria-label={copy.nameTag}>
              <span className="portfolio-name-tag-head">Less is more</span>
              <span className="portfolio-name-tag-body"><strong>{lang === "en" ? "Lei" : "阿雷"}</strong><em>Lex</em></span>
            </span>
          </div>
          <div className="portfolio-about-copy">
            <h3>{copy.aboutHeading}</h3>
            <p>{copy.aboutP1}</p>
            <p>{copy.aboutP2}</p>
            <p>{copy.aboutP3}</p>
            <ul className="portfolio-tags" aria-label={lang === "zh" ? "方向" : "Disciplines"}>
              <li>PM</li><li>UX Design</li><li>FDE</li><li>Indie Apps</li>
            </ul>
          </div>
        </section>

        <section id="build" className="portfolio-story-card portfolio-build" aria-labelledby="build-title">
          <div className="portfolio-story-surface">
            <div id="philosophy" className="portfolio-story-copy">
              <h2 id="build-title">{copy.buildTitle}</h2>
              {copy.buildBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="portfolio-build-art" aria-hidden="true">
              <div className="portfolio-build-notebook">
                <small>FIELD NOTES</small>
                <strong>{copy.buildNotebook}</strong>
                <span>LEX STUDIO</span>
              </div>
              <div className="portfolio-build-note">
                {copy.buildNote.map((line) => <span key={line}>{line}</span>)}
                <span>— {copy.introName}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-story-card portfolio-contact" aria-labelledby="contact-title">
          <div className="portfolio-story-surface">
            <div className="portfolio-contact-scenes" aria-hidden="true">
              {contactScenes.map((src) => (
                <span className="portfolio-contact-scene" key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 670px) 42vw, 220px" />
                </span>
              ))}
            </div>
            <div className="portfolio-story-copy portfolio-contact-copy">
              <h2 id="contact-title">{copy.contactTitle}</h2>
              <p>{copy.contactBody}</p>
              <p>{copy.contactFollowUp}</p>
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
            </div>
          </div>
        </section>
        <div className="portfolio-story-card portfolio-thanks-stack-card">
          <ThankYouScroll lang={lang} />
        </div>
        <div className="portfolio-story-spacer" aria-hidden />
      </div>

      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

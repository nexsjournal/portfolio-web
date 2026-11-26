"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import type { DailyQuote } from "@/content/daily-quotes";
import type { HomeNote } from "@/content/home-notes";
import { featuredProductSlugs, publishedProducts } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { notesCopy } from "@/i18n/notes-copy";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { safeImageSrc } from "@/lib/media";
import { PortfolioIdeas } from "./portfolio-ideas";
import { PortfolioIntro } from "./portfolio-intro";
import { PortfolioProjects } from "./portfolio-projects";
import { ThankYouScroll } from "./thank-you-scroll";

const homeProducts = featuredProductSlugs.flatMap((slug) => {
  const product = publishedProducts.find((item) => item.slug === slug);
  return product ? [product] : [];
});
const contactScenes = [
  "/assets/contact/desk-camera.webp",
  "/assets/contact/iceland-road.webp",
  "/assets/contact/iceland-coast.webp",
  "/assets/contact/lake.webp",
  "/assets/contact/forest.webp",
  "/assets/contact/mountain.webp",
];

function formatNoteDate(date: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function PortfolioHome({ featuredNotes, dailyQuote }: { featuredNotes: HomeNote[]; dailyQuote: DailyQuote }) {
  const { lang } = useSiteLanguage();
  const copy = portfolioCopy[lang];
  const notes = notesCopy[lang];
  const storyStackRef = useRef<HTMLDivElement>(null);
  const socials = [
    {
      href: "https://v.douyin.com/qOZ5vJ4es3Q/",
      label: copy.douyin,
      handle: copy.douyinName,
      icon: "/assets/contact/douyin.svg",
      iconClass: "is-douyin",
      mono: false,
    },
    {
      href: "https://www.xiaohongshu.com/user/profile/5dc92e8000000000010092a6",
      label: copy.xiaohongshu,
      handle: copy.xiaohongshuName,
      icon: "/assets/contact/xiaohongshu.svg",
      iconClass: "",
      mono: false,
    },
    {
      href: "https://space.bilibili.com/2130241028",
      label: copy.bilibili,
      handle: copy.bilibiliName,
      icon: "/assets/contact/bilibili-mark.svg",
      iconClass: "",
      mono: false,
    },
    {
      href: "https://x.com/justraylex",
      label: copy.xLabel,
      handle: copy.xName,
      icon: "/assets/contact/x.svg",
      iconClass: "",
      mono: true,
    },
    {
      href: "https://github.com/nexsjournal",
      label: copy.github,
      handle: copy.githubName,
      icon: "/assets/contact/github-mark.svg",
      iconClass: "",
      mono: true,
    },
  ];

  useEffect(() => {
    const stack = storyStackRef.current;
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>(".portfolio-story-card")];
    const quote = stack.querySelector<HTMLElement>(".portfolio-story-quote");
    const thanksCard = stack.querySelector<HTMLElement>(".portfolio-thanks-stack-card");
    if (cards.length < 2) return;
    const desktop = window.matchMedia("(min-width: 801px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateQuote = () => {
      if (!quote || !thanksCard) return;

      if (!desktop.matches || reducedMotion.matches) {
        quote.style.setProperty("--quote-opacity", "1");
        return;
      }

      const thanksRect = thanksCard.getBoundingClientRect();
      const quoteRect = quote.getBoundingClientRect();
      const footerRect = document.querySelector(".portfolio-footer")?.getBoundingClientRect();
      const isRevealed = thanksRect.bottom <= quoteRect.top + 2
        && (!footerRect || footerRect.top >= quoteRect.bottom);

      quote.style.setProperty("--quote-opacity", isRevealed ? "1" : "0");
    };

    const updateScale = () => {
      frame = 0;
      updateQuote();
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

  useEffect(() => {
    const scenes = [...document.querySelectorAll<HTMLElement>(".portfolio-contact-scene")];
    const cleanups = scenes.map((scene) => {
      let pointerId = 0;
      let startX = 0;
      let startY = 0;
      let originX = 0;
      let originY = 0;

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        originX = Number(scene.dataset.dragX ?? 0);
        originY = Number(scene.dataset.dragY ?? 0);
        scene.setPointerCapture(pointerId);
        scene.classList.add("is-dragging");
        event.preventDefault();
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        const x = originX + event.clientX - startX;
        const y = originY + event.clientY - startY;
        scene.dataset.dragX = String(x);
        scene.dataset.dragY = String(y);
        scene.style.setProperty("--drag-x", `${x}px`);
        scene.style.setProperty("--drag-y", `${y}px`);
      };

      const onPointerUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        pointerId = 0;
        if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
        scene.classList.remove("is-dragging");
      };

      const preventNativeDrag = (event: Event) => event.preventDefault();

      scene.addEventListener("pointerdown", onPointerDown);
      scene.addEventListener("pointermove", onPointerMove);
      scene.addEventListener("pointerup", onPointerUp);
      scene.addEventListener("pointercancel", onPointerUp);
      scene.addEventListener("dragstart", preventNativeDrag);

      return () => {
        scene.removeEventListener("pointerdown", onPointerDown);
        scene.removeEventListener("pointermove", onPointerMove);
        scene.removeEventListener("pointerup", onPointerUp);
        scene.removeEventListener("pointercancel", onPointerUp);
        scene.removeEventListener("dragstart", preventNativeDrag);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap" tabIndex={-1}>
      <PortfolioIntro lang={lang} products={publishedProducts} />

      <PortfolioProjects lang={lang} products={homeProducts} />

      <section id="notes-preview" className="portfolio-section portfolio-notes" aria-labelledby="notes-title">
        <div className="portfolio-heading">
          <h2 id="notes-title">{copy.notesTitle}</h2>
          <Link href="/notes" className="portfolio-projects-more">
            {copy.viewAllNotes} <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
        <div className="portfolio-notes-grid">
          {featuredNotes.map((note) => (
            <Link key={note.slug} href={note.previewHref ?? `/notes/${note.slug}`} className="note-card">
              {note.cover ? (
                <div className="note-card-cover" data-wechat={note.sourceUrl?.includes("mp.weixin.qq.com") ? "true" : undefined}>
                  <Image src={safeImageSrc(note.cover)!} alt="" fill sizes="(max-width: 720px) 100vw, 360px" unoptimized />
                </div>
              ) : null}
              <div className="note-card-body">
                <div className="note-card-meta">
                  <span className={`note-type note-type-${note.type}`}>{notes[note.type]}</span>
                  <time dateTime={note.date}>{formatNoteDate(note.date, lang)}</time>
                </div>
                <h2>{note.title}</h2>
                {note.excerpt ? <p>{note.excerpt}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PortfolioIdeas lang={lang} />

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
              <span className="portfolio-name-tag-body"><strong>{lang === "en" ? "Lex" : "阿雷"}</strong><em>Lex</em></span>
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
              <p>{copy.contactFollowUp}</p>
              <div className="portfolio-contact-socials" aria-label={lang === "zh" ? "社媒与作品链接" : "Social links"}>
                {socials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} · ${social.handle}`}
                    title={`${social.label} · ${social.handle}`}
                  >
                    <Image className={`portfolio-contact-icon${social.mono ? " is-mono" : ""}${social.iconClass ? ` ${social.iconClass}` : ""}`} src={social.icon} alt="" width={18} height={18} />
                    <span>{social.handle}</span>
                    <ArrowUpRight size={12} aria-hidden />
                  </a>
                ))}
              </div>
              <div className="portfolio-contact-links">
                <a href="mailto:lextellsyou@gmail.com" className="portfolio-action">
                  <Mail size={17} aria-hidden /> lextellsyou@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="portfolio-story-card portfolio-thanks-stack-card">
          <ThankYouScroll lang={lang} />
        </div>
        <figure className="portfolio-story-quote">
          <blockquote>{dailyQuote[lang]}</blockquote>
        </figure>
        <div className="portfolio-story-spacer" aria-hidden />
      </div>

      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

"use client";

import { ArrowUpRight, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { displayedIdeas, featuredIdeaCount, type Idea } from "@/content/ideas";
import { useSiteLanguage, type SiteLang } from "@/context/site-language";
import { ideasCopy } from "@/i18n/ideas-copy";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { SiteChrome } from "./site-chrome";

const featuredIdeas = displayedIdeas.slice(0, featuredIdeaCount);

function ideaCategory(idea: Idea, lang: SiteLang) {
  return idea.sample ? `${idea[lang].category} · ${ideasCopy[lang].sample}` : idea[lang].category;
}

function IdeaTarget({ idea, lang, descriptionId, className, children }: {
  idea: Idea;
  lang: SiteLang;
  descriptionId: string;
  className: string;
  children: ReactNode;
}) {
  const { title } = idea[lang];
  const reloadLabel = ideasCopy[lang].reload;
  const external = idea.href?.startsWith("http");
  const props = { className, "data-artwork": idea.artwork, "aria-describedby": descriptionId };

  return idea.href ? (
    <a {...props} href={idea.href} aria-label={title} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>
  ) : (
    <button {...props} type="button" aria-label={`${title}${lang === "zh" ? "：" : ": "}${reloadLabel}`} title={reloadLabel} onClick={() => window.location.reload()}>
      {children}
    </button>
  );
}

function IdeasCard({ idea, lang }: { idea: Idea; lang: SiteLang }) {
  const { title, summary, features } = idea[lang];
  const cover = idea.galleryCover ?? idea.cover;
  const summaryId = `idea-${idea.slug}-summary`;
  const ActionIcon = idea.href ? ArrowUpRight : RefreshCw;

  return (
    <IdeaTarget idea={idea} lang={lang} descriptionId={summaryId} className="portfolio-project-link ideas-card">
      <span className="ideas-card-heading">
        <span className="ideas-card-title">{title}</span>
        <span className="ideas-card-action"><ActionIcon size={16} aria-hidden /></span>
        <span id={summaryId} className="ideas-card-meta">
          <span className="ideas-card-category">{ideaCategory(idea, lang)}</span>
          <span className="ideas-card-summary">{summary}</span>
        </span>
      </span>
      <span className="ideas-card-stage" aria-hidden="true">
        <span className="ideas-card-visual">
          {cover ? (
            <Image className="ideas-card-image" src={cover} alt="" fill sizes="(max-width: 600px) 90vw, 340px" />
          ) : idea.artwork === "notes" ? (
            <span className="portfolio-build-notebook ideas-card-notebook">
              <small>LEX STUDIO</small>
              <strong>{title}</strong>
              <span>No. 01</span>
            </span>
          ) : null}
        </span>
      </span>
      <span className="portfolio-project-stickers ideas-card-stickers" aria-hidden="true">
        <span className="portfolio-project-sticker portfolio-sticker-brand">{features[0]}</span>
        <span className="portfolio-project-sticker portfolio-sticker-badge">{features[1]}</span>
      </span>
    </IdeaTarget>
  );
}

function StampPrint({ idea, lang, index }: { idea: Idea; lang: SiteLang; index: number }) {
  return (
    <span className="ideas-stamp-print" aria-hidden="true">
      {idea.cover ? (
        <Image className="ideas-stamp-art" src={idea.cover} alt="" fill sizes="(max-width: 670px) 45vw, 320px" />
      ) : idea.artwork === "switchelp" ? (
        <svg className="ideas-stamp-art" viewBox="0 0 120 144" preserveAspectRatio="xMidYMid slice">
          <path d="M-12 51h144M-12 115h144M16 43v76m87-76v76" opacity=".25" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 2" />
          <path d="M119 68H18l22-22v15h79zm-119 26h102l-22 22V101H0z" fill="currentColor" />
          <path d="M0 76h120M0 86h120" stroke="currentColor" strokeWidth=".75" opacity=".52" />
          <text x="16" y="52" fill="currentColor" fontSize="7">A</text>
          <text x="99" y="113" fill="currentColor" fontSize="7">B</text>
        </svg>
      ) : (
        <svg className="ideas-stamp-art" viewBox="0 0 120 144" preserveAspectRatio="xMidYMid slice">
          <path d="M24 0v144M0 48h120M0 61h120M0 74h120M0 87h120M0 100h120M0 113h120M0 126h120" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".4" />
          <path d="M-6 85q30-36 51-27t-3 22q-16 8-9-5t28-7q11 7-2 18t-5 12q15-1 34-20t15-18q-9 1-15 14t12 13l27-11M14 110q46-13 101-12" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
          <path d="m97 47 2 9m-7-4 12-1" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
        </svg>
      )}
      <span className="ideas-stamp-legend">
        <span>LEX STUDIO</span>
        <strong>{idea[lang].title}</strong>
      </span>
      <span className="ideas-stamp-issue">{String(index + 1).padStart(2, "0")}</span>
    </span>
  );
}

function StampBoard({ lang }: { lang: SiteLang }) {
  return (
    <div className="project-board ideas-board">
      <ul className="ideas-stamps" aria-label={ideasCopy[lang].title}>
        {featuredIdeas.map((idea, index) => {
          const item = idea[lang];
          const ActionIcon = idea.href ? ArrowUpRight : RefreshCw;

          return (
            <li key={idea.slug} className="ideas-stamp" data-artwork={idea.artwork}>
              <IdeaTarget idea={idea} lang={lang} descriptionId={`stamp-${idea.slug}`} className="ideas-stamp-target">
                <span className="ideas-stamp-paper" aria-hidden="true">
                  <StampPrint idea={idea} lang={lang} index={index} />
                </span>
                <span className="ideas-stamp-note">
                  <span className="ideas-stamp-category">{ideaCategory(idea, lang)}</span>
                  <strong>{item.title} <ActionIcon size={13} aria-hidden /></strong>
                  <span id={`stamp-${idea.slug}`} className="ideas-stamp-summary">{item.summary}</span>
                </span>
              </IdeaTarget>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PortfolioIdeas({ lang }: { lang: SiteLang }) {
  const copy = ideasCopy[lang];

  return (
    <section id="ideas" className="portfolio-section" aria-labelledby="ideas-title">
      <div className="portfolio-heading">
        <h2 id="ideas-title">{copy.title}</h2>
        <Link href="/ideas" className="portfolio-projects-more">
          {copy.indexTitle} <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
      <StampBoard lang={lang} />
    </section>
  );
}

export function IdeasPage() {
  const { lang } = useSiteLanguage();
  const copy = ideasCopy[lang];

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{portfolioCopy[lang].skip}</a>
      <main id="main-content" className="portfolio-page portfolio-wrap projects-index" tabIndex={-1}>
        <SiteChrome backHref="/#ideas" backLabel={copy.backHome} />

        <header className="projects-index-hero">
          <p className="projects-index-kicker">LEX STUDIO · ODD IDEAS</p>
          <h1>{copy.indexTitle}</h1>
        </header>

        <div className="projects-index-list">
          <ul className="ideas-grid">
            {displayedIdeas.map((item) => (
              <li key={item.slug}>
                <IdeasCard idea={item} lang={lang} />
              </li>
            ))}
          </ul>
        </div>

        <footer className="portfolio-footer">
          <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
          <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
        </footer>
      </main>
    </>
  );
}

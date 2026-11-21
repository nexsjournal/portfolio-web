"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useSiteLanguage } from "@/context/site-language";
import { notFoundCopy } from "@/i18n/not-found-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

export function NotFoundPage() {
  const { lang } = useSiteLanguage();
  const copy = notFoundCopy[lang];

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap not-found-page" tabIndex={-1}>
      <section className="not-found-stage" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <p className="not-found-kicker">
            <span className="not-found-signal" aria-hidden="true" />
            {copy.kicker}
          </p>
          <h1 id="not-found-title">
            <span>{copy.titleLead}</span>
            <em>{copy.titleTail}</em>
          </h1>
          <p className="not-found-desc">{copy.body}</p>
          <div className="not-found-actions">
            <Link href="/" className="portfolio-action">
              <ArrowLeft size={16} aria-hidden />
              {copy.home}
            </Link>
            <Link href="/notes" className="portfolio-copy">{copy.notes}</Link>
            <Link href="/projects" className="not-found-project-link">
              {copy.projects} <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <p className="not-found-code">{copy.code}</p>
        </div>

        <div className="not-found-art">
          <div className="not-found-art-frame">
            <span className="not-found-frame-corner not-found-frame-corner-tl" aria-hidden="true" />
            <span className="not-found-frame-corner not-found-frame-corner-tr" aria-hidden="true" />
            <span className="not-found-frame-corner not-found-frame-corner-bl" aria-hidden="true" />
            <span className="not-found-frame-corner not-found-frame-corner-br" aria-hidden="true" />
            <span className="not-found-tag">{copy.tag}</span>
            <Image
              src="/assets/404/lex-404.webp"
              alt={copy.imageAlt}
              width={1254}
              height={1254}
              sizes="(max-width: 760px) 78vw, 480px"
              priority
              className="not-found-avatar"
            />
            <span className="not-found-coordinate">31°14′ N · 121°28′ E</span>
          </div>
          <span className="not-found-hint">{copy.hint}</span>
        </div>
      </section>

      <footer className="portfolio-footer not-found-footer">
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

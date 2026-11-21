"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { NoteSummary } from "@/content/notes";
import { useSiteLanguage } from "@/context/site-language";
import { notesCopy } from "@/i18n/notes-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

import { NotesChrome } from "./notes-chrome";

function formatDate(date: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

type NoteDetailProps = {
  note: NoteSummary;
  previous?: NoteSummary;
  next?: NoteSummary;
  children: ReactNode;
};

export function NoteDetail({ note, previous, next, children }: NoteDetailProps) {
  const { lang } = useSiteLanguage();
  const copy = notesCopy[lang];

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{lang === "zh" ? "跳到正文" : "Skip to content"}</a>
      <NotesChrome backHref="/notes" backLabel={copy.back} />
      <main id="main-content" className="portfolio-page notes-detail" tabIndex={-1}>
        <article className="notes-article">
          <header className="notes-article-header">
            <div className="note-card-meta">
              <span className={`note-type note-type-${note.type}`}>{copy[note.type]}</span>
              <time dateTime={note.date}>{formatDate(note.date, lang)}</time>
            </div>
            <h1>{note.title}</h1>
            {note.excerpt ? <p className="notes-article-excerpt">{note.excerpt}</p> : null}
            <div className="notes-article-meta">
              {note.tags.length ? (
                <div className="note-tags">
                  {note.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              ) : null}
              {note.sourceUrl ? (
                <a href={note.sourceUrl} target="_blank" rel="noreferrer" className="notes-source-link">
                  {note.sourceLabel ?? copy.source} ↗
                </a>
              ) : null}
            </div>
          </header>

          {note.cover ? (
            <div className="notes-article-cover">
              <Image src={note.cover} alt="" fill sizes="(max-width: 760px) 100vw, 760px" priority />
            </div>
          ) : null}

          <div className="note-prose">{children}</div>

          <nav className="notes-pagination" aria-label={lang === "zh" ? "文章导航" : "Post navigation"}>
            {previous ? (
              <Link href={`/notes/${previous.slug}`} className="notes-pagination-link">
                <span>{copy.previous}</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/notes/${next.slug}`} className="notes-pagination-link notes-pagination-next">
                <span>{copy.next}</span>
                <strong>{next.title}</strong>
              </Link>
            ) : null}
          </nav>
        </article>

        <footer className="portfolio-footer">
          <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
          <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
        </footer>
      </main>
    </>
  );
}

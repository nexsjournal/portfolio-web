"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { NoteSummary, NoteType } from "@/content/notes";
import { useSiteLanguage } from "@/context/site-language";
import { notesCopy } from "@/i18n/notes-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

import { SiteChrome } from "./site-chrome";

type NoteFilter = NoteType | "all";

const filters: NoteFilter[] = ["all", "article", "event", "video", "note"];

function formatDate(date: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function NotesPage({ notes }: { notes: NoteSummary[] }) {
  const { lang } = useSiteLanguage();
  const copy = notesCopy[lang];
  const [filter, setFilter] = useState<NoteFilter>("all");
  const visibleNotes = useMemo(
    () => (filter === "all" ? notes : notes.filter((note) => note.type === filter)),
    [filter, notes],
  );

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{lang === "zh" ? "跳到正文" : "Skip to content"}</a>
      <SiteChrome backHref="/#projects" backLabel={lang === "zh" ? "返回首页" : "Back home"} />
      <main id="main-content" className="portfolio-page portfolio-wrap notes-index" tabIndex={-1}>
        <header className="notes-index-hero">
          <p className="projects-index-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className="notes-index-desc">{copy.description}</p>
        </header>

        <div className="notes-toolbar">
          <div className="notes-filters" role="group" aria-label={lang === "zh" ? "按类型筛选" : "Filter by type"}>
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={`notes-filter ${filter === item ? "is-active" : ""}`}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {copy[item]}
              </button>
            ))}
          </div>
          <p className="notes-count">{copy.count(visibleNotes.length)}</p>
        </div>

        <section className="notes-list" aria-label={copy.title}>
          {visibleNotes.length === 0 ? (
            <p className="notes-empty">{copy.empty}</p>
          ) : (
            visibleNotes.map((note, index) => (
              <Link key={note.slug} href={`/notes/${note.slug}`} className="note-card">
                {note.cover ? (
                  <div className="note-card-cover">
                    <Image src={note.cover} alt="" fill sizes="(max-width: 720px) 100vw, 360px" priority={index === 0} unoptimized={note.cover.startsWith("http")} />
                  </div>
                ) : null}
                <div className="note-card-body">
                  <div className="note-card-meta">
                    <span className={`note-type note-type-${note.type}`}>{copy[note.type]}</span>
                    <time dateTime={note.date}>{formatDate(note.date, lang)}</time>
                  </div>
                  <h2>{note.title}</h2>
                  {note.excerpt ? <p>{note.excerpt}</p> : null}
                  {note.tags.length ? (
                    <div className="note-tags">
                      {note.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))
          )}
        </section>

        <footer className="portfolio-footer">
          <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
          <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
        </footer>
      </main>
    </>
  );
}

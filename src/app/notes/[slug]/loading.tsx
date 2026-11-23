"use client";

import { useSiteLanguage } from "@/context/site-language";
import { notesCopy } from "@/i18n/notes-copy";

import { SiteChrome } from "@/components/sections/site-chrome";

export default function NoteLoading() {
  const { lang } = useSiteLanguage();

  return (
    <>
      <SiteChrome backHref="/notes" backLabel={notesCopy[lang].back} />
      <main className="portfolio-page portfolio-wrap notes-detail" aria-busy="true">
        <p className="notes-loading-status" role="status">
          {lang === "zh" ? "正在载入文章…" : "Loading article…"}
        </p>
      </main>
    </>
  );
}

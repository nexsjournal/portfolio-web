"use client";

import { useSiteLanguage } from "@/context/site-language";
import { notesCopy } from "@/i18n/notes-copy";

import { SiteLoader } from "@/components/site/site-loader";
import { SiteChrome } from "@/components/sections/site-chrome";

export default function NoteLoading() {
  const { lang } = useSiteLanguage();

  return (
    <>
      <SiteChrome backHref="/notes" backLabel={notesCopy[lang].back} />
      <main className="portfolio-page notes-detail route-loading" aria-busy="true">
        <SiteLoader label={lang === "zh" ? "正在载入文章…" : "Loading article…"} />
      </main>
    </>
  );
}

"use client";

import { useSiteLanguage } from "@/context/site-language";

import { SiteChrome } from "@/components/sections/site-chrome";

export default function NotesLoading() {
  const { lang } = useSiteLanguage();

  return (
    <>
      <SiteChrome backHref="/#products" backLabel={lang === "zh" ? "返回首页" : "Back home"} />
      <main className="portfolio-page portfolio-wrap notes-index" aria-busy="true">
        <p className="notes-loading-status" role="status">
          {lang === "zh" ? "正在载入文章…" : "Loading posts…"}
        </p>
      </main>
    </>
  );
}

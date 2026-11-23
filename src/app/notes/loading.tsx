"use client";

import { useSiteLanguage } from "@/context/site-language";

import { SiteLoader } from "@/components/site/site-loader";
import { SiteChrome } from "@/components/sections/site-chrome";

export default function NotesLoading() {
  const { lang } = useSiteLanguage();

  return (
    <>
      <SiteChrome backHref="/#products" backLabel={lang === "zh" ? "返回首页" : "Back home"} />
      <main className="portfolio-page notes-index route-loading" aria-busy="true">
        <SiteLoader label={lang === "zh" ? "正在载入文章…" : "Loading posts…"} />
      </main>
    </>
  );
}

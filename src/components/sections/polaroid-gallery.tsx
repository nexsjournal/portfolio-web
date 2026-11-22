"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { polaroidGalleryCopy } from "@/i18n/polaroid-gallery-copy";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import type { GalleryPhoto } from "@/lib/polaroid-gallery";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

import { SiteChrome } from "./site-chrome";

function formatDate(value: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function PolaroidGallery({ photos, storageConfigured }: { photos: GalleryPhoto[]; storageConfigured: boolean }) {
  const { lang } = useSiteLanguage();
  const copy = polaroidGalleryCopy[lang];
  const portfolio = portfolioCopy[lang];

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{portfolio.skip}</a>
      <SiteChrome backHref="/#thanks-title" backLabel={copy.back} />
      <main id="main-content" className="portfolio-page portfolio-wrap polaroid-gallery" tabIndex={-1}>
        <header className="polaroid-gallery-hero">
          <div>
            <p className="projects-index-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className="polaroid-gallery-description">{copy.description}</p>
          </div>
          <div className="polaroid-gallery-meta">
            <span className="notes-count-tag">{copy.count(photos.length)}</span>
            <Link className="portfolio-action" href="/#thanks-title">{copy.cta}</Link>
          </div>
        </header>

        {photos.length ? (
          <section className="polaroid-gallery-grid" aria-label={copy.title}>
            {photos.map((photo, index) => {
              const date = formatDate(photo.uploadedAt, lang);
              return (
                <figure
                  key={photo.id}
                  className="polaroid-gallery-item"
                  style={{ "--polaroid-tilt": `${index % 2 === 0 ? -1.6 : 1.3}deg` } as CSSProperties}
                >
                  <div className="polaroid-gallery-photo">
                    <Image
                      src={photo.url}
                      alt={`${copy.alt} · ${date}`}
                      fill
                      sizes="(max-width: 670px) 45vw, (max-width: 1100px) 30vw, 240px"
                    />
                  </div>
                  <figcaption>{date}</figcaption>
                </figure>
              );
            })}
          </section>
        ) : (
          <section className="polaroid-gallery-empty" aria-label={copy.empty}>
            <div className="polaroid-gallery-empty-card" aria-hidden>
              <span />
            </div>
            <p>{storageConfigured ? copy.empty : copy.emptyUnconfigured}</p>
            <Link className="portfolio-action" href="/#thanks-title">{copy.cta}</Link>
          </section>
        )}

        <footer className="portfolio-footer">
          <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
          <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
        </footer>
      </main>
    </>
  );
}

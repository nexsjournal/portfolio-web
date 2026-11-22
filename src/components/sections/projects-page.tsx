"use client";

import { products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { PortfolioProjectCard } from "./portfolio-project-card";
import { SiteChrome } from "./site-chrome";

const publishedProducts = products.filter((item) => item.path && !item.comingSoon);

export function ProjectsPage() {
  const { lang } = useSiteLanguage();
  const copy = portfolioCopy[lang];

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{copy.skip}</a>
      <main id="main-content" className="portfolio-page portfolio-wrap projects-index" tabIndex={-1}>
        <SiteChrome
          backHref="/#projects"
          backLabel={lang === "zh" ? "返回首页项目区" : "Back to projects"}
        />

        <header className="projects-index-hero">
          <p className="projects-index-kicker">PROJECT INDEX</p>
          <h1>{copy.projectsPageTitle}</h1>
        </header>

        <section className="projects-index-list" aria-labelledby="projects-index-list-title">
          <h2 id="projects-index-list-title" className="sr-only">{copy.projectsPageTitle}</h2>
          <div className="portfolio-works">
            {publishedProducts.map((product) => (
              <PortfolioProjectCard key={product.slug} product={product} lang={lang} origin="index" />
            ))}
          </div>
        </section>

        <footer className="portfolio-footer">
          <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
          <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
        </footer>
      </main>
    </>
  );
}

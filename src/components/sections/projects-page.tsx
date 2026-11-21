"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";
import { PortfolioProjectCard } from "./portfolio-project-card";

const publishedProducts = products.filter((item) => item.path && !item.comingSoon);

export function ProjectsPage() {
  const { lang, toggleLang } = useSiteLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const copy = portfolioCopy[lang];
  const themeLabel = copy.theme[theme === "dark" ? "light" : "dark"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="portfolio-skip" href="#main-content">{copy.skip}</a>
      <main id="main-content" className="portfolio-page portfolio-wrap projects-index" tabIndex={-1}>
        <header className={`case-chrome ${scrolled ? "is-scrolled" : ""}`}>
          <div className="case-chrome-left">
            <Link href="/#projects" className="case-back" aria-label={lang === "zh" ? "返回首页项目区" : "Back to projects"}>
              <ArrowLeft size={18} aria-hidden />
            </Link>
            <span className="case-brand">Lex Studio</span>
          </div>
          <span className="projects-chrome-spacer" aria-hidden />
          <div className="case-chrome-actions">
            <button type="button" className="projects-chrome-setting" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
            <button type="button" className="projects-chrome-setting" aria-label={copy.switchLanguage} title={copy.switchLanguage} onClick={toggleLang}>
              <span lang={lang === "zh" ? "en" : "zh-CN"}>{lang === "zh" ? "EN" : "中"}</span>
            </button>
          </div>
        </header>

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

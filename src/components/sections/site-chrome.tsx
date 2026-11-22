"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { portfolioCopy } from "@/i18n/portfolio-copy";

type SiteChromeProps = {
  backHref: string;
  backLabel: string;
  extraActions?: ReactNode;
};

export function SiteChrome({ backHref, backLabel, extraActions }: SiteChromeProps) {
  const { lang, toggleLang } = useSiteLanguage();
  const { theme, toggleTheme } = useTheme();
  const copy = portfolioCopy[lang];
  const themeLabel = copy.theme[theme === "dark" ? "light" : "dark"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`case-chrome${scrolled ? " is-scrolled" : ""}`} data-site-chrome>
      <div className="case-chrome-left">
        <Link href={backHref} className="case-back" aria-label={backLabel} title={backLabel}>
          <ArrowLeft size={18} aria-hidden />
        </Link>
        <span className="case-brand">Lex Studio</span>
      </div>
      <span className="case-chrome-spacer" aria-hidden />
      <div className="case-chrome-actions">
        {extraActions}
        <button type="button" className="projects-chrome-setting" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
        </button>
        <button type="button" className="projects-chrome-setting" aria-label={copy.switchLanguage} title={copy.switchLanguage} onClick={toggleLang}>
          <span lang={lang === "zh" ? "en" : "zh-CN"}>{lang === "zh" ? "EN" : "中"}</span>
        </button>
      </div>
    </header>
  );
}

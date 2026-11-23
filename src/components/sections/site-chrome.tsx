"use client";

import { ArrowLeft, Loader2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [pending, setPending] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setPending(false), 8000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  return (
    <header className={`case-chrome${scrolled ? " is-scrolled" : ""}`} data-site-chrome>
      <div className="case-chrome-left">
        <Link
          href={backHref}
          className="case-back"
          aria-label={backLabel}
          title={backLabel}
          aria-busy={pending}
          onClick={() => setPending(true)}
        >
          {pending ? <Loader2 size={17} className="case-back-spinner" aria-hidden /> : <ArrowLeft size={18} aria-hidden />}
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

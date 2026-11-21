"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { notesCopy } from "@/i18n/notes-copy";

type NotesChromeProps = {
  backHref?: string;
  backLabel?: string;
};

export function NotesChrome({ backHref = "/#products", backLabel }: NotesChromeProps) {
  const { lang, toggleLang } = useSiteLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const copy = notesCopy[lang];
  const themeLabel = copy[theme === "dark" ? "themeLight" : "themeDark"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`case-chrome notes-chrome ${scrolled ? "is-scrolled" : ""}`}>
      <div className="case-chrome-left">
        <Link href={backHref} className="case-back" aria-label={backLabel ?? copy.back}>
          <ArrowLeft size={18} aria-hidden />
        </Link>
        <span className="case-brand">Lex Studio</span>
      </div>
      <Link href="/notes" className="notes-chrome-center">
        Lex Notes
      </Link>
      <div className="case-chrome-actions">
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

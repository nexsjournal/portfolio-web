"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Briefcase, House, Mail, Moon, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const sections = [
  { id: "top", label: "home", Icon: House },
  { id: "products", label: "products", Icon: Briefcase },
  { id: "about", label: "about", Icon: UserRound },
  { id: "contact", label: "contact", Icon: Mail },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const home = pathname === "/";
  const { lang, toggleLang } = useSiteLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("top");
  const copy = portfolioCopy[lang];
  const themeLabel = copy.theme[theme === "dark" ? "light" : "dark"];

  useEffect(() => {
    if (!home) return;
    const targets = sections.map(({ id }) => document.getElementById(id));
    const observer = new IntersectionObserver(() => {
      const cutoff = window.innerHeight * 0.45;
      const contact = targets.at(-1)?.getBoundingClientRect();
      const current = targets.findLast((section) => section && section.getBoundingClientRect().top <= cutoff);
      setActiveSection(contact && contact.bottom <= window.innerHeight ? "contact" : current?.id ?? "top");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    for (const section of targets) {
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [home]);

  return (
    <>
      {pathname !== "/offer" ? <a className="portfolio-skip" href="#main-content">{copy.skip}</a> : null}
      <nav className={`portfolio-nav ${home ? "portfolio-dock" : "portfolio-bar"}`} aria-label={copy.navigation}>
        {home ? sections.map(({ id, label, Icon }) => (
          <a key={id} href={`#${id}`} onClick={() => setActiveSection(id)} aria-label={copy[label]} aria-current={activeSection === id ? "location" : undefined}>
            <Icon size={19} aria-hidden />
            <span className="portfolio-nav-caption" aria-hidden>{copy[label]}</span>
          </a>
        )) : (
          <Link href="/#products" className="portfolio-nav-back">
            <ArrowLeft size={17} aria-hidden /> Lex Studio
          </Link>
        )}
        <div className="portfolio-nav-settings">
          <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
          </button>
          <button type="button" onClick={toggleLang} aria-label={copy.switchLanguage} title={copy.switchLanguage}>
            <span lang={lang === "zh" ? "en" : "zh-CN"}>{lang === "zh" ? "EN" : "中"}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Briefcase, House, Layers, Mail, Moon, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const sections = [
  { id: "top", href: "#top", label: "home", Icon: House },
  { id: "products", href: "#products", label: "products", Icon: Briefcase },
  { id: "projects", href: "/projects", label: "projects", Icon: Layers },
  { id: "about", href: "#about", label: "about", Icon: UserRound },
  { id: "contact", href: "#contact", label: "contact", Icon: Mail },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const caseRoute = pathname.startsWith("/projects") || pathname.startsWith("/work");
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

  if (caseRoute) return null;

  return (
    <>
      {pathname !== "/offer" ? <a className="portfolio-skip" href="#main-content">{copy.skip}</a> : null}
      <nav className={`portfolio-nav ${home ? "portfolio-dock" : "portfolio-bar"}`} aria-label={copy.navigation}>
        {home ? sections.map(({ id, href, label, Icon }) => {
          const content = (
            <>
              <span className="portfolio-nav-icon"><Icon size={20} aria-hidden /></span>
              <span className="portfolio-nav-label" aria-hidden>{copy[label]}</span>
            </>
          );
          return href.startsWith("/") ? (
            <Link key={id} href={href} aria-label={copy[label]}>{content}</Link>
          ) : (
            <a key={id} href={href} onClick={() => setActiveSection(id)} aria-label={copy[label]} aria-current={activeSection === id ? "location" : undefined}>
              {content}
            </a>
          );
        }) : (
          <Link href="/#products" className="portfolio-nav-back">
            <ArrowLeft size={17} aria-hidden /> Lex Studio
          </Link>
        )}
        <div className="portfolio-nav-settings">
          <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            <span className="portfolio-nav-icon">{theme === "dark" ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}</span>
            <span className="portfolio-nav-label" aria-hidden>{copy.themeShort}</span>
          </button>
          <button type="button" onClick={toggleLang} aria-label={copy.switchLanguage} title={copy.switchLanguage}>
            <span className="portfolio-nav-icon" lang={lang === "zh" ? "en" : "zh-CN"}>{lang === "zh" ? "EN" : "中"}</span>
            <span className="portfolio-nav-label" aria-hidden>{copy.languageShort}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

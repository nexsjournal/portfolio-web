"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, House, Layers, Mail, Moon, NotebookPen, Sun, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const sections = [
  { id: "home", target: "top", href: "#top", label: "home", Icon: House },
  { id: "projects", target: "products", href: "/projects", label: "projects", Icon: Layers },
  { id: "notes", target: "notes-preview", href: "/notes", label: "notes", Icon: NotebookPen },
  { id: "about", target: "about", href: "#about", label: "about", Icon: UserRound },
  { id: "contact", target: "contact", href: "#contact", label: "contact", Icon: Mail },
] as const;

function easeOutBack(t: number) {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

export function SiteNavbar() {
  const pathname = usePathname();
  const caseRoute = pathname.startsWith("/projects") || pathname.startsWith("/work") || pathname.startsWith("/notes") || pathname.startsWith("/polaroids") || pathname.startsWith("/studio");
  const home = pathname === "/";
  const { lang, toggleLang } = useSiteLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("home");
  const scrollFrame = useRef<number | null>(null);
  const copy = portfolioCopy[lang];
  const themeLabel = copy.theme[theme === "dark" ? "light" : "dark"];

  useEffect(() => {
    if (!home) return;
    const targets = sections.map((item) => ({ ...item, el: document.getElementById(item.target) }));
    const observer = new IntersectionObserver(() => {
      const cutoff = window.innerHeight * 0.45;
      const contact = targets.find((item) => item.id === "contact")?.el;
      const contactRect = contact?.getBoundingClientRect();
      const current = targets.findLast((item) => item.el && item.el.getBoundingClientRect().top <= cutoff);
      setActiveSection(contactRect && contactRect.bottom <= window.innerHeight ? "contact" : current?.id ?? "home");
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    for (const item of targets) {
      if (item.el) observer.observe(item.el);
    }

    return () => observer.disconnect();
  }, [home]);

  useEffect(() => () => {
    if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current);
  }, []);

  function scrollToSection(event: ReactMouseEvent<HTMLAnchorElement>, id: string, target: string) {
    event.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(target);
    if (!element) return;

    const start = window.scrollY;
    const targetY = Math.max(0, element.getBoundingClientRect().top + start - 28);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current);

    let startedAt = 0;
    const step = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / 1000);
      const y = start + (targetY - start) * easeOutBack(progress);
      window.scrollTo(0, Math.min(maxScroll, Math.max(0, y)));
      scrollFrame.current = progress < 1 ? requestAnimationFrame(step) : null;
    };

    scrollFrame.current = requestAnimationFrame(step);
  }

  if (caseRoute) return null;

  return (
    <>
      {pathname !== "/offer" ? <a className="portfolio-skip" href="#main-content">{copy.skip}</a> : null}
      <nav className={`portfolio-nav ${home ? "portfolio-dock" : "portfolio-bar"}`} aria-label={copy.navigation}>
        {home ? sections.map(({ id, target, href, label, Icon }) => {
          const content = (
            <>
              <span className="portfolio-nav-icon"><Icon size={20} aria-hidden /></span>
              <span className="portfolio-nav-label" aria-hidden>{copy[label]}</span>
            </>
          );
          return href.startsWith("/") ? (
            <Link key={id} href={href} aria-label={copy[label]} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{content}</Link>
          ) : (
            <a key={id} href={href} onClick={(event) => scrollToSection(event, id, target)} aria-label={copy[label]} aria-current={activeSection === id ? "location" : undefined}>
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

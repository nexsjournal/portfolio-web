"use client";

import Link from "next/link";

import { SITE_COPY } from "@/content/site";
import { useLanguage } from "@/i18n/language";

import { LanguageToggle } from "./LanguageToggle";

const navItems = [
  { href: "#about", key: "about" as const },
  { href: "#product", key: "product" as const },
  { href: "#philosophy", key: "philosophy" as const },
  { href: "#contact", key: "contact" as const },
];

export function SiteHeader() {
  const { language } = useLanguage();
  const copy = SITE_COPY[language];

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/[0.09] bg-background/35 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/#top"
          className="group inline-flex cursor-pointer items-center gap-2"
        >
          <span className="font-display text-sm tracking-[0.22em] text-foreground/90">
            LEX
          </span>
          <span className="hidden text-xs text-muted sm:inline">
            {copy.nav.home}
          </span>
          <span className="h-px w-10 bg-gradient-to-r from-primary/70 to-accent/70 opacity-60 transition-opacity group-hover:opacity-100" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              {copy.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

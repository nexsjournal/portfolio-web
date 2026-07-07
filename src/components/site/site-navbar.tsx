"use client";

import Link from "next/link";

import { useSiteLanguage } from "@/context/site-language";

export function SiteNavbar() {
  const { lang } = useSiteLanguage();

  return (
    <nav className="lex-topbar" aria-label={lang === "zh" ? "主导航" : "Main navigation"}>
      <div className="lex-topbar-left">
        <Link href="/" className="lex-topbar-brand">
          LEX
        </Link>
        <span>DESIGN</span>
        <i />
        <span>CODE</span>
        <i />
        <span>BUILD</span>
      </div>
      <div className="lex-topbar-actions">
        <Link href="/#about">ABOUT</Link>
        <Link href="/#products">PRODUCTS</Link>
        <Link href="/#build">BUILD</Link>
        <Link href="/#contact">CONTACT</Link>
      </div>
    </nav>
  );
}

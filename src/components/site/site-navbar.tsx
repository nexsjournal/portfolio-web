"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const pathname = usePathname();
  const { lang, setLang } = useSiteLanguage();
  const copy = t(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/#products", label: copy.nav.products },
    { href: "/#about", label: copy.nav.about },
    { href: "/#philosophy", label: copy.nav.philosophy },
    { href: "/#contact", label: copy.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed left-1/2 z-40 w-[calc(100%-2rem)] max-w-[900px] -translate-x-1/2 transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        scrolled ? "top-2" : "top-3",
      )}
      aria-label={lang === "zh" ? "主导航" : "Main navigation"}
    >
      <div
        className={cn(
          "rounded-2xl border border-white/[0.08] bg-white/[0.06] px-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md lg:px-3",
          scrolled && "border-white/[0.12] bg-[#070a12]/75",
        )}
      >
        <div className="relative flex h-12 items-center">
          <Link
            href="/"
            className="group z-10 flex shrink-0 cursor-pointer items-center gap-1.5"
          >
            <Image
              src="/assets/logo-mark.svg"
              alt="Lex"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full object-contain"
              priority
            />
            <span className="text-lg font-semibold leading-none tracking-tight text-white/95 -translate-y-px">
              Lex
            </span>
          </Link>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <ul className="flex items-center gap-0.5">
              {links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="cursor-pointer rounded-lg px-2.5 py-1.5 text-sm font-medium text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <div
              className="flex rounded-lg border border-white/[0.1] bg-black/20 p-0.5"
              role="group"
              aria-label={lang === "zh" ? "语言" : "Language"}
            >
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-200",
                  lang === "zh"
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                中
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-200",
                  lang === "en"
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "关闭菜单" : "打开菜单"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-white/[0.08] pb-3 pt-2 lg:hidden">
            <div className="mb-3 flex justify-end">
              <div className="flex rounded-lg border border-white/[0.1] bg-black/20 p-0.5">
                <button
                  type="button"
                  onClick={() => setLang("zh")}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1 text-xs font-semibold",
                    lang === "zh" ? "bg-white/15 text-white" : "text-white/50",
                  )}
                >
                  中
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1 text-xs font-semibold",
                    lang === "en" ? "bg-white/15 text-white" : "text-white/50",
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            <ul className="flex flex-col gap-0.5">
              {links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block cursor-pointer rounded-lg px-2.5 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

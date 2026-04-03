"use client";

import { useLanguage } from "@/i18n/language";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="cursor-pointer rounded-full border border-white/[0.1] bg-background/30 px-3 py-1 text-xs text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background/45"
      aria-label="Toggle language"
    >
      <span className="font-medium">{language === "zh" ? "中文" : "EN"}</span>
      <span className="mx-2 text-muted">/</span>
      <span className="text-muted">{language === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}

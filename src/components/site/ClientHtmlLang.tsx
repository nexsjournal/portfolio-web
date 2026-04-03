"use client";

import { useEffect } from "react";

import { useLanguage } from "@/i18n/language";

export function ClientHtmlLang() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  return null;
}

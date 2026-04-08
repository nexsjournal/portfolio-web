"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SiteLang = "zh" | "en";

type SiteLanguageContextValue = {
  lang: SiteLang;
  setLang: (lang: SiteLang) => void;
  toggleLang: () => void;
};

const STORAGE_KEY = "lex-site-lang";

const SiteLanguageContext = createContext<SiteLanguageContextValue | null>(
  null,
);

export function SiteLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<SiteLang>("zh");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SiteLang | null;
      if (saved === "zh" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, ready]);

  const setLang = useCallback((next: SiteLang) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang }),
    [lang, setLang, toggleLang],
  );

  return (
    <SiteLanguageContext.Provider value={value}>
      {children}
    </SiteLanguageContext.Provider>
  );
}

export function useSiteLanguage() {
  const ctx = useContext(SiteLanguageContext);
  if (!ctx) {
    throw new Error("useSiteLanguage must be used within SiteLanguageProvider");
  }
  return ctx;
}

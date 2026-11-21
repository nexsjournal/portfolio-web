"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DARK_THEME_QUERY, THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme-settings";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const preference = useRef<ThemeMode | null>(null);

  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    root.classList.toggle("theme-light", mode === "light");
    root.classList.toggle("theme-dark", mode === "dark");
    setThemeState(mode);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(DARK_THEME_QUERY);
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") preference.current = saved;
    } catch {
      /* ignore */
    }

    const syncSystemTheme = () => applyTheme(preference.current ?? (media.matches ? "dark" : "light"));

    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [applyTheme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    preference.current = mode;
    applyTheme(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains("theme-dark") ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

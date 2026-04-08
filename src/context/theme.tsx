"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "dark" | "light";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "lex-site-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === "dark" || saved === "light") {
        setThemeState(saved);
        return;
      }
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
        .matches;
      setThemeState(prefersDark ? "dark" : "dark");
    } catch {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-light", theme === "light");
    root.classList.toggle("theme-dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

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


export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "lex-site-theme";
export const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";

export const themeInitScript = `(() => {
  let preference;
  try { preference = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
  const dark = preference === "dark" || (preference !== "light" && matchMedia(${JSON.stringify(DARK_THEME_QUERY)}).matches);
  const root = document.documentElement;
  root.classList.toggle("theme-dark", dark);
  root.classList.toggle("theme-light", !dark);
})();`;

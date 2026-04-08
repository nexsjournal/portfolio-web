"use client";

import { SiteLanguageProvider } from "@/context/site-language";
import { ThemeProvider } from "@/context/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SiteLanguageProvider>{children}</SiteLanguageProvider>
    </ThemeProvider>
  );
}

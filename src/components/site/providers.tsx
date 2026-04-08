"use client";

import { SiteLanguageProvider } from "@/context/site-language";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SiteLanguageProvider>{children}</SiteLanguageProvider>;
}

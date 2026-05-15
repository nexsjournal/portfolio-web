import type { Metadata } from "next";
import { Lexend, Montserrat, Noto_Sans_SC, Outfit } from "next/font/google";

import { SiteNavbar } from "@/components/site/site-navbar";
import { SITE_FILING_NAME } from "@/lib/site-compliance";
import { Providers } from "@/components/site/providers";

import "./globals.css";

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sc",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lexend",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_FILING_NAME} · PM & UX & 独立开发者 · 构建有用且有趣的 APP`,
  description: `${SITE_FILING_NAME} · PM & UX & 独立开发者 · 构建有用且有趣的 APP`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${lexend.className} ${lexend.variable} ${notoSansSc.variable} ${outfit.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>
          <SiteNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

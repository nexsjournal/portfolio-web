import type { Metadata } from "next";

import { SiteNavbar } from "@/components/site/site-navbar";
import { SITE_FILING_NAME } from "@/lib/site-compliance";
import { Providers } from "@/components/site/providers";

import "./globals.css";

/** 使用样式表加载字体，避免 next/font/google 在 Turbopack 下解析 @vercel/turbopack-next 内置模块失败 */
const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&family=Outfit:wght@500;600;700;800&display=swap";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsHref} rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>
          <SiteNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

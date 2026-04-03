import type { Metadata } from "next";
import { Noto_Sans_SC, Outfit } from "next/font/google";

import { ClientHtmlLang } from "@/components/site/ClientHtmlLang";
import { MotionProvider } from "@/context/motion";
import { LanguageProvider } from "@/i18n/language";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const siteUrl = new URL("https://lextellsyou.asia");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Lex · Indie Developer",
    template: "%s · Lex",
  },
  description:
    "Lex（独立开发者）的个人作品集：独立 App、产品叙事与联系方式。深色科技风、蓝橙撞色。",
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Lex",
    title: "Lex · Indie Developer",
    description:
      "Indie developer portfolio: apps, story, and contact. Dark futuristic UI with blue/orange accents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lex · Indie Developer",
    description:
      "Indie developer portfolio: apps, story, and contact. Dark futuristic UI with blue/orange accents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body
        className={`${outfit.variable} ${notoSansSc.variable} min-h-full bg-background text-foreground antialiased`}
      >
        <LanguageProvider>
          <MotionProvider>
            <ClientHtmlLang />
            {children}
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

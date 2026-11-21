import type { Metadata } from "next";

/** 对外正式域名（Google Play / Search Console 填写的网址） */
export const SITE_URL = "https://www.lexstudio.club";

const siteName = "Lex Ray";
const siteImage = "/assets/hero/lex-camera-ip-v2.webp";

/** Search Console → HTML 标记 → content 属性值（在部署平台配置 GOOGLE_SITE_VERIFICATION） */
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteName,
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

type PageMetadata = {
  path: string;
  title: string;
  description: string;
  image?: { url: string; alt: string };
};

export function createPageMetadata({
  path,
  title,
  description,
  image = { url: siteImage, alt: "Lex Ray 的相机头像插画" },
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName, locale: "zh_CN", url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

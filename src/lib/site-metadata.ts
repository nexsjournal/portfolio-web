import type { Metadata } from "next";

/** 对外正式域名（Google Play / Search Console 填写的网址） */
export const SITE_URL = "https://lexstudio.club";

const siteTitle = "Lex Ray";
const siteDescription = "产品经理、UX 设计师、独立开发者。";

/** Search Console → HTML 标记 → content 属性值（在部署平台配置 GOOGLE_SITE_VERIFICATION） */
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

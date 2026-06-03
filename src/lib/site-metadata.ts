import type { Metadata } from "next";

import { SITE_FILING_NAME } from "@/lib/site-compliance";

/** 对外正式域名（Google Play / Search Console 填写的网址） */
export const SITE_URL = "https://lexstudio.club";

const siteTitle = `${SITE_FILING_NAME} · PM & UX & 独立开发者 · 构建有用且有趣的 APP`;
const siteDescription = siteTitle;

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

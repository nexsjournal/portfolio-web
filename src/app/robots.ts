import type { MetadataRoute } from "next";

function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return new URL(env);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("https://lextellsyou.asia");
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", base).toString(),
    host: base.host,
  };
}

import type { MetadataRoute } from "next";

function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return new URL(env);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("https://lextellsyou.asia");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return [
    {
      url: new URL("/", base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/apps/journey-time", base).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

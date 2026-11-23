import type { NextConfig } from "next";

/** 旧 `/products/<slug>` 与 `/work/<slug>` → `/projects/<slug>` 由 `src/middleware.ts` 统一处理，勿在此逐条硬编码 */
const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "192.168.31.113"],
  outputFileTracingIncludes: {
    "/api/thanks/polaroid": ["./public/assets/hero/lex-aqua-avatar-v2.webp"],
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "mmbiz.qpic.cn" },
    ],
  },
};

export default nextConfig;

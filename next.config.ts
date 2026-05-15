import type { NextConfig } from "next";

/** 旧 `/products/<slug>` → `/<path>` 由 `src/middleware.ts` 按 products 数据统一处理，勿在此逐条硬编码 */
const nextConfig: NextConfig = {};

export default nextConfig;

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getProductBySlug } from "@/content/products";

/**
 * 旧版详情地址为 `/products/<slug>`（slug 与资源目录名一致）。
 * 现改为根路径 `/<path>`，此处统一做 308，避免每加一个产品就改 next.config。
 * 新产品若从未上线过 `/products/...`，不会命中本逻辑，只需在 products 里配置 path 即可。
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const prefix = "/products/";
  if (!pathname.startsWith(prefix)) {
    return NextResponse.next();
  }

  const slug = pathname.slice(prefix.length).split("/")[0] ?? "";
  if (!slug) {
    return NextResponse.next();
  }

  const product = getProductBySlug(slug);
  if (!product?.path || product.comingSoon) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${product.path}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/products/:slug"],
};

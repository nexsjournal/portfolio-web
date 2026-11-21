import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCaseStudy, getCaseStudyByProductSlug } from "@/content/case-studies";
import { getProductBySlug } from "@/content/products";

/**
 * 旧版详情地址为 `/products/<slug>`（slug 与资源目录名一致）。
 * 现统一为 `/projects/<caseSlug>`，此处与旧 `/work/<caseSlug>` 一起做 308。
 * 新产品若从未上线过 `/products/...`，不会命中本逻辑，只需在 products 里配置 path 即可。
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/work/")) {
    const caseSlug = pathname.slice("/work/".length).split("/")[0] ?? "";
    const study = getCaseStudy(caseSlug);
    if (!study) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = `/projects/${study.slug}`;
    return NextResponse.redirect(url, 308);
  }

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

  const study = getCaseStudyByProductSlug(product.slug);
  if (!study) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/projects/${study.slug}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/products/:slug", "/work/:caseSlug"],
};

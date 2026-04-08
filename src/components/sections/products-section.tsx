"use client";

import Image from "next/image";
import Link from "next/link";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FadeInBlock, FadeInTitle } from "@/components/ui/scroll-reveal";
import { getProductIconPath, products } from "@/content/products";

/** 与含 3D 的产品卡在栅格内视觉高度接近 */
const ROW_MIN_H = "min-h-[220px]";

export function ProductsSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);

  return (
    <section id="products" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <FadeInTitle className="section-title">{copy.sections.products}</FadeInTitle>
          <FadeInBlock delay={0.12} className="mx-auto mt-5 max-w-2xl">
            <p className="text-sm leading-relaxed text-white/55">
              {copy.sections.productsDesc}
            </p>
          </FadeInBlock>
        </div>

        <FadeInBlock delay={0.06} className="mt-16 grid gap-10 md:grid-cols-2 md:items-stretch">
          {products.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.slug}
                  className={`flex w-full ${ROW_MIN_H} items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.04)] bg-white/[0.03] px-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]`}
                >
                  <p className="text-lg font-medium tracking-wide text-white/50 md:text-xl">
                    {copy.products.soon}
                  </p>
                </div>
              );
            }

            return (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="block h-full w-full min-h-[220px] cursor-pointer [transform-style:preserve-3d]"
              >
                <CardContainer className="flex h-full min-h-[220px] w-full !items-stretch !justify-center !py-0 [perspective:2000px]">
                  <CardBody className="group/card relative flex h-full min-h-[220px] w-full flex-col rounded-2xl border border-[rgba(255,255,255,0.04)] bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-shadow duration-300 [transform-style:preserve-3d] hover:border-[rgba(255,255,255,0.08)] hover:shadow-[0_0_22px_-6px_rgba(31,240,255,0.14),0_24px_80px_-20px_rgba(31,240,255,0.08)]">
                    {/* 中间层必须 preserve-3d，否则子项 translateZ 会被压平，logo 与文字会像贴在同一平面 */}
                    <div className="flex flex-1 items-start gap-4 [transform-style:preserve-3d]">
                      {/* Logo：适度 translateZ，hover 时略浮起即可 */}
                      <CardItem
                        translateZ={110}
                        className="relative z-20 shrink-0 [transform-style:preserve-3d] will-change-transform"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-zinc-900/80 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.85),0_8px_20px_-10px_rgba(31,240,255,0.18)] transition-[transform,box-shadow] duration-300 ease-out [transform-style:preserve-3d] group-hover/card:scale-[1.03] group-hover/card:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.82),0_12px_28px_-10px_rgba(31,240,255,0.28)]">
                          <Image
                            src={getProductIconPath(item)}
                            alt=""
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </CardItem>
                      <div className="min-w-0 flex-1 [transform-style:preserve-3d]">
                        <CardItem
                          translateZ={28}
                          className="text-lg font-semibold text-white md:text-xl"
                        >
                          {lang === "en" ? item.nameEn ?? item.name : item.name}
                        </CardItem>
                        <CardItem translateZ={16} className="mt-1.5">
                          <p className="line-clamp-4 text-sm leading-relaxed text-white/65 md:line-clamp-3">
                            {lang === "en" ? item.taglineEn ?? item.tagline : item.tagline}
                          </p>
                        </CardItem>
                      </div>
                    </div>

                    <CardItem
                      translateZ={8}
                      className="mt-auto flex items-center justify-start pt-4"
                    >
                      <span className="rounded-full border border-white/15 bg-[#1FF0FF]/15 px-3 py-1 text-xs font-medium text-[#1FF0FF] transition-colors duration-200 group-hover/card:border-[#1FF0FF]/50 group-hover/card:bg-[#1FF0FF]/25">
                        {copy.products.openBtn} →
                      </span>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </Link>
            );
          })}
        </FadeInBlock>
      </div>
    </section>
  );
}

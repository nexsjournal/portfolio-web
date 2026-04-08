"use client";

import Image from "next/image";
import Link from "next/link";

import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";
import { Product, getProductIconPath } from "@/content/products";
import { ProductScreenshots } from "@/components/sections/product-screenshots";
import { FooterSection } from "@/components/sections/footer-section";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Spotlight } from "@/components/ui/spotlight";
import { StarsBackground } from "@/components/ui/stars-background";

type Props = {
  product: Product;
};

export function ProductDetailContent({ product }: Props) {
  const { lang } = useSiteLanguage();
  const copy = t(lang).productDetail;
  const featureEmojis = ["🗺️", "🎬", "✨", "⚡", "📌", "🧭"];

  const title = lang === "en" ? product.nameEn ?? product.name : product.name;
  const summary = lang === "en" ? product.summaryEn ?? product.summary : product.summary;
  const category = lang === "en" ? product.categoryEn ?? product.category : product.category;
  const language = lang === "en" ? product.languageEn ?? product.language : product.language;
  const size = lang === "en" ? product.sizeEn ?? product.size : product.size;
  const platform = lang === "en" ? product.platformEn ?? product.platform : product.platform;
  const features = lang === "en" ? product.featuresEn ?? product.features : product.features;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#05070d] px-6 pb-20 pt-[calc(0.75rem+3rem+2rem)] text-white md:px-10 md:pb-28">
      <div className="absolute inset-0 bg-[#06080e]" aria-hidden />
      <Spotlight className="-left-[22rem] -top-[15rem] md:-left-[14rem] md:-top-[10rem]" fill="#1FF0FF" />
      <ShootingStars />
      <StarsBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_11%,rgba(31,240,255,0.09),transparent_24%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <Link
            href="/#products"
            className="inline-flex cursor-pointer text-sm text-white/55 transition-colors duration-200 hover:text-[#1FF0FF]"
          >
            {copy.back}
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.04)] bg-black/35 p-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl">
              <Image
                src={getProductIconPath(product)}
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="mt-2 text-white/70">{summary}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <InfoItem label={copy.category} value={category} />
            <InfoItem label={copy.language} value={language} />
            <InfoItem label={copy.size} value={size} />
            <InfoItem label={copy.platform} value={platform} />
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-[0.04em] text-white/95 md:text-[1.75rem]">
            {copy.screenshots}
          </h2>
          <ProductScreenshots screenshots={product.screenshots ?? []} />
        </section>

        <section className="mt-16 md:mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-[0.04em] text-white/95 md:text-[1.75rem]">
            {copy.features}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-black/30 p-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
                key={feature}
              >
                <p className="text-sm leading-7 text-white/82">
                  <span className="mr-2 inline-block" aria-hidden>
                    {featureEmojis[index % featureEmojis.length]}
                  </span>
                  {feature}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="relative z-10 mt-8">
        <FooterSection />
      </div>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 text-sm text-white/90">{value}</p>
    </article>
  );
}

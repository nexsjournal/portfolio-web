"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Shield } from "lucide-react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { Product, getProductIconPath } from "@/content/products";
import { ProductScreenshots } from "@/components/sections/product-screenshots";
import { FooterSection } from "@/components/sections/footer-section";
import { FadeInTitle } from "@/components/ui/scroll-reveal";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Spotlight } from "@/components/ui/spotlight";
import { StarsBackground } from "@/components/ui/stars-background";
import { useScrollRevealBatch } from "@/hooks/use-scroll-reveal-batch";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
};

export function ProductDetailContent({ product }: Props) {
  const { lang } = useSiteLanguage();
  const copy = t(lang).productDetail;
  const featureEmojis = ["🗺️", "🎬", "✨", "⚡", "📌", "🧭"];
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { containerRef, revealClass } = useScrollRevealBatch({
    stagger: 0.1,
    dependencies: [lang, product.slug],
  });

  const title = lang === "en" ? product.nameEn ?? product.name : product.name;
  const summary = lang === "en" ? product.summaryEn ?? product.summary : product.summary;
  const category = lang === "en" ? product.categoryEn ?? product.category : product.category;
  const language = lang === "en" ? product.languageEn ?? product.language : product.language;
  const size = lang === "en" ? product.sizeEn ?? product.size : product.size;
  const platform = lang === "en" ? product.platformEn ?? product.platform : product.platform;
  const platformUrl = product.platformUrl;
  const features = lang === "en" ? product.featuresEn ?? product.features : product.features;

  return (
    <main
      className={`relative isolate min-h-screen overflow-hidden px-6 pb-0 pt-[calc(0.75rem+3rem+2rem)] md:px-10 ${
        isLight ? "bg-[var(--background)] text-[color:var(--foreground)]" : "bg-[#05070d] text-white"
      }`}
    >
      <div
        className={`absolute inset-0 ${isLight ? "bg-[var(--background)]" : "bg-[#06080e]"}`}
        aria-hidden
      />
      <Spotlight className="-left-[22rem] -top-[15rem] md:-left-[14rem] md:-top-[10rem]" fill="#1FF0FF" />
      <ShootingStars />
      <StarsBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_11%,rgba(31,240,255,0.09),transparent_24%)]"
        aria-hidden
      />

      <div ref={containerRef} className="relative mx-auto w-full max-w-6xl">
        <div className={cn("mb-12", revealClass)}>
          <Link
            href="/#products"
            className={`inline-flex cursor-pointer text-sm transition-colors duration-200 hover:text-[#1FF0FF] ${
              isLight ? "text-slate-700/65" : "text-white/55"
            }`}
          >
            {copy.back}
          </Link>
        </div>

        <section
          className={cn(
            revealClass,
            "relative overflow-hidden rounded-3xl border p-8",
            isLight
              ? "border-slate-200/70 bg-white/75"
              : "border-[rgba(255,255,255,0.04)] bg-black/35",
          )}
        >
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
              <h1 className={`text-3xl font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>
                {title}
              </h1>
              <p className={`mt-2 ${isLight ? "text-slate-700/70" : "text-white/70"}`}>{summary}</p>
            </div>
          </div>

          <div
            className={cn(
              "mt-8 grid items-stretch gap-4 sm:grid-cols-2",
              platformUrl ? "lg:grid-cols-5" : "md:grid-cols-4",
            )}
          >
            <InfoItem isLight={isLight} label={copy.category} value={category} />
            <InfoItem isLight={isLight} label={copy.language} value={language} />
            <InfoItem isLight={isLight} label={copy.size} value={size} />
            <InfoItem isLight={isLight} label={copy.platform} value={platform} />
            {platformUrl ? (
              <AppStoreDownloadCard
                isLight={isLight}
                href={platformUrl}
                label={copy.downloadAppStore}
              />
            ) : null}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <FadeInTitle
            className={`font-display text-2xl font-semibold tracking-[0.04em] md:text-[1.75rem] ${
              isLight ? "text-slate-900" : "text-white/95"
            }`}
          >
            {copy.features}
          </FadeInTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                className={cn(
                  revealClass,
                  "rounded-xl border p-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1",
                  isLight
                    ? "border-slate-200/70 bg-white/75"
                    : "border-[rgba(255,255,255,0.04)] bg-black/30",
                )}
                key={feature}
              >
                <p
                  className={`text-sm leading-7 ${isLight ? "text-slate-700/82" : "text-white/82"}`}
                >
                  <span className="mr-2 inline-block" aria-hidden>
                    {featureEmojis[index % featureEmojis.length]}
                  </span>
                  {feature}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <FadeInTitle
            className={`font-display text-2xl font-semibold tracking-[0.04em] md:text-[1.75rem] ${
              isLight ? "text-slate-900" : "text-white/95"
            }`}
          >
            {copy.screenshots}
          </FadeInTitle>
          <div className={cn("mt-6", revealClass)}>
            <ProductScreenshots screenshots={product.screenshots ?? []} />
          </div>
        </section>

        {product.privacyUrl || product.termsUrl ? (
          <div className={revealClass}>
            <ProductLegalLinks
              isLight={isLight}
              legalLabel={copy.legal}
              privacyLabel={copy.privacy}
              termsLabel={copy.terms}
              privacyUrl={product.privacyUrl}
              termsUrl={product.termsUrl}
            />
          </div>
        ) : null}
      </div>
      <div className="relative z-10">
        <FooterSection />
      </div>
    </main>
  );
}

function ProductLegalLinks({
  isLight,
  legalLabel,
  privacyLabel,
  termsLabel,
  privacyUrl,
  termsUrl,
}: {
  isLight: boolean;
  legalLabel: string;
  privacyLabel: string;
  termsLabel: string;
  privacyUrl?: string;
  termsUrl?: string;
}) {
  const linkBase = isLight
    ? "border-slate-200/80 bg-white/80 text-slate-800 hover:border-[#1FF0FF]/35 hover:bg-[#1FF0FF]/[0.06]"
    : "border-white/[0.08] bg-white/[0.03] text-white/88 hover:border-[#1FF0FF]/40 hover:bg-[#1FF0FF]/[0.08]";

  return (
    <section className="mt-14 pb-2 md:mt-16">
      <div
        className={`rounded-2xl border p-5 md:p-6 ${
          isLight
            ? "border-slate-200/70 bg-gradient-to-br from-white/90 to-slate-50/80"
            : "border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent"
        }`}
      >
        <p
          className={`text-xs font-medium uppercase tracking-[0.2em] ${
            isLight ? "text-slate-600/55" : "text-white/42"
          }`}
        >
          {legalLabel}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {privacyUrl ? (
            <a
              href={privacyUrl}
              target="_blank"
              rel="noreferrer"
              className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${linkBase}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isLight ? "bg-[#1FF0FF]/12 text-[#0891b2]" : "bg-[#1FF0FF]/12 text-[#1FF0FF]"
                  }`}
                >
                  <Shield className="h-4 w-4" aria-hidden />
                </span>
                <span className="truncate text-sm font-medium">{privacyLabel}</span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 opacity-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-90"
                aria-hidden
              />
            </a>
          ) : null}
          {termsUrl ? (
            <a
              href={termsUrl}
              target="_blank"
              rel="noreferrer"
              className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${linkBase}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isLight ? "bg-[#1FF0FF]/12 text-[#0891b2]" : "bg-[#1FF0FF]/12 text-[#1FF0FF]"
                  }`}
                >
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                <span className="truncate text-sm font-medium">{termsLabel}</span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 opacity-45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-90"
                aria-hidden
              />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** 与信息卡、下载按钮统一的最小高度（单独占一行时也不会过扁） */
const INFO_CELL_MIN_H = "min-h-[5.5rem]";

const infoCardClass = (isLight: boolean) =>
  cn(
    INFO_CELL_MIN_H,
    "rounded-xl border p-4",
    isLight ? "border-slate-200/60 bg-white/75" : "border-[rgba(255,255,255,0.04)] bg-black/25",
  );

const infoLabelClass = (isLight: boolean) =>
  cn(
    "text-xs uppercase tracking-[0.18em]",
    isLight ? "text-slate-700/50" : "text-white/50",
  );

function InfoItem({
  label,
  value,
  isLight,
}: {
  label: string;
  value: string;
  isLight: boolean;
}) {
  return (
    <article className={cn(infoCardClass(isLight), "h-full")}>
      <p className={infoLabelClass(isLight)}>{label}</p>
      <p className={cn("mt-2 text-sm", isLight ? "text-slate-900" : "text-white/90")}>
        {value}
      </p>
    </article>
  );
}

function AppStoreDownloadCard({
  isLight,
  href,
  label,
}: {
  isLight: boolean;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        INFO_CELL_MIN_H,
        "flex h-full w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-[background-color,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98]",
        isLight
          ? "border-[#1FF0FF]/45 bg-[#1FF0FF]/22 text-[#051016] shadow-[0_0_20px_-8px_rgba(31,240,255,0.35)] hover:border-[#1FF0FF]/60 hover:bg-[#1FF0FF]/32 hover:shadow-[0_0_28px_-6px_rgba(31,240,255,0.45)]"
          : "border-[#1FF0FF]/40 bg-[#1FF0FF]/14 text-[#1FF0FF] shadow-[0_0_22px_-8px_rgba(31,240,255,0.28)] hover:border-[#1FF0FF]/55 hover:bg-[#1FF0FF]/22 hover:shadow-[0_0_32px_-6px_rgba(31,240,255,0.4)]",
      )}
    >
      <span className="text-center leading-snug">{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
    </a>
  );
}

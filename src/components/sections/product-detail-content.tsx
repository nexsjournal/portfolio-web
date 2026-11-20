"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProductScreenshots } from "@/components/sections/product-screenshots";
import { type Product, getProductIconPath, products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { t } from "@/i18n/site-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

export function ProductDetailContent({ product }: { product: Product }) {
  const { lang } = useSiteLanguage();
  const english = lang === "en";
  const copy = t(lang).productDetail;
  const portfolio = portfolioCopy[lang];
  const title = english ? product.nameEn ?? product.name : product.name;
  const features = english ? product.featuresEn ?? product.features : product.features;
  const screenshots = product.screenshots ?? [];
  const related = products.filter((item) => item.path && !item.comingSoon && item.slug !== product.slug);
  const facts = [
    [copy.category, english ? product.categoryEn ?? product.category : product.category],
    [copy.platform, english ? product.platformEn ?? product.platform : product.platform],
    [copy.language, english ? product.languageEn ?? product.language : product.language],
    [copy.size, english ? product.sizeEn ?? product.size : product.size],
  ];

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap portfolio-detail" tabIndex={-1}>
      <header className="portfolio-detail-intro">
        <Image src={getProductIconPath(product)} alt="" width={84} height={84} className="portfolio-detail-icon" />
        <h1>{title}</h1>
        {!english && product.nameEn ? <span className="portfolio-detail-name" lang="en">{product.nameEn}</span> : null}
        <p>{english ? product.summaryEn ?? product.summary : product.summary}</p>
        {product.platformUrl ? (
          <a className="portfolio-action" href={product.platformUrl} target="_blank" rel="noreferrer">
            {copy.downloadAppStore} <ArrowUpRight size={17} aria-hidden />
          </a>
        ) : null}
      </header>

      {screenshots.length ? (
        <section id="screenshots" className="portfolio-section" aria-labelledby="screenshots-title">
          <div className="portfolio-heading portfolio-gallery-heading">
            <h2 id="screenshots-title">{copy.screenshots}</h2>
            <p id="screenshots-hint">{portfolio.screenshotsHint}</p>
          </div>
          <ProductScreenshots screenshots={screenshots} title={title} />
        </section>
      ) : null}

      <section className="portfolio-section" aria-labelledby="features-title">
        <div className="portfolio-heading"><h2 id="features-title">{copy.features}</h2></div>
        <ul className="portfolio-features">
          {features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <dl className="portfolio-facts">
          {facts.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        {product.privacyUrl || product.termsUrl ? (
          <div className="portfolio-legal" aria-label={copy.legal} role="group">
            {product.privacyUrl ? <a href={product.privacyUrl} target="_blank" rel="noreferrer">{copy.privacy}</a> : null}
            {product.termsUrl ? <a href={product.termsUrl} target="_blank" rel="noreferrer">{copy.terms}</a> : null}
          </div>
        ) : null}
      </section>

      {related.length ? (
        <section className="portfolio-section" aria-labelledby="related-title">
          <div className="portfolio-heading"><h2 id="related-title">{portfolio.related}</h2></div>
          <ul className="portfolio-related">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.path}`}>
                  <Image src={getProductIconPath(item)} alt="" width={44} height={44} />
                  <strong>{english ? item.nameEn ?? item.name : item.name}</strong>
                  <ArrowUpRight size={18} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="portfolio-footer">
        <Link href="/#products"><ArrowLeft size={16} aria-hidden /> {portfolio.workAction}</Link>
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

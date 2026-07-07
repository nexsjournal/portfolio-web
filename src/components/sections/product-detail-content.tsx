"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductScreenshots } from "@/components/sections/product-screenshots";
import { Product, getProductIconPath, products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { t } from "@/i18n/site-copy";

type Props = {
  product: Product;
};

export function ProductDetailContent({ product }: Props) {
  const { lang } = useSiteLanguage();
  const copy = t(lang).productDetail;
  const title = lang === "en" ? product.nameEn ?? product.name : product.name;
  const tagline = lang === "en" ? product.taglineEn ?? product.tagline : product.tagline;
  const heroTagline = getHeroTagline(product.slug, tagline, lang);
  const summary = getHeroSummary(product.slug, lang === "en" ? product.summaryEn ?? product.summary : product.summary, lang);
  const category = lang === "en" ? product.categoryEn ?? product.category : product.category;
  const language = lang === "en" ? product.languageEn ?? product.language : product.language;
  const size = lang === "en" ? product.sizeEn ?? product.size : product.size;
  const platform = lang === "en" ? product.platformEn ?? product.platform : product.platform;
  const features = lang === "en" ? product.featuresEn ?? product.features : product.features;
  const screenshots = product.screenshots ?? [];
  const related = products.filter((item) => item.path && item.slug !== product.slug).slice(0, 2);

  return (
    <main className="lex-archive lex-detail">
      <section className="archive-section detail-hero">
        <DetailMarks />
        <div className="detail-breadcrumb">
          <span>PRODUCTS</span>
          <em>{product.nameEn ?? product.name}</em>
          <span>01</span>
        </div>
        <div className="detail-hero-copy">
          <Image src={getProductIconPath(product)} alt="" width={128} height={128} className="detail-app-icon" priority />
          <p>{lang === "zh" && product.nameEn ? `${title} / ${product.nameEn}` : title}</p>
          <h1>
            {getHeroTitleLines(heroTagline).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <strong>{summary}</strong>
          <dl>
            <div>
              <dt>{copy.category}</dt>
              <dd>{category}</dd>
            </div>
            <div>
              <dt>{copy.platform}</dt>
              <dd>{platform}</dd>
            </div>
            <div>
              <dt>{copy.language}</dt>
              <dd>{language}</dd>
            </div>
            <div>
              <dt>{copy.size}</dt>
              <dd>{size}</dd>
            </div>
          </dl>
          <div className="detail-actions">
            {product.platformUrl ? (
              <a href={product.platformUrl} target="_blank" rel="noreferrer">
                {copy.downloadAppStore} →
              </a>
            ) : null}
            <Link href="/#products">{copy.back.replace("← ", "")} →</Link>
          </div>
        </div>
        <div className="detail-hero-art">
          {screenshots.slice(0, 2).map((src, index) => (
            <figure key={src} className={`detail-float-shot detail-float-shot-${index + 1}`}>
              <Image src={src} alt="" width={1284} height={2778} priority={index === 0} />
            </figure>
          ))}
        </div>
      </section>

      <section className="archive-section detail-features">
        <DetailMarks />
        <div className="detail-section-heading">
          <p>FEATURES / 02</p>
          <h2>{getFeatureHeadline(product.slug)}</h2>
          <span>Swipe / Group / Review / Save Space</span>
        </div>
        <div className="detail-feature-list">
          {features.slice(0, 4).map((feature, index) => {
            const [head, body] = splitFeature(feature);
            return (
              <article key={feature}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{head}</strong>
                <p>{body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="screenshots" className="archive-section detail-screenshots">
        <DetailMarks />
        <ProductScreenshots screenshots={screenshots} />
        {product.platformUrl ? (
          <a className="detail-download" href={product.platformUrl} target="_blank" rel="noreferrer">
            {copy.downloadAppStore} →
          </a>
        ) : null}
      </section>

      <section className="archive-section detail-close">
        <DetailMarks />
        <div className="detail-table">
          <InfoItem label={copy.category} value={category} />
          <InfoItem label={copy.platform} value={platform} />
          <InfoItem label={copy.language} value={language} />
          <InfoItem label={copy.size} value={size} />
          {product.privacyUrl ? <InfoLink label={copy.privacy} href={product.privacyUrl} /> : null}
          {product.termsUrl ? <InfoLink label={copy.terms} href={product.termsUrl} /> : null}
        </div>
        <div className="detail-related">
          <h3>相关产品</h3>
          <div>
            {related.map((item) => (
              <Link key={item.slug} href={`/${item.path}`}>
                <Image src={getProductIconPath(item)} alt="" width={128} height={128} />
                <strong>{lang === "en" ? item.nameEn ?? item.name : item.name}</strong>
                <em>{item.nameEn ?? item.name}</em>
                <span>→</span>
              </Link>
            ))}
          </div>
          <a className="detail-feedback" href="mailto:lextellsyou@gmail.com">
            有反馈，直接发给我。 <b>lextellsyou@gmail.com</b> →
          </a>
          <div className="detail-actions detail-actions-close">
            {product.platformUrl ? (
              <a href={product.platformUrl} target="_blank" rel="noreferrer">
                {copy.downloadAppStore} →
              </a>
            ) : null}
            <Link href="/#products">{copy.back.replace("← ", "")} →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function InfoLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <span>{label}</span>
      <strong>→</strong>
    </a>
  );
}

function DetailMarks() {
  return (
    <div className="archive-marks" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function splitFeature(feature: string) {
  const [head, ...rest] = feature.split(/：|:/);
  return [head, rest.join("：") || feature] as const;
}

function getFeatureHeadline(slug: string) {
  if (slug === "travel-route") return "把旅程轨迹，变成一段能被分享的故事。";
  if (slug === "altitudeshot") return "把到达这一刻，变成一张可收藏的卡片。";
  return "把清理照片这件事，变成一个顺手的动作。";
}

function getHeroTagline(slug: string, tagline: string, lang: string) {
  if (lang === "zh") {
    if (slug === "travel-route") return "让旅程轨迹，变成生动的动画视频。";
    if (slug === "altitudeshot") return "把登顶那一刻，做成值得收藏的卡片。";
    if (slug === "rephoto") return "让回忆更清晰，让相册更轻盈。";
  }
  const match = tagline.match(/^.*?[。.!?]/);
  return match?.[0] ?? tagline;
}

function getHeroSummary(slug: string, summary: string, lang: string) {
  if (lang === "zh") {
    if (slug === "travel-route") return "添加地点与路线，快速生成旅行路线动画。";
    if (slug === "altitudeshot") return "记录海拔、位置和时间，一键生成分享卡片。";
    if (slug === "rephoto") return "用滑动手势快速整理照片与视频。";
  }
  return summary;
}

function getHeroTitleLines(tagline: string) {
  if (!tagline.includes("，")) return [tagline];
  const [head, ...rest] = tagline.split("，");
  return [`${head}，`, rest.join("，")].filter(Boolean);
}

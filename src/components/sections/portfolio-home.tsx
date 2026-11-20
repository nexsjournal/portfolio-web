"use client";

import { ArrowDown, ArrowUpRight, Github, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { type Product, getProductIconPath, products } from "@/content/products";
import { type SiteLang, useSiteLanguage } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { ICP_BEIAN_URL, ICP_NUMBER, SITE_BRAND } from "@/lib/site-compliance";

const publishedProducts = products.filter((item) => item.path && !item.comingSoon);

export function PortfolioHome() {
  const { lang } = useSiteLanguage();
  const copy = portfolioCopy[lang];

  return (
    <main id="main-content" className="portfolio-page portfolio-wrap" tabIndex={-1}>
      <section id="top" className="portfolio-intro" aria-labelledby="intro-title">
        <div className="portfolio-intro-copy">
          <h1 id="intro-title">{copy.greeting} <em>Lex</em><span>.</span></h1>
          <p className="portfolio-motto">{copy.motto}</p>
          <p>{copy.intro}</p>
          <a className="portfolio-action" href="#products">
            {copy.workAction} <ArrowDown size={16} aria-hidden />
          </a>
        </div>
        <figure className="portfolio-portrait">
          <Image
            src="/assets/reference/main-avatar.png"
            alt={copy.portrait}
            width={1000}
            height={1000}
            sizes="(max-width: 600px) 200px, 348px"
            preload
          />
          <figcaption lang="zh-CN">见微筑境</figcaption>
        </figure>
      </section>

      <section id="products" className="portfolio-section" aria-labelledby="work-title">
        <div className="portfolio-heading">
          <h2 id="work-title">{copy.workTitle}</h2>
          <span>{String(publishedProducts.length).padStart(2, "0")} / iOS</span>
        </div>
        <div className="portfolio-works">
          {publishedProducts.map((product) => (
            <ProjectCard key={product.slug} product={product} lang={lang} />
          ))}
        </div>
      </section>

      <section id="about" className="portfolio-section" aria-labelledby="about-title">
        <div className="portfolio-heading"><h2 id="about-title">{copy.aboutTitle}</h2></div>
        <div className="portfolio-about">
          <div className="portfolio-about-art">
            <Image
              src="/assets/reference/avatar-front.png"
              alt=""
              width={680}
              height={1000}
              sizes="(max-width: 600px) 130px, 188px"
            />
          </div>
          <div className="portfolio-about-copy">
            <h3>{copy.aboutHeading}</h3>
            <p>{copy.aboutBody}</p>
            <ul className="portfolio-tags" aria-label={lang === "zh" ? "方向" : "Disciplines"}>
              <li>PM</li><li>UX Design</li><li>FDE</li><li>Indie Apps</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="build" className="portfolio-section" aria-labelledby="build-title">
        <div className="portfolio-heading"><h2 id="build-title">{copy.buildTitle}</h2></div>
        <ol id="philosophy" className="portfolio-principles">
          {copy.principles.map((item, index) => (
            <li key={item.title}>
              <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className="portfolio-section portfolio-contact" aria-labelledby="contact-title">
        <h2 id="contact-title">{copy.contactTitle}</h2>
        <p>{copy.contactBody}</p>
        <div className="portfolio-contact-links">
          <a href="mailto:lextellsyou@gmail.com" className="portfolio-action">
            <Mail size={17} aria-hidden /> lextellsyou@gmail.com
          </a>
          <a href="https://www.xiaohongshu.com/user/profile/5dc92e8000000000010092a6" target="_blank" rel="noreferrer">
            {copy.xiaohongshu} <ArrowUpRight size={16} aria-hidden />
          </a>
          <a href="https://github.com/nexsjournal" target="_blank" rel="noreferrer">
            <Github size={16} aria-hidden /> GitHub <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </section>

      <footer className="portfolio-footer">
        <span>© {new Date().getFullYear()} {SITE_BRAND}</span>
        <a href={ICP_BEIAN_URL} target="_blank" rel="noreferrer">{ICP_NUMBER}</a>
      </footer>
    </main>
  );
}

function ProjectCard({ product, lang }: { product: Product; lang: SiteLang }) {
  const english = lang === "en";
  const title = english ? product.nameEn ?? product.name : product.name;
  const titleId = `work-${product.slug}`;

  return (
    <article className="portfolio-project" data-project={product.slug}>
      <Link href={`/${product.path}`} aria-labelledby={titleId} className="portfolio-project-link">
        <div className="portfolio-project-copy">
          <span className="portfolio-project-arrow" aria-hidden><ArrowUpRight size={21} /></span>
          <div className="portfolio-project-title">
            <Image src={getProductIconPath(product)} alt="" width={40} height={40} />
            <h3 id={titleId}>
              {title} {!english && product.nameEn ? <small lang="en">{product.nameEn}</small> : null}
            </h3>
          </div>
          <p>{english ? product.taglineEn ?? product.tagline : product.tagline}</p>
          <ul className="portfolio-tags">
            <li>{english ? product.categoryEn ?? product.category : product.category}</li>
            <li>{product.platform}</li>
          </ul>
        </div>
        {product.screenshots?.length ? (
          <div className="portfolio-project-art" aria-hidden>
            {product.screenshots.slice(0, 3).map((src) => (
              <Image key={src} src={src} alt="" width={1284} height={2778} sizes="(max-width: 600px) 28vw, 125px" />
            ))}
          </div>
        ) : null}
      </Link>
    </article>
  );
}

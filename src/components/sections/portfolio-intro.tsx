"use client";

import { ArrowLeftRight, Mail, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { getCaseStudyByProductSlug } from "@/content/case-studies";
import { type Product, getProductIconPath } from "@/content/products";
import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";
import { PortfolioGazeAvatar } from "./portfolio-gaze-avatar";

export function PortfolioIntro({ lang, products }: { lang: SiteLang; products: Product[] }) {
  const copy = portfolioCopy[lang];
  const seal = useRef<HTMLDialogElement>(null);
  const [screen, setScreen] = useState(0);
  const activeProduct = products[screen - 1];
  const activeName = activeProduct && (lang === "en" ? activeProduct.nameEn ?? activeProduct.name : activeProduct.name);

  return (
    <section id="top" className="portfolio-intro" aria-labelledby="intro-title">
      <div className="portfolio-intro-copy">
        <div className="portfolio-intro-name">
          <h1 id="intro-title">{copy.introName}</h1>
          <button className="portfolio-seal" type="button" aria-label={copy.sealLabel} aria-haspopup="dialog" onClick={() => seal.current?.showModal()}>
            <span aria-hidden>L<span>✦</span></span>
          </button>
        </div>
        <p className="portfolio-intro-bio">
          {copy.introRole}
          {lang === "zh" ? "，" : ". "}
          {copy.introBio}
        </p>
        <p className="portfolio-intro-line"><span className="portfolio-intro-shine">{copy.motto}</span></p>
        <div className="portfolio-intro-line portfolio-intro-link-row">
          <span>{copy.introWork}</span>
          <ul className="portfolio-intro-apps">
            {products.map((product) => {
              const caseStudy = getCaseStudyByProductSlug(product.slug);
              const href = caseStudy ? `/projects/${caseStudy.slug}?from=home` : "/projects";
              return (
                <li key={product.slug}>
                  <Link href={href} className="portfolio-intro-sticker" data-app={product.slug}>
                    <Image src={getProductIconPath(product)} alt="" width={20} height={20} />
                    {lang === "en" ? product.nameEn ?? product.name : product.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="portfolio-intro-line portfolio-intro-link-row portfolio-intro-collab-row">
          {copy.introCollab}
          <a className="portfolio-intro-sticker portfolio-intro-studio" href="mailto:lextellsyou@gmail.com">
            {copy.introCta} <Mail size={14} aria-hidden />
          </a>
        </p>
      </div>

      <figure className="portfolio-computer">
        <Image className="portfolio-computer-case" src="/assets/hero/retro-crt.webp" alt="" width={1200} height={800} sizes="(max-width: 670px) 90vw, 490px" preload />
        <button
          className="portfolio-computer-screen"
          type="button"
          aria-label={copy.screenNext}
          title={copy.screenNext}
          onClick={() => setScreen((current) => (current + 1) % (products.length + 1))}
        >
          {activeProduct ? (
            <span className="portfolio-computer-app" key={activeProduct.slug} data-app={activeProduct.slug}>
              <span className="portfolio-computer-app-info">
                <Image src={getProductIconPath(activeProduct)} alt="" width={56} height={56} />
                <strong>{activeName}</strong>
              </span>
              {activeProduct.screenshots?.[0] ? <Image className="portfolio-computer-app-shot" src={activeProduct.screenshots[0]} alt="" width={1284} height={2778} sizes="95px" /> : null}
            </span>
          ) : (
            <PortfolioGazeAvatar label={copy.portrait} />
          )}
          <span className="portfolio-computer-switch" aria-hidden><ArrowLeftRight size={13} /></span>
        </button>
        <figcaption className="sr-only" aria-live="polite">{activeName ?? copy.portrait}</figcaption>
      </figure>

      <dialog ref={seal} className="portfolio-dialog portfolio-dialog-letter" aria-labelledby="seal-title" onClick={(event) => { if (event.target === event.currentTarget) seal.current?.close(); }}>
        <div className="portfolio-dialog-content">
          <button type="button" className="portfolio-dialog-close" aria-label={copy.close} onClick={() => seal.current?.close()}><X size={20} aria-hidden /></button>
          <div className="portfolio-letter-address">Lex Studio</div>
          <h2 id="seal-title">{copy.sealTitle}</h2>
          <p>{copy.sealBody}</p>
          <strong className="portfolio-letter-signature">{copy.introName}</strong>
        </div>
      </dialog>

    </section>
  );
}

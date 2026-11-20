"use client";

import { ArrowLeftRight, ArrowUpRight, Copy, Mail, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { type Product, getProductIconPath } from "@/content/products";
import type { SiteLang } from "@/context/site-language";
import { portfolioCopy } from "@/i18n/portfolio-copy";

const email = "lextellsyou@gmail.com";

export function PortfolioIntro({ lang, products }: { lang: SiteLang; products: Product[] }) {
  const copy = portfolioCopy[lang];
  const seal = useRef<HTMLDialogElement>(null);
  const contact = useRef<HTMLDialogElement>(null);
  const [screen, setScreen] = useState(0);
  const [copied, setCopied] = useState(false);
  const activeProduct = products[screen - 1];
  const activeName = activeProduct && (lang === "en" ? activeProduct.nameEn ?? activeProduct.name : activeProduct.name);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="top" className="portfolio-intro" aria-labelledby="intro-title">
      <div className="portfolio-intro-copy">
        <div className="portfolio-intro-name">
          <h1 id="intro-title">Lex</h1>
          <button className="portfolio-seal" type="button" aria-label={copy.sealLabel} aria-haspopup="dialog" onClick={() => seal.current?.showModal()}>
            <span aria-hidden>L<span>✦</span></span>
          </button>
        </div>
        <p className="portfolio-intro-line">{copy.introRole}</p>
        <p className="portfolio-intro-line"><span className="portfolio-intro-shine">{copy.motto}</span></p>
        <p className="portfolio-intro-line portfolio-intro-link-row">
          {copy.introNext}
          <button type="button" className="portfolio-intro-slot" aria-haspopup="dialog" onClick={() => contact.current?.showModal()}>{copy.introContact}</button>
        </p>
        <p className="portfolio-intro-line portfolio-intro-link-row">
          {copy.introStudio}
          <a className="portfolio-intro-sticker portfolio-intro-studio" href="#about">Lex Studio <ArrowUpRight size={14} aria-hidden /></a>
        </p>
        <div className="portfolio-intro-line portfolio-intro-link-row">
          <span>{copy.introWork}</span>
          <ul className="portfolio-intro-apps">
            {products.map((product) => (
              <li key={product.slug}>
                <Link href={`/${product.path}`} className="portfolio-intro-sticker" data-app={product.slug}>
                  <Image src={getProductIconPath(product)} alt="" width={20} height={20} />
                  {lang === "en" ? product.nameEn ?? product.name : product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
            <Image className="portfolio-computer-avatar" src="/assets/hero/lex-3d-avatar.png" alt={copy.portrait} width={1254} height={1254} sizes="(max-width: 670px) 42vw, 196px" preload />
          )}
          <span className="portfolio-computer-switch" aria-hidden><ArrowLeftRight size={13} /></span>
        </button>
        <figcaption className="sr-only" aria-live="polite">{activeName ?? copy.portrait}</figcaption>
      </figure>

      <dialog ref={seal} className="portfolio-dialog portfolio-dialog-letter" aria-labelledby="seal-title" onClick={(event) => { if (event.target === event.currentTarget) seal.current?.close(); }}>
        <div className="portfolio-dialog-content">
          <button type="button" className="portfolio-dialog-close" aria-label={copy.close} onClick={() => seal.current?.close()}><X size={20} aria-hidden /></button>
          <div className="portfolio-letter-address">Lex Studio <span lang="zh-CN">见微筑境</span></div>
          <h2 id="seal-title">{copy.sealTitle}</h2>
          <p>{copy.sealBody}</p>
          <strong className="portfolio-letter-signature">Lex</strong>
        </div>
      </dialog>

      <dialog ref={contact} className="portfolio-dialog" aria-labelledby="hello-title" onClose={() => setCopied(false)} onClick={(event) => { if (event.target === event.currentTarget) contact.current?.close(); }}>
        <div className="portfolio-dialog-content">
          <button type="button" className="portfolio-dialog-close" aria-label={copy.close} onClick={() => contact.current?.close()}><X size={20} aria-hidden /></button>
          <h2 id="hello-title">{copy.contactTitle}</h2>
          <p>{copy.contactBody}</p>
          <div className="portfolio-dialog-actions">
            <a className="portfolio-action" href={`mailto:${email}`}><Mail size={16} aria-hidden /> {email} <ArrowUpRight size={14} aria-hidden /></a>
            <button className="portfolio-copy" type="button" onClick={copyEmail}><Copy size={16} aria-hidden /><span aria-live="polite">{copied ? copy.emailCopied : copy.copyEmail}</span></button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

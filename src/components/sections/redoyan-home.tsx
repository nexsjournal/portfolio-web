"use client";

import Image from "next/image";
import Link from "next/link";

import { getProductIconPath, products } from "@/content/products";
import { useSiteLanguage } from "@/context/site-language";
import { HeroParticleCanvas } from "./hero-particle-canvas";

const stackItems = [
  "PM",
  "UX",
  "FDE",
  "Indie Apps",
  "Next.js",
  "React",
  "GSAP",
  "Tailwind",
  "iOS",
  "App Store",
  "Product Copy",
  "Interaction",
  "Responsive",
  "Motion",
  "A11y",
];

const philosophy = [
  {
    no: "01",
    title: "只做自己会用的产品",
    body: "先说服自己，再谈上线。",
    en: "Build what I'd use",
  },
  {
    no: "02",
    title: "功能克制，但体验优先",
    body: "少即是多，交互要经得起日常。",
    en: "Fewer features, better feel",
  },
  {
    no: "03",
    title: "让记录更简单，而不是更复杂",
    body: "把路径缩短，把反馈说清楚。",
    en: "Make capturing easier",
  },
];

const rhythm = [
  ["01", "OBSERVE", "从生活里的小麻烦开始"],
  ["02", "SHAPE", "先让路径变短"],
  ["03", "BUILD", "把想法落进产品"],
  ["04", "SHIP", "上线后继续看反馈"],
];

export function RedoyanHome() {
  const { lang } = useSiteLanguage();
  const liveProducts = products.filter((item) => item.path && !item.comingSoon);
  const comingSoon = products.find((item) => item.comingSoon);
  const productRows = comingSoon ? [...liveProducts, comingSoon] : liveProducts;

  return (
    <main className="lex-archive">
      <section id="top" className="archive-section archive-hero archive-hero-dark">
        <ArchiveMarks />
        <div className="archive-hero-meta">
          <span>00.1</span>
          <span>/ INDEX</span>
        </div>
        <div className="archive-hero-copy">
          <h1>LEX</h1>
          <h2>于细微处，为生活作序</h2>
          <p>PM & UX & 独立开发者 <b /> 构建有用且有趣的 APP</p>
          <div className="archive-actions">
            <a href="#products">查看产品</a>
            <a href="#contact">联系我</a>
          </div>
        </div>
        <div className="archive-hero-visual">
          <HeroParticleCanvas />
        </div>
      </section>

      <section id="about" className="archive-section archive-about">
        <ArchiveMarks />
        <div className="archive-about-portrait">
          <Image src="/assets/reference/avatar-front.png" alt="" width={680} height={1000} />
        </div>
        <div className="archive-about-copy">
          <p className="archive-label">ABOUT / 00.2</p>
          <h2>我关注真实生活里的微小阻力，并把它们变成可以被使用、被分享、被持续迭代的小产品。</h2>
          <div className="archive-about-grid">
            <ul>
              <li>PM & UX</li>
              <li>FDE & Indie Dev</li>
              <li>Product Judgment</li>
              <li>UX Craft</li>
            </ul>
            <div>
              {rhythm.map(([no, title, body]) => (
                <article key={title}>
                  <span>{no}</span>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
          <a className="archive-inline-link" href="#products">
            继续看作品
          </a>
        </div>
        <aside className="archive-side-note">LIFE FRICTION / PRODUCT MEMORY</aside>
      </section>

      <section id="products" className="archive-section archive-products">
        <ArchiveMarks />
        <div className="archive-products-lab" aria-hidden>
          <div className="lab-coordinates">31.2304° N<br />121.4737° E</div>
          <Image
            src="/assets/reference/products-scene-newimg-v2.png"
            alt=""
            width={1536}
            height={1024}
            className="archive-products-scene"
          />
          <div className="lab-footer">PRODUCT BOARD / EVERGREEN SCENE</div>
        </div>

        <div className="archive-products-copy">
          <p className="archive-label">PRODUCTS / 00.3</p>
          <h2>
            <span>Products /</span>
            <span>App Archive</span>
          </h2>
          <p>一些我折腾出来的小产品，<br />有的是为了解决问题，有的是因为觉得可以更好。</p>
          <div className="archive-product-list">
            {productRows.map((item, index) => {
              const isLive = item.path && !item.comingSoon;
              return (
                <Link
                  key={item.slug}
                  href={isLive ? `/${item.path}` : "#contact"}
                  className="archive-product-row"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="archive-product-icon">
                    {isLive ? (
                      <Image src={getProductIconPath(item)} alt="" width={92} height={92} />
                    ) : null}
                  </div>
                  <div>
                    <strong>{lang === "en" ? item.nameEn ?? item.name : item.name}</strong>
                    <em>{isLive ? item.nameEn ?? item.name : "In Progress"}</em>
                  </div>
                  <p>
                    {lang === "en" ? item.categoryEn ?? item.category : item.category}
                    <br />
                    {isLive
                      ? lang === "en"
                        ? item.taglineEn ?? item.tagline
                        : item.tagline
                      : "下一款产品，新的想法正在路上。"}
                  </p>
                  <i>→</i>
                </Link>
              );
            })}
          </div>
          <a className="archive-inline-link archive-products-link" href="#products">
            查看详情
          </a>
        </div>
      </section>

      <section id="philosophy" className="archive-section archive-philosophy">
        <ArchiveMarks />
        <div className="archive-contours" aria-hidden />
        <div className="archive-philosophy-copy">
          <p className="archive-label">PHILOSOPHY / 00.4</p>
          <h2>
            我不太相信功能越多越好，
            <br />
            更在意的是，
            <br />
            用起来<span>有没有阻力</span>。
          </h2>
        </div>
        <div className="archive-principles">
          {philosophy.map((item) => (
            <article key={item.no}>
              <strong>{item.no}<b>.</b></strong>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <em>{item.en}</em>
            </article>
          ))}
        </div>
        <a className="archive-inline-link" href="#products">
          看我的取舍
        </a>
      </section>

      <section id="build" className="archive-section archive-build">
        <ArchiveMarks dark />
        <div className="archive-build-copy">
          <p className="archive-label">BUILD STACK / 00.5</p>
          <h2>BUILD<br />STACK</h2>
          <p>Product judgment, UX craft, and engineering are one path from idea to shipped work.</p>
          <small>把交互、数据和视觉一起落进可使用的产品。</small>
          <a href="#contact">看构建方式</a>
        </div>
        <div className="archive-stack-panel">
          <div className="archive-stack-grid">
            {stackItems.map((item) => (
              <span key={item}>+ {item}</span>
            ))}
          </div>
          <div className="archive-process">
            {["OBSERVE", "SHAPE", "BUILD", "SHIP"].map((item, index) => (
              <article key={item}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
        <div className="archive-build-image" aria-hidden>
          <Image src="/assets/reference/build-img.png" alt="" width={1000} height={1000} />
        </div>
      </section>

      <section id="contact" className="archive-section archive-contact">
        <ArchiveMarks />
        <p className="archive-label">CONTACT / 00.6</p>
        <h2>有想法，就发给我。</h2>
        <p>有想法、合作或反馈，可以直接联系我。我基本都会看。</p>
        <div className="archive-contact-table">
          <a href="mailto:lextellsyou@gmail.com">
            <span><Image src="/assets/contact/email.svg" alt="" width={32} height={32} /></span>
            <strong>Email</strong>
            <em>lextellsyou@gmail.com</em>
          </a>
          <a href="https://www.xiaohongshu.com/user/profile/5dc92e8000000000010092a6" target="_blank" rel="noreferrer">
            <span><Image src="/assets/contact/xhs.svg" alt="" width={32} height={32} /></span>
            <strong>小红书</strong>
            <em>人造人十号</em>
          </a>
        </div>
        <a className="archive-contact-banner" href="mailto:lextellsyou@gmail.com">
          <span>LET&apos;S CONNECT</span>
          <strong>开始对话 →</strong>
          <span>I&apos;LL REPLY ASAP</span>
        </a>
        <div className="archive-contact-avatar">
          <Image src="/assets/reference/main-avatar.png" alt="" width={1000} height={1000} />
        </div>
      </section>
    </main>
  );
}

function ArchiveMarks({ dark = false }: { dark?: boolean }) {
  return (
    <div className={dark ? "archive-marks archive-marks-dark" : "archive-marks"} aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

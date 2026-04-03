"use client";

import Image from "next/image";

import { SITE_COPY, siteConfig } from "@/content/site";
import { useLanguage } from "@/i18n/language";

import { MagneticButton } from "./MagneticButton";
import { PageShell } from "./PageShell";
import { Reveal } from "./Reveal";

export type HomePageProps = {
  /** `public/assets/apps/journey-time/logo/`，建议 1:1 */
  journeyTimeLogo?: string | null;
};

export function HomePage({ journeyTimeLogo = null }: HomePageProps = {}) {
  const { language } = useLanguage();
  const copy = SITE_COPY[language];

  const sectionLabel = {
    about: language === "zh" ? "01 · 关于" : "01 · ABOUT",
    product: language === "zh" ? "02 · 产品" : "02 · PRODUCT",
    philosophy: language === "zh" ? "03 · 方法" : "03 · PHILOSOPHY",
    contact: language === "zh" ? "04 · 联系" : "04 · CONTACT",
  } as const;

  const socialHint =
    language === "zh"
      ? "提示：把 `src/content/site.ts` 里的 `siteConfig.social` 与 `email` 替换为你的真实链接。"
      : "Tip: replace `siteConfig.social` + `email` in `src/content/site.ts` with your real links.";

  return (
    <PageShell>
      <div id="top">
        <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
          {/* Hero：单列，去掉右侧 Featured 与底部标签 */}
          <section className="relative pb-14 pt-6 sm:pb-20 sm:pt-10">
            <div className="max-w-3xl">
              <Reveal>
                <p className="font-display text-xs tracking-[0.35em] text-muted">
                  {copy.hero.kicker}
                </p>
                <h1 className="mt-6 font-display text-4xl leading-[1.05] text-foreground sm:text-6xl">
                  {copy.hero.headline}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {copy.hero.subhead}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <MagneticButton
                    href="/apps/journey-time"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors duration-200 hover:bg-primary/90"
                  >
                    {copy.hero.primaryCta}
                  </MagneticButton>

                  <a
                    href="#contact"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/[0.1] bg-background/25 px-6 py-3 text-sm font-semibold text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background/40"
                  >
                    {copy.hero.secondaryCta}
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          <section id="about" className="scroll-mt-28 py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="font-display text-xs tracking-[0.35em] text-muted">
                    {sectionLabel.about}
                  </p>
                  <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
                    {copy.about.title}
                  </h2>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal>
                  <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
                    {copy.about.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>

                  <div className="mt-10 grid gap-3 sm:grid-cols-3">
                    {copy.about.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-white/[0.07] bg-background/25 px-4 py-4 backdrop-blur-sm"
                      >
                        <p className="text-xs text-muted">{s.label}</p>
                        <p className="mt-2 font-display text-lg text-foreground">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* 产品：特点单列竖排 */}
          <section id="product" className="scroll-mt-28 py-20 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-display text-xs tracking-[0.35em] text-muted">
                    {sectionLabel.product}
                  </p>
                  <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
                    {copy.featured.title}
                  </h2>
                </div>
                <MagneticButton
                  href="/apps/journey-time"
                  className="inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                >
                  {copy.featured.cta}
                </MagneticButton>
              </div>
            </Reveal>

            <div className="mt-10">
              <Reveal>
                <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-background/20 via-background/10 to-background/20 p-6 sm:p-10">
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                  <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

                  <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-7">
                      <p className="max-w-prose text-sm leading-relaxed text-muted sm:text-base">
                        {copy.featured.body}
                      </p>

                      <ul className="mt-8 flex max-w-xl flex-col gap-3">
                        {copy.featured.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex gap-3 border-l-2 border-primary/25 pl-4 text-sm leading-relaxed text-foreground/90"
                          >
                            <span className="text-muted">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-center lg:col-span-5 lg:justify-end">
                      {journeyTimeLogo ? (
                        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-ios-app sm:max-w-[220px]">
                          {journeyTimeLogo.endsWith(".svg") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={journeyTimeLogo}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Image
                              src={journeyTimeLogo}
                              alt=""
                              width={220}
                              height={220}
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="relative flex aspect-square w-full max-w-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/40 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                          <div className="flex items-center justify-between text-xs text-muted">
                            <span>Journey</span>
                            <span className="rounded-full border border-white/[0.08] bg-background/30 px-2 py-1">
                              Live
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-2/3 rounded-full bg-white/10" />
                            <div className="h-2 w-full rounded-full bg-white/10" />
                          </div>
                          <div className="rounded-xl border border-white/[0.07] bg-background/25 p-3">
                            <p className="text-[10px] text-muted">{copy.featured.badge}</p>
                            <p className="mt-1 font-display text-sm text-foreground">
                              {copy.featured.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* 构建方式：与「关于」「产品」同版心（12 列） */}
          <section id="philosophy" className="scroll-mt-28 py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="font-display text-xs tracking-[0.35em] text-muted">
                    {sectionLabel.philosophy}
                  </p>
                  <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
                    {copy.philosophy.title}
                  </h2>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <div className="relative mt-12 md:mt-14 lg:mt-0">
                  <div
                    aria-hidden
                    className="absolute left-[0.6rem] top-2 bottom-2 w-px bg-gradient-to-b from-primary/35 via-primary/15 to-transparent md:left-3"
                  />
                  <div className="space-y-10 md:space-y-12">
                    {copy.philosophy.items.map((item, idx) => (
                      <Reveal key={item.title}>
                        <div className="relative pl-10 md:pl-12">
                          <div className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-primary/35 bg-background/80 md:left-0.5">
                            <span className="font-display text-[10px] font-semibold text-primary">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="font-display text-lg text-foreground md:text-xl">
                            {item.title}
                          </h3>
                          <p className="mt-2 max-w-prose text-base leading-relaxed text-muted md:text-lg">
                            {item.body}
                          </p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 联系：与上节同版心 */}
          <section id="contact" className="scroll-mt-28 py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="font-display text-xs tracking-[0.35em] text-muted">
                    {sectionLabel.contact}
                  </p>
                  <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
                    {copy.contact.title}
                  </h2>
                  <p className="mt-5 max-w-prose text-base leading-relaxed text-muted sm:text-lg">
                    {copy.contact.body}
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal>
                  <div className="mt-10 grid gap-10 border-t border-white/[0.06] pt-10 sm:grid-cols-2 sm:gap-12 lg:mt-0 lg:border-t-0 lg:pt-0">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        {copy.contact.emailLabel}
                      </p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="mt-3 inline-flex cursor-pointer break-all font-display text-xl text-foreground transition-colors duration-200 hover:text-primary sm:text-2xl"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        {copy.contact.socialLabel}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={siteConfig.social.github}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer rounded-full border border-white/[0.08] bg-background/25 px-4 py-2 text-sm text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-primary/45"
                        >
                          GitHub
                        </a>
                        <a
                          href={siteConfig.social.x}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer rounded-full border border-white/[0.08] bg-background/25 px-4 py-2 text-sm text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-primary/45"
                        >
                          X
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="mt-8 text-xs leading-relaxed text-muted">{socialHint}</p>
                </Reveal>
              </div>
            </div>
          </section>

          <footer className="mt-6 border-t border-white/[0.05] pt-12 text-sm text-muted">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{copy.footer.note}</p>
              <p className="text-xs text-muted/80">
                Built with Next.js · Tailwind · Framer Motion
              </p>
            </div>
          </footer>
        </main>
      </div>
    </PageShell>
  );
}

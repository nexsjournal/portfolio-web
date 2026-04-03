"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

import { SITE_COPY, siteConfig } from "@/content/site";
import { useLanguage } from "@/i18n/language";

import { HeroFluidBackdrop } from "./HeroFluidBackdrop";
import { HeroLightBeams } from "./HeroLightBeams";
import { MagneticButton } from "./MagneticButton";
import { PageShell } from "./PageShell";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export type HomePageProps = {
  journeyTimeLogo?: string | null;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

export function HomePage({ journeyTimeLogo = null }: HomePageProps = {}) {
  const { language } = useLanguage();
  const copy = SITE_COPY[language];
  const reduceMotion = useReducedMotion();
  const [heroBeamsOn, setHeroBeamsOn] = useState(false);
  const heroBeamsScheduled = useRef(false);
  const heroBeamsVisible = reduceMotion === true || heroBeamsOn;

  const sectionLabel = {
    about: language === "zh" ? "01 · 关于" : "01 · ABOUT",
    product: language === "zh" ? "02 · 产品" : "02 · PRODUCT",
    philosophy: language === "zh" ? "03 · 方法" : "03 · PHILOSOPHY",
    contact: language === "zh" ? "04 · 联系" : "04 · CONTACT",
  } as const;

  return (
    <PageShell>
      <div id="top">
        {/* 首屏全宽；背景层向上延伸覆盖导航下方，消除顶栏与渐变之间的硬边 */}
        <section className="relative isolate w-full min-h-[calc(100dvh-6.5rem)] overflow-x-clip overflow-y-visible sm:min-h-[calc(100dvh-6rem)]">
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-24 z-0 sm:-bottom-24 sm:-top-28">
            <HeroFluidBackdrop />
          </div>
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-24 z-[5] sm:-bottom-24 sm:-top-28">
            <HeroLightBeams visible={heroBeamsVisible} />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-6.5rem)] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-10 text-center sm:min-h-[calc(100dvh-6rem)] sm:px-6 sm:pb-20">
            <div className="flex w-full max-w-4xl flex-col items-center px-1">
              <m.div
                className="flex w-full flex-col items-center"
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "show"}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
                  },
                }}
              >
                <m.p
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: heroEase },
                    },
                  }}
                  className="font-display text-xs tracking-[0.35em] text-muted"
                >
                  {copy.hero.kicker}
                </m.p>
                <m.h1
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.62, ease: heroEase },
                    },
                  }}
                  className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-foreground drop-shadow-[0_0_40px_rgba(45,212,191,0.12)] sm:text-6xl md:text-7xl"
                >
                  {copy.hero.headline}
                </m.h1>
                <m.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.58, ease: heroEase },
                    },
                  }}
                  className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
                >
                  {copy.hero.subhead}
                </m.p>

                <m.div
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.52, ease: heroEase },
                    },
                  }}
                  className="mt-10 flex justify-center"
                  onAnimationComplete={() => {
                    if (reduceMotion) return;
                    if (heroBeamsScheduled.current) return;
                    heroBeamsScheduled.current = true;
                    window.setTimeout(() => setHeroBeamsOn(true), 500);
                  }}
                >
                  <m.a
                    href="#contact"
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { scale: 1.03, borderColor: "rgba(37, 99, 235, 0.55)" }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/[0.1] bg-background/25 px-6 py-3 text-sm font-semibold text-foreground/90 shadow-[0_0_40px_-12px_rgba(45,212,191,0.35)] backdrop-blur-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background/40"
                  >
                    {copy.hero.secondaryCta}
                  </m.a>
                </m.div>
              </m.div>
            </div>
          </div>
        </section>

        <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-0 sm:px-6">
          <section id="about" className="scroll-mt-28 py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="font-display text-xs tracking-[0.35em] text-muted">
                    {sectionLabel.about}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
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
                  <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
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
                <TiltCard className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-background/20 via-background/10 to-background/20 p-6 sm:p-10 [transform-style:preserve-3d]">
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
                </TiltCard>
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
                  <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
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
                  <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                    {copy.contact.title}
                  </h2>
                  <p className="mt-5 max-w-prose text-base leading-relaxed text-muted sm:text-lg">
                    {copy.contact.body}
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal>
                  <div className="mt-10 grid grid-cols-1 gap-10 border-t border-white/[0.06] pt-10 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8 lg:mt-0 lg:border-t-0 lg:pt-0">
                    <div className="min-w-0 md:min-w-[12rem] md:pr-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        {copy.contact.emailLabel}
                      </p>
                      <div className="mt-3 max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="inline-block whitespace-nowrap font-display text-sm leading-normal text-foreground transition-colors duration-200 hover:text-primary sm:text-base md:text-lg"
                        >
                          {siteConfig.email}
                        </a>
                      </div>
                    </div>
                    <div className="shrink-0 md:pt-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        {copy.contact.socialLabel}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={siteConfig.social.github}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer rounded-full border border-white/[0.08] bg-background/25 px-3 py-1.5 text-xs text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-accent/50 sm:px-3.5 sm:py-2 sm:text-sm"
                        >
                          GitHub
                        </a>
                        <a
                          href={siteConfig.social.x}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer rounded-full border border-white/[0.08] bg-background/25 px-3 py-1.5 text-xs text-foreground/90 backdrop-blur-sm transition-colors duration-200 hover:border-accent/50 sm:px-3.5 sm:py-2 sm:text-sm"
                        >
                          X
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <footer className="mt-6 border-t border-white/[0.05] pt-12 text-sm text-muted">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{copy.footer.note}</p>
              <p className="text-xs text-muted/80">
                Next.js · Tailwind · Framer Motion · GSAP
              </p>
            </div>
          </footer>
        </main>
      </div>
    </PageShell>
  );
}

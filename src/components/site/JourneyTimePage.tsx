"use client";

import Image from "next/image";
import Link from "next/link";

import { JOURNEY_TIME_COPY } from "@/content/site";
import { useLanguage } from "@/i18n/language";

import { PageShell } from "./PageShell";
import { Reveal } from "./Reveal";

type Props = {
  logo: string | null;
  screens: string[];
  marketing: string[];
};

export function JourneyTimePage({ logo, screens, marketing }: Props) {
  const { language } = useLanguage();
  const copy = JOURNEY_TIME_COPY[language];

  const gallery = [...marketing, ...screens];

  return (
    <PageShell>
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="w-fit cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              ← {language === "zh" ? "返回首页" : "Back to home"}
            </Link>
            <div className="rounded-full border border-white/[0.08] bg-background/25 px-3 py-1 text-xs text-muted backdrop-blur-sm">
              {copy.hero.status}
            </div>
          </div>
        </Reveal>

        <section className="mt-10">
          <Reveal>
            {/* Logo 固定 156×156；圆角用 rounded-ios-app-fixed（约 34px，贴近 iOS 比例） */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {logo ? (
                <div className="relative mx-auto h-[156px] w-[156px] shrink-0 overflow-hidden rounded-ios-app-fixed sm:mx-0">
                  {logo.endsWith(".svg") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={logo}
                      alt=""
                      width={156}
                      height={156}
                      className="h-full w-full object-contain"
                      sizes="156px"
                      priority
                    />
                  )}
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs tracking-[0.35em] text-muted">
                  {copy.hero.kicker}
                </p>
                <h1 className="mt-4 font-display text-4xl text-foreground sm:text-6xl">
                  {copy.hero.name}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                  {copy.hero.tagline}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-16 md:mt-20">
          <Reveal>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              {copy.story.title}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              {copy.story.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="mt-16 md:mt-20">
          <Reveal>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              {copy.features.title}
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.features.items.map((item) => (
              <Reveal key={item.title}>
                <div className="h-full rounded-3xl border border-white/[0.08] bg-background/25 p-6 backdrop-blur-sm">
                  <p className="font-display text-lg text-foreground">{item.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                  {copy.gallery.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {copy.gallery.hint}
                </p>
              </div>
              <p className="text-xs text-muted">
                {gallery.length} {language === "zh" ? "张图片" : "images"}
              </p>
            </div>
          </Reveal>

          {gallery.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-white/[0.12] bg-background/20 p-8 text-sm text-muted">
              {language === "zh"
                ? "还没有检测到图片：把竖版素材放进 `screens/` 或 `marketing/`（Logo 放 `logo/`），保存后刷新即可。"
                : "No images yet. Add portrait assets to `screens/` or `marketing/` (logo in `logo/`), then refresh."}
            </div>
          ) : (
            <div className="scrollbar-hide mt-8 flex gap-4 overflow-x-auto">
              {gallery.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[9/16] w-[min(92vw,340px)] shrink-0 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/30"
                >
                  <Image
                    src={src}
                    alt={copy.hero.name}
                    fill
                    sizes="(max-width: 768px) 92vw, 340px"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 md:mt-20">
          <Reveal>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              {copy.download.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {copy.download.body}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="rounded-3xl border border-white/[0.08] bg-card/40 p-6 backdrop-blur-xl">
                <p className="text-xs text-muted">{copy.download.appStore}</p>
                <p className="mt-3 font-display text-xl text-foreground">
                  {copy.download.comingSoon}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {language === "zh"
                    ? "上架后我会把按钮链接与二维码区域替换为真实内容。"
                    : "Store links + QR will replace this block after launch."}
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl border border-white/[0.08] bg-card/40 p-6 backdrop-blur-xl">
                <p className="text-xs text-muted">{copy.download.playStore}</p>
                <p className="mt-3 font-display text-xl text-foreground">
                  {copy.download.comingSoon}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {language === "zh"
                    ? "Google Play 版本也会同步更新到本页。"
                    : "Android listing will be updated here too."}
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl border border-white/[0.08] bg-card/40 p-6 backdrop-blur-xl">
                <p className="text-xs text-muted">QR</p>
                <div className="mt-4 grid h-40 place-items-center rounded-2xl border border-dashed border-white/[0.12] bg-background/20 text-sm text-muted">
                  QR placeholder
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

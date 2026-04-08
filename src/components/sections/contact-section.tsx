"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { useSiteLanguage } from "@/context/site-language";
import { useTheme } from "@/context/theme";
import { t } from "@/i18n/site-copy";
import { FadeInBlock, FadeInTitle } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

const channels = [
  {
    label: "Email",
    value: "lextellsyou@gmail.com",
    href: "mailto:lextellsyou@gmail.com",
    iconSrc: "/assets/contact/email.svg",
  },
  {
    label: "X",
    value: "@justraylex",
    href: "https://x.com/justraylex",
    iconSrc: "/assets/contact/x.svg",
  },
  {
    label: "GitHub",
    value: "https://github.com/nexsjournal",
    href: "https://github.com/nexsjournal",
    iconSrc: "/assets/contact/github.svg",
  },
  {
    label: "小红书",
    value: "十号日记",
    href: "https://www.xiaohongshu.com/user/profile/5dc92e8000000000010092a6",
    iconSrc: "/assets/contact/xhs.svg",
  },
];

export function ContactSection() {
  const { lang } = useSiteLanguage();
  const copy = t(lang);
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <FadeInTitle className="section-title">{copy.sections.contact}</FadeInTitle>
          <FadeInBlock delay={0.12} className="mx-auto mt-5 max-w-xl">
            <p
              className={cn(
                "text-sm leading-relaxed",
                isLight ? "text-slate-700/65" : "text-white/55",
              )}
            >
              {copy.sections.contactDesc}
            </p>
          </FadeInBlock>
        </div>

        <FadeInBlock delay={0.06} className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-[border-color,background-color,transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5",
                isLight
                  ? "border-slate-200/70 bg-white/70 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] hover:border-slate-200/90 hover:bg-white/85 hover:shadow-[0_0_18px_-6px_rgba(31,240,255,0.16)]"
                  : "border-[rgba(255,255,255,0.04)] bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.09)] hover:bg-white/[0.05] hover:shadow-[0_0_18px_-6px_rgba(31,240,255,0.14)]",
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    isLight ? "bg-slate-100/70 text-[#1FF0FF]" : "bg-white/[0.05] text-[#1FF0FF]",
                  )}
                >
                  <Image
                    src={channel.iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className={cn(
                      "h-5 w-5 object-contain",
                      isLight
                        ? ""
                        : "[filter:brightness(0)_saturate(100%)_invert(86%)_sepia(57%)_saturate(3205%)_hue-rotate(132deg)_brightness(104%)_contrast(102%)]",
                    )}
                  />
                </span>
                <div className="min-w-0 text-left">
                  <p
                    className={cn(
                      "text-xs font-medium uppercase tracking-wide",
                      isLight ? "text-slate-600/60" : "text-white/45",
                    )}
                  >
                    {channel.label}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 truncate text-sm font-medium",
                      isLight ? "text-slate-800/90" : "text-white/92",
                    )}
                  >
                    {channel.value}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200 group-hover:text-[#1FF0FF]",
                  isLight ? "text-slate-600/35" : "text-white/35",
                )}
              />
            </a>
          ))}
        </FadeInBlock>
      </div>
    </section>
  );
}

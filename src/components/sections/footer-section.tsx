"use client";

import Link from "next/link";

import { useTheme } from "@/context/theme";
import { FadeInBlock } from "@/components/ui/scroll-reveal";
import {
  ICP_BEIAN_URL,
  ICP_NUMBER,
  SITE_BRAND,
} from "@/lib/site-compliance";

export function FooterSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className="px-6 py-16 md:px-10 md:py-20">
      <FadeInBlock className="mx-auto w-full max-w-6xl">
        <div
          className={`border-t pt-10 ${
            isLight ? "border-slate-200/80" : "border-white/10"
          }`}
        >
          <div
            className={`grid gap-4 text-sm md:grid-cols-3 md:items-center ${
              isLight ? "text-slate-600/70" : "text-white/70"
            }`}
          >
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {SITE_BRAND}
            </p>
            <p className="text-center text-xs leading-relaxed md:text-sm">
              <Link
                href={ICP_BEIAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isLight
                    ? "text-slate-600 underline decoration-slate-400/60 underline-offset-2 hover:text-slate-900"
                    : "text-white/75 underline decoration-white/30 underline-offset-2 hover:text-white"
                }
              >
                {ICP_NUMBER}
              </Link>
            </p>
            <p className="text-center md:text-right">
              Crafted with motion, restraint and intent.
            </p>
          </div>
        </div>
      </FadeInBlock>
    </footer>
  );
}

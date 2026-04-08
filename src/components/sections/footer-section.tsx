"use client";

import { useTheme } from "@/context/theme";

export function FooterSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className="px-6 py-16 md:px-10 md:py-20">
      <div
        className={`mx-auto w-full max-w-6xl border-t pt-10 ${
          isLight ? "border-slate-200/80" : "border-white/10"
        }`}
      >
        <div
          className={`flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between ${
            isLight ? "text-slate-600/70" : "text-white/70"
          }`}
        >
          <p>© {new Date().getFullYear()} Lex Studio.</p>
          <p>Crafted with motion, restraint and intent.</p>
        </div>
      </div>
    </footer>
  );
}

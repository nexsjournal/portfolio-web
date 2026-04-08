"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { useTheme } from "@/context/theme";
import { cn } from "@/lib/utils";

type Props = {
  screenshots: string[];
};

export function ProductScreenshots({ screenshots }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(260, Math.floor(node.clientWidth * 0.7));
    node.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const items =
    screenshots.length > 0
      ? screenshots
      : Array.from({ length: 5 }, (_, i) => `placeholder-${i}`);

  return (
    <div className="group relative mt-6">
      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100",
          isLight
            ? "bg-white/85 border-slate-200/70 text-slate-700/80 hover:border-[#1FF0FF]/35 hover:text-[#1FF0FF]"
            : "bg-black/45 border-white/15 text-white/80 hover:border-[#1FF0FF]/35 hover:text-[#1FF0FF]",
        )}
        aria-label="向左滚动截图"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount("right")}
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100",
          isLight
            ? "bg-white/85 border-slate-200/70 text-slate-700/80 hover:border-[#1FF0FF]/35 hover:text-[#1FF0FF]"
            : "bg-black/45 border-white/15 text-white/80 hover:border-[#1FF0FF]/35 hover:text-[#1FF0FF]",
        )}
        aria-label="向右滚动截图"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
      >
        {items.map((src, i) =>
          screenshots.length > 0 ? (
            <div
              key={src}
                className={cn(
                  "relative h-[480px] min-w-[240px] shrink-0 overflow-hidden rounded-2xl",
                  isLight ? "bg-slate-100" : "bg-[#111827]",
                )}
            >
              <Image
                src={src}
                alt=""
                width={540}
                height={1150}
                className="h-full w-full object-cover object-top"
              />
            </div>
          ) : (
            <div
              key={`ph-${i}`}
                className={cn(
                  "h-[480px] min-w-[240px] rounded-2xl bg-[radial-gradient(circle_at_20%_30%,rgba(31,240,255,0.2),transparent_40%)]",
                  isLight ? "bg-slate-100" : "bg-[#111827]",
                )}
            />
          ),
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme";

type Props = {
  title: string;
  body: string;
  imageSrc?: string;
  icon?: React.ReactNode;
  /** 图标主色，用于半透明底色（与图标同色） */
  iconTint?: string;
};

export function WobbleCard({ title, body, imageSrc, icon, iconTint }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const tintPercent = isLight ? 30 : 22;

  return (
    <motion.article
      className={`
        group relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl p-6 md:min-h-[30rem]
        ${isLight ? "border border-[rgba(2,6,23,0.08)] bg-white/[0.62] shadow-[0_0_0_1px_rgba(2,6,23,0.06)]" : "border border-[rgba(255,255,255,0.04)] bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"}
        transition-[border-color,box-shadow] duration-300
        ${isLight ? "hover:border-[rgba(2,6,23,0.14)] hover:shadow-[0_0_22px_-8px_rgba(31,240,255,0.10)]" : "hover:border-[rgba(255,255,255,0.08)] hover:shadow-[0_0_22px_-8px_rgba(31,240,255,0.14)]"}
      `}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`
          absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-all duration-300
          ${isLight ? "bg-[#2B7CFF]/10 group-hover:bg-[#2B7CFF]/16" : "bg-[#1FF0FF]/16 group-hover:bg-[#BBFF2A]/22"}
        `}
      />

      {/* 内容在上 */}
      <div className="relative z-10 flex flex-1 flex-col pb-5">
        {icon ? (
          <div
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
            style={
              iconTint
                ? {
                    backgroundColor: `color-mix(in srgb, ${iconTint} ${tintPercent}%, transparent)`,
                  }
                : { backgroundColor: "rgba(0,0,0,0.35)" }
            }
          >
            {icon}
          </div>
        ) : null}
        <h3 className={isLight ? "text-xl font-semibold text-slate-900" : "text-xl font-semibold text-white"}>
          {title}
        </h3>
        <p className={isLight ? "mt-2 text-sm leading-7 text-slate-700/78" : "mt-2 text-sm leading-7 text-white/78"}>
          {body}
        </p>
      </div>

      {/* 图片在下：宽度与卡片一致，1:1，顶部蒙版与上方背景自然衔接 */}
      {imageSrc ? (
        <div className="relative -mx-6 -mb-6 mt-auto aspect-square w-[calc(100%+3rem)] shrink-0 overflow-hidden rounded-b-2xl">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-center"
            style={{
              // 透明蒙版：顶部渐隐，露出下方卡片背景，消除与正文之间的硬边
              maskImage: "linear-gradient(to bottom, transparent 0%, black 52%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 52%)",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              // 浅色下轻微调色：提升亮度/饱和度，让图片更“轻”更适配浅底
              // 让原本偏黑/深底的图片在浅色模式下呈现浅色观感
              filter: isLight
                ? "invert(1) hue-rotate(180deg) brightness(1.15) contrast(0.92) saturate(1.1)"
                : undefined,
            }}
          />
        </div>
      ) : null}
    </motion.article>
  );
}

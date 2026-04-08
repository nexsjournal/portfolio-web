"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title: string;
  body: string;
  imageSrc?: string;
  icon?: React.ReactNode;
  /** 图标主色，用于半透明底色（与图标同色） */
  iconTint?: string;
};

export function WobbleCard({ title, body, imageSrc, icon, iconTint }: Props) {
  return (
    <motion.article
      className="group relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)] bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(255,255,255,0.08)] hover:shadow-[0_0_22px_-8px_rgba(31,240,255,0.14)] md:min-h-[30rem]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#1FF0FF]/20 blur-2xl transition-all duration-300 group-hover:bg-[#1FF0FF]/30" />

      {/* 内容在上 */}
      <div className="relative z-10 flex flex-1 flex-col pb-5">
        {icon ? (
          <div
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
            style={
              iconTint
                ? { backgroundColor: `color-mix(in srgb, ${iconTint} 22%, transparent)` }
                : { backgroundColor: "rgba(0,0,0,0.35)" }
            }
          >
            {icon}
          </div>
        ) : null}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/78">{body}</p>
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
            }}
          />
        </div>
      ) : null}
    </motion.article>
  );
}

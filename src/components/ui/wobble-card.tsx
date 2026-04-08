"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  body: string;
};

export function WobbleCard({ title, body }: Props) {
  return (
    <motion.article
      className="group relative min-h-52 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)] bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(255,255,255,0.08)] hover:shadow-[0_0_22px_-8px_rgba(31,240,255,0.14)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#1FF0FF]/20 blur-2xl transition-all duration-300 group-hover:bg-[#1FF0FF]/30" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/78">{body}</p>
    </motion.article>
  );
}

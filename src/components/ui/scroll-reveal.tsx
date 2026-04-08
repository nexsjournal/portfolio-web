"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** 视口略放宽，避免「滚到了却不动」 */
const viewportSoft = {
  once: true as const,
  margin: "-8% 0px -18% 0px" as const,
  amount: 0 as const,
};

export function ScrollReveal({ children, className }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSoft}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** 板块标题：类似 Fade in by line — 位移 + 模糊渐入 */
export function FadeInTitle({ children, className }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <h2 className={className}>{children}</h2>;
  }

  return (
    <motion.h2
      className={className}
      initial={{ opacity: 0, y: 44, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewportSoft}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h2>
  );
}

/** 副标题 / 段落块：略晚于标题上浮 */
export function FadeInBlock({
  children,
  className,
  delay = 0.1,
}: Props & { delay?: number }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportSoft}
      transition={{
        duration: 0.58,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

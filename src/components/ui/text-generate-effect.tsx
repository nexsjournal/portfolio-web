"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "p" | "div" | "span";
  delayStep?: number;
  splitBy?: "char" | "word";
};

export function TextGenerateEffect({
  text,
  className,
  as = "h1",
  delayStep = 0.03,
  splitBy = "char",
}: Props) {
  const parts = useMemo(
    () => (splitBy === "word" ? text.split(/(\s+)/) : text.split("")),
    [splitBy, text],
  );
  const Tag = as;

  return (
    <Tag className={className} aria-label={text}>
      {parts.map((part, index) => (
        <motion.span
          key={`${part}-${index}`}
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.38,
            delay: index * delayStep,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {part}
        </motion.span>
      ))}
    </Tag>
  );
}

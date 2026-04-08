"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Card3D({ children, className }: Props) {
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  return (
    <div
      className={`relative rounded-2xl border border-white/15 bg-black/30 p-5 backdrop-blur-md ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d", transform }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 14;
        const rotateX = (0.5 - py) * 12;
        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      }}
      onMouseLeave={() => setTransform("rotateX(0deg) rotateY(0deg)")}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(31,240,255,0.16),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

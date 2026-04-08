"use client";

import React, { createContext, useContext, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CardContextValue = {
  rotateX: number;
  rotateY: number;
  setRotate: (x: number, y: number) => void;
  reset: () => void;
};

const CardContext = createContext<CardContextValue | null>(null);

export function CardContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const setRotate = (x: number, y: number) => {
    setRotateX(x);
    setRotateY(y);
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setRotateY((px - 0.5) * 26);
    setRotateX((0.5 - py) * 22);
  };

  return (
    <CardContext.Provider value={{ rotateX, rotateY, setRotate, reset }}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={cn(
          "flex items-center justify-center py-10 [perspective:1500px]",
          className,
        )}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(CardContext);
  if (!ctx) {
    throw new Error("CardBody must be used inside CardContainer");
  }

  return (
    <div
      className={cn(
        "relative [transform-style:preserve-3d] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      style={{
        transform: `rotateX(${ctx.rotateX}deg) rotateY(${ctx.rotateY}deg)`,
      }}
    >
      {children}
    </div>
  );
}

type CardItemProps<T extends React.ElementType = "div"> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "children" | "className" | "translateZ" | "style"
>;

export function CardItem<T extends React.ElementType = "div">({
  as,
  children,
  className,
  translateZ = 0,
  ...props
}: CardItemProps<T>) {
  const Component = as ?? "div";
  const z =
    typeof translateZ === "string" ? Number.parseFloat(translateZ) : translateZ;

  return (
    <Component
      className={cn(className)}
      style={{
        transform: `translate3d(0,0,${z}px)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      {...(props as object)}
    >
      {children}
    </Component>
  );
}

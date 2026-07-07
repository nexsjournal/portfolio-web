"use client";

import Image from "next/image";

type Props = {
  screenshots: string[];
};

export function ProductScreenshots({ screenshots }: Props) {
  const items = screenshots.slice(0, 5);

  return (
    <div className="detail-screenshot-exhibit">
      {items.map((src, index) => (
        <figure key={src} className={`detail-shot-card detail-shot-card-${index + 1}`}>
          <Image src={src} alt="" width={1284} height={2778} />
        </figure>
      ))}
    </div>
  );
}

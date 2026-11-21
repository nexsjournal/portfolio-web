import Image from "next/image";

import type { Product } from "@/content/products";

type Props = {
  product: Product;
  title: string;
};

export function ProductScreenshots({ product, title }: Props) {
  const screenshots = product.screenshots ?? [];
  const layout = product.screenshotLayout ?? "phone";
  const width = product.screenshotWidth ?? 1284;
  const height = product.screenshotHeight ?? 2778;

  return (
    <ul
      className={`portfolio-gallery portfolio-gallery--${layout}`}
      data-layout={layout}
      tabIndex={0}
      aria-labelledby="screenshots-title"
      aria-describedby="screenshots-hint"
    >
      {screenshots.map((src, index) => (
        <li key={src}>
          <Image
            src={src}
            alt={`${title} · ${index + 1}/${screenshots.length}`}
            width={width}
            height={height}
            sizes={layout === "desktop" ? "(max-width: 600px) 86vw, 680px" : "(max-width: 600px) 58vw, 210px"}
          />
        </li>
      ))}
    </ul>
  );
}

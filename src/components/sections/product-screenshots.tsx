import Image from "next/image";

type Props = {
  screenshots: string[];
  title: string;
};

export function ProductScreenshots({ screenshots, title }: Props) {
  return (
    <ul className="portfolio-gallery" tabIndex={0} aria-labelledby="screenshots-title" aria-describedby="screenshots-hint">
      {screenshots.map((src, index) => (
        <li key={src}>
          <Image src={src} alt={`${title} · ${index + 1}/${screenshots.length}`} width={1284} height={2778} sizes="(max-width: 600px) 58vw, 210px" />
        </li>
      ))}
    </ul>
  );
}

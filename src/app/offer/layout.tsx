import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "兑换码｜Lex Ray",
  robots: { index: false, follow: false },
};

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return children;
}

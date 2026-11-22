import type { Metadata } from "next";

import "./studio.css";

export const metadata: Metadata = {
  title: "内容发布｜Lex Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}

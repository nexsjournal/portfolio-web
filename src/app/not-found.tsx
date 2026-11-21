import type { Metadata } from "next";

import { NotFoundPage } from "@/components/sections/not-found-page";

export const metadata: Metadata = {
  title: "404 · 页面漂走了｜Lex Ray",
  description: "这个页面找不到。回到首页、浏览项目或看看笔记。",
};

export default function NotFound() {
  return <NotFoundPage />;
}

import { PortfolioHome } from "@/components/sections/portfolio-home";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  path: "/",
  title: "Lex Ray 阿雷｜独立开发者、产品经理、UI/UX 设计师",
  description: "Lex Ray（阿雷）的个人作品集。通过 Lex Studio 独立设计与开发 iOS 和 macOS 应用，这里有旅迹时光、归影 RePhoto、ARay Studio 等作品，以及我的产品设计方法与联系方式。",
});

export default function Home() {
  return <PortfolioHome />;
}

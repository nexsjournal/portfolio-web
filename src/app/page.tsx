import { PortfolioHome } from "@/components/sections/portfolio-home";
import { getDailyQuote } from "@/content/daily-quotes";
import { homeNotesFallback } from "@/content/home-notes";
import { toNoteSummary } from "@/content/notes";
import { getAllNotesWithRemote } from "@/content/remote-notes";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 60;

export const metadata = createPageMetadata({
  path: "/",
  title: "Lex Ray 阿雷｜独立开发者、产品经理、UI/UX 设计师",
  description: "Lex Ray（阿雷）的个人作品集。通过 Lex Studio 独立设计与开发 iOS 和 macOS 应用，这里有旅迹时光、归影 RePhoto、ARay Studio 等作品，以及我的产品设计方法与联系方式。",
});

export default async function Home() {
  const notes = await getAllNotesWithRemote();
  const featuredNotes = notes.length
    ? [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(toNoteSummary)
    : homeNotesFallback.slice(0, 3);

  return <PortfolioHome featuredNotes={featuredNotes} dailyQuote={getDailyQuote()} />;
}

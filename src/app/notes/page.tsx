import { NotesPage } from "@/components/sections/notes-page";
import { getAllNotes, toNoteSummary } from "@/content/notes";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  path: "/notes",
  title: "文章与记录｜Lex Ray",
  description: "Lex Ray 的文章、活动记录、知识库与零散想法。收录公众号文章、产品方法与独立开发过程中的观察。",
});

export default function Notes() {
  return <NotesPage notes={getAllNotes().map(toNoteSummary)} />;
}

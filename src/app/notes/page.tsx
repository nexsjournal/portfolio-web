import { NotesPage } from "@/components/sections/notes-page";
import { toNoteSummary } from "@/content/notes";
import { getAllNotesWithRemote } from "@/content/remote-notes";
import { createPageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  path: "/notes",
  title: "文章与记录｜Lex Ray",
  description: "Lex Ray 的文章、活动记录、知识库与零散想法。收录公众号文章、产品方法与独立开发过程中的观察。",
});

export default async function Notes() {
  const notes = await getAllNotesWithRemote();
  return <NotesPage notes={notes.map(toNoteSummary)} />;
}

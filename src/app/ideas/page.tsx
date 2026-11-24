import { IdeasPage } from "@/components/sections/portfolio-ideas";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  path: "/ideas",
  title: "奇思妙想｜Lex Studio",
  description: "Lex Ray 的小实验、随手作品和那些没法分类的点子。",
});

export default function Page() {
  return <IdeasPage />;
}

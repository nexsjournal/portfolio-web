import type { ComponentPropsWithoutRef } from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { NoteDetail } from "@/components/sections/note-detail";
import { getAllNotes, getNoteBySlug, toNoteSummary } from "@/content/notes";
import { createPageMetadata } from "@/lib/site-metadata";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};

  const metadata = createPageMetadata({
    path: `/notes/${note.slug}`,
    title: `${note.title}｜Lex Ray`,
    description: note.excerpt || note.title,
    ...(note.cover ? { image: { url: note.cover, alt: note.title } } : {}),
  });

  return {
    ...metadata,
    alternates: { canonical: note.canonical ?? `/notes/${note.slug}` },
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: note.date,
    },
  };
}

const mdxComponents = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const notes = getAllNotes();
  const index = notes.findIndex((item) => item.slug === note.slug);
  const previous = notes[index + 1];
  const next = notes[index - 1];

  return (
    <NoteDetail
      note={toNoteSummary(note)}
      previous={previous ? toNoteSummary(previous) : undefined}
      next={next ? toNoteSummary(next) : undefined}
    >
      <MDXRemote
        source={note.content}
        components={mdxComponents}
        options={{ mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
      />
    </NoteDetail>
  );
}

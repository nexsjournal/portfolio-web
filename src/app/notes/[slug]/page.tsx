import type { ComponentPropsWithoutRef } from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { NoteDetail } from "@/components/sections/note-detail";
import { toNoteSummary } from "@/content/notes";
import { getAllNotesWithRemote, getNoteWithRemoteBySlug } from "@/content/remote-notes";
import { createPageMetadata } from "@/lib/site-metadata";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteWithRemoteBySlug(slug);
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
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img {...props} referrerPolicy="no-referrer" loading="lazy" decoding="async" />
  ),
};

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteWithRemoteBySlug(slug);
  if (!note) notFound();

  const notes = await getAllNotesWithRemote();
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

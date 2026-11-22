import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export type NoteType = "article" | "video" | "event" | "note";

export type NoteSummary = {
  slug: string;
  title: string;
  date: string;
  publishedAt?: string;
  type: NoteType;
  tags: string[];
  excerpt: string;
  cover?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  lang: "zh" | "en";
  canonical?: string;
};

export type Note = NoteSummary & {
  content: string;
};

const notesDirectory = path.join(process.cwd(), "content/notes");

function readNoteFile(fileName: string): Note | null {
  const raw = fs.readFileSync(path.join(notesDirectory, fileName), "utf8");
  const { data, content } = matter(raw);

  if (data.draft === true) return null;
  if (typeof data.title !== "string" || typeof data.date !== "string") return null;

  const slug = fileName.replace(/\.(md|mdx)$/i, "");

  return {
    slug,
    title: data.title,
    date: data.date,
    type: data.type === "video" || data.type === "event" ? data.type : data.type === "note" ? "note" : "article",
    tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [],
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    cover: typeof data.cover === "string" ? data.cover : undefined,
    sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
    sourceLabel: typeof data.sourceLabel === "string" ? data.sourceLabel : undefined,
    lang: data.lang === "en" ? "en" : "zh",
    canonical: typeof data.canonical === "string" ? data.canonical : undefined,
    content,
  };
}

export function getAllNotes(): Note[] {
  if (!fs.existsSync(notesDirectory)) return [];

  return fs
    .readdirSync(notesDirectory)
    .filter((fileName) => /\.(md|mdx)$/i.test(fileName))
    .map(readNoteFile)
    .filter((note): note is Note => note !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getAllNotes().find((note) => note.slug === slug);
}

export function toNoteSummary(note: Note): NoteSummary {
  return {
    slug: note.slug,
    title: note.title,
    date: note.date,
    publishedAt: note.publishedAt,
    type: note.type,
    tags: note.tags,
    excerpt: note.excerpt,
    cover: note.cover,
    sourceUrl: note.sourceUrl,
    sourceLabel: note.sourceLabel,
    lang: note.lang,
    canonical: note.canonical,
  };
}

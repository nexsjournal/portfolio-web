import type { MetadataRoute } from "next";

import { caseStudies } from "@/content/case-studies";
import { getAllNotesWithRemote } from "@/content/remote-notes";
import { SITE_URL } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getAllNotesWithRemote();
  return ["/", "/projects", "/notes", ...caseStudies.map((study) => `/projects/${study.slug}`), ...notes.map((note) => `/notes/${note.slug}`)]
    .map((path) => ({ url: `${SITE_URL}${path}` }));
}

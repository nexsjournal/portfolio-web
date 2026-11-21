import type { MetadataRoute } from "next";

import { caseStudies } from "@/content/case-studies";
import { getAllNotes } from "@/content/notes";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/projects", "/notes", ...caseStudies.map((study) => `/projects/${study.slug}`), ...getAllNotes().map((note) => `/notes/${note.slug}`)]
    .map((path) => ({ url: `${SITE_URL}${path}` }));
}

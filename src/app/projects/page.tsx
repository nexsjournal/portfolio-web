import type { Metadata } from "next";

import { ProjectsPage } from "@/components/sections/projects-page";

export const metadata: Metadata = {
  title: "Projects · Lex Ray",
  description: "Products, experiments, and ideas from Lex Ray.",
};

export default function Projects() {
  return <ProjectsPage />;
}

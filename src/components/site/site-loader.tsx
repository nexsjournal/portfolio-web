"use client";

import { helix } from "ldrs";

if (typeof window !== "undefined") helix.register();

export function SiteLoader({ label }: { label: string }) {
  return (
    <div className="site-loader" role="status" aria-live="polite">
      <l-helix size="52" speed="2.2" color="var(--portfolio-accent)" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

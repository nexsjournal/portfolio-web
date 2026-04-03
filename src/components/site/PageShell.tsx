import type { ReactNode } from "react";

import { GridBackground } from "./GridBackground";
import { NoiseOverlay } from "./NoiseOverlay";
import { SiteHeader } from "./SiteHeader";
import { Spotlight } from "./Spotlight";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GridBackground />
        <Spotlight />
        <NoiseOverlay />
      </div>

      <SiteHeader />
      {children}
    </div>
  );
}

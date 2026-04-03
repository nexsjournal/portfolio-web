import type { Metadata } from "next";

import { JourneyTimePage } from "@/components/site/JourneyTimePage";
import { getJourneyTimeAssets } from "@/lib/journeyTimeAssets";

export const metadata: Metadata = {
  title: "旅迹时光 · Journey Time",
  description:
    "旅迹时光（Journey Time）产品详情页：旅行记录与路线回忆的工具型 App。",
  alternates: {
    canonical: "/apps/journey-time",
  },
};

export default async function Page() {
  const assets = await getJourneyTimeAssets();

  return (
    <JourneyTimePage
      logo={assets.logo}
      screens={assets.screens}
      marketing={assets.marketing}
    />
  );
}

import { HomePage } from "@/components/site/HomePage";
import { getJourneyTimeAssets } from "@/lib/journeyTimeAssets";

export default async function Home() {
  const assets = await getJourneyTimeAssets();

  return <HomePage journeyTimeLogo={assets.logo} />;
}

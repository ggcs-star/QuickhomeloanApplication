import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { RateTracker_INSIGHTS } from "./rateTrackerInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={RateTracker_INSIGHTS} />;
}
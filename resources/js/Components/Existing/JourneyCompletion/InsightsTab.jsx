import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { JourneyCompletion_INSIGHTS } from "./journeyInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={JourneyCompletion_INSIGHTS} />;
}
import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { HiddenCosts_INSIGHTS } from "./hiddenCostsInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={HiddenCosts_INSIGHTS} />;
}
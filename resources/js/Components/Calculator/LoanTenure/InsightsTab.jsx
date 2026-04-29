import InsightsLayout from "@/Components/Common/InsightsLayout";
import { TENURE_INSIGHTS } from "./tenureInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={TENURE_INSIGHTS} />;
}
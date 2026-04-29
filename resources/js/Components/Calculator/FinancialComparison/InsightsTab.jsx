import InsightsLayout from "@/Components/Common/InsightsLayout";
import { FINANCIAL_COMPARISON_INSIGHTS } from "./financialComparisonInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={FINANCIAL_COMPARISON_INSIGHTS} />;
}
import InsightsLayout from "@/Components/Common/InsightsLayout";
import { PROPERTY_INVESTMENT_INSIGHTS } from "./propertyInvestmentInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={PROPERTY_INVESTMENT_INSIGHTS} />;
}
import InsightsLayout from "@/Components/Common/InsightsLayout";
import { PREPAYMENT_INSIGHTS } from "./prepaymentInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={PREPAYMENT_INSIGHTS} />;
}
import InsightsLayout from "@/Components/Common/InsightsLayout";
import { LOAN_INSIGHTS } from "./LoanInsightsData";

export default function LoanEligibilityInsights() {
  return <InsightsLayout sections={LOAN_INSIGHTS} />;
}
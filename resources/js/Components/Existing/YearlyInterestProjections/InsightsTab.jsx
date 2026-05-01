import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { YearlyInterest_INSIGHTS } from "./yearlyInterestInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={YearlyInterest_INSIGHTS} />;
}
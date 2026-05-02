import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { RepaymentHealth_INSIGHTS } from "./repaymentHealthInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={RepaymentHealth_INSIGHTS} />;
}
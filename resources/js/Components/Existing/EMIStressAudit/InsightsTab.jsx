import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { EMIStress_INSIGHTS } from "./emiStressInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={EMIStress_INSIGHTS} />;
}
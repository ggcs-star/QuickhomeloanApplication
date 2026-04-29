import InsightsLayout from "@/Components/Common/InsightsLayout";
import { EMI_INSIGHTS } from "./emiInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={EMI_INSIGHTS} />;
}
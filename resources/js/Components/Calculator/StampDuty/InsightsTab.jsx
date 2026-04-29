import InsightsLayout from "@/Components/Common/InsightsLayout";
import { STAMP_DUTY_INSIGHTS } from "./stampDutyInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={STAMP_DUTY_INSIGHTS} />;
}
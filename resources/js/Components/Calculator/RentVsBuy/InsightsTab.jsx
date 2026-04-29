import InsightsLayout from "@/Components/Common/InsightsLayout";
import { RENT_VS_BUY_INSIGHTS } from "./rentVsBuyInsightsData";

export default function InsightsTab() {
  return <InsightsLayout sections={RENT_VS_BUY_INSIGHTS} />;
}
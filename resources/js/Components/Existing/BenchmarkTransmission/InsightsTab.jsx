import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { BenchmarkTransmission_INSIGHTS } from "./benchmarkInsightsData";

export default function InsightsTab() {
  return <ExistingInsightsLayout sections={BenchmarkTransmission_INSIGHTS} />;
}
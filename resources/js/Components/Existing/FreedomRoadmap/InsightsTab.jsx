import ExistingInsightsLayout from "@/Components/Common/ExistingInsightsLayout";
import { FreedomRoadmap_INSIGHTS } from "./freedomInsightsData";

export default function InsightsTab() {
    return <ExistingInsightsLayout sections={FreedomRoadmap_INSIGHTS} />;
}
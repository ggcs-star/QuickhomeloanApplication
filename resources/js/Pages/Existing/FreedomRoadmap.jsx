import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import FreedomCalculator from "@/Components/Existing/FreedomRoadmap/FreedomCalculator";
import InsightsTab from "@/Components/Existing/FreedomRoadmap/InsightsTab";
import LearnTab from "@/Components/Existing/FreedomRoadmap/LearnTab";

export default function FreedomRoadmap() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Freedom Roadmap & Milestone Audit"
        CalculateComponent={FreedomCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
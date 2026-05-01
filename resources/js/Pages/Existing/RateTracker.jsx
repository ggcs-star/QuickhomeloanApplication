import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import RateTrackerCalculator from "@/Components/Existing/RateTracker/RateTrackerCalculator";
import InsightsTab from "@/Components/Existing/RateTracker/InsightsTab";
import LearnTab from "@/Components/Existing/RateTracker/LearnTab";
export default function RateTracker() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Rate Change Tracker"
        CalculateComponent={RateTrackerCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
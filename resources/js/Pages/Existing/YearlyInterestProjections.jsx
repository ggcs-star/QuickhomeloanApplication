import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import YearlyInterestCalculator from "@/Components/Existing/YearlyInterestProjections/YearlyInterestCalculator";
import InsightsTab from "@/Components/Existing/YearlyInterestProjections/InsightsTab";
import LearnTab from "@/Components/Existing/YearlyInterestProjections/LearnTab";

export default function YearlyInterestProjections() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Yearly Interest Projections"
        CalculateComponent={YearlyInterestCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/FirstTimeLayout";
import InterestTruthCalculator from "@/Components/FirstTime/InterestTruth/InterestTruthCalculator";
import LearnTab from "@/Components/FirstTime/InterestTruth/LearnTab";
export default function InterestTruth() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Interest Truth Engine"
        CalculateComponent={InterestTruthCalculator}
        
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
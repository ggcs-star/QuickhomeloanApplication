import AppLayout from "@/Layouts/AppLayout";
import FirstTimeLayout from "@/Components/Common/FirstTimeLayout";
import TenureTrapCalculator from "@/Components/FirstTime/TenureTrapDetector/TenureTrapCalculator";
import LearnTab from "@/Components/FirstTime/TenureTrapDetector/LearnTab";

export default function TenureTrapDetector() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <FirstTimeLayout
        title="Tenure Trap Detector"
        CalculateComponent={TenureTrapCalculator}
    
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
import AppLayout from "@/Layouts/AppLayout";
import FirstTimeLayout from "@/Components/Common/FirstTimeLayout";
import SafetyEngineCalculator from "@/Components/FirstTime/SafetyEngine/SafetyEngineCalculator";
import LearnTab from "@/Components/FirstTime/SafetyEngine/LearnTab";
export default function SafetyEngine() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <FirstTimeLayout
        title="Safety Engine"
        CalculateComponent={SafetyEngineCalculator}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}


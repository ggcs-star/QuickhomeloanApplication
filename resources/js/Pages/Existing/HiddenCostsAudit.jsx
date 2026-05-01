import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import HiddenCostsCalculator from "@/Components/Existing/HiddenCostsAudit/HiddenCostsCalculator";
import InsightsTab from "@/Components/Existing/HiddenCostsAudit/InsightsTab";
import LearnTab from "@/Components/Existing/HiddenCostsAudit/LearnTab";
export default function HiddenCostsAudit() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Hidden Costs Audit"
        CalculateComponent={HiddenCostsCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import EMIRepaymentCalculator from "@/Components/Existing/EMIRepaymentHealth/EMIRepaymentCalculator";
import InsightsTab from "@/Components/Existing/EMIRepaymentHealth/InsightsTab";
import LearnTab from "@/Components/Existing/EMIRepaymentHealth/LearnTab";

export default function EMIRepaymentHealth() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="EMI Repayment Health"
        CalculateComponent={EMIRepaymentCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
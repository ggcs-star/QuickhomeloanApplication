import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import PrepaymentCalculator from "@/Components/Existing/PrepaymentForeclosure/PrepaymentCalculator";
import InsightsTab from "@/Components/Existing/PrepaymentForeclosure/InsightsTab";
import LearnTab from "@/Components/Existing/PrepaymentForeclosure/LearnTab";

export default function PrepaymentForeclosure() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Prepayment & Foreclosure Rights"
        CalculateComponent={PrepaymentCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
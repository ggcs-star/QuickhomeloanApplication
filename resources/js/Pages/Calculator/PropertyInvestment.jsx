import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import PropertyInvestmentCalculator from "@/Components/Calculator/PropertyInvestment/PropertyInvestmentCalculator";
import InsightsTab from "@/Components/Calculator/PropertyInvestment/InsightsTab";
import GuideTab from "@/Components/Calculator/PropertyInvestment/GuideTab";

export default function PropertyInvestment() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="Property Investment Calculator"
        CalculateComponent={PropertyInvestmentCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
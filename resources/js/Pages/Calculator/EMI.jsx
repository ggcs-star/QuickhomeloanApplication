import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import EmiCalculator from "@/Components/Calculator/EMI/EmiCalculator";
import InsightsTab from "@/Components/Calculator/EMI/InsightsTab";
import GuideTab from "@/Components/Calculator/EMI/GuideTab";

export default function EMI() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      
      <CalculatorLayout
        title="EMI Calculator"
        CalculateComponent={EmiCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />

    </AppLayout>
  );
}



import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import InterestRateCalculatorCard from "@/Components/Calculator/InterestRate/InterestRateCalculatorCard";
import InterestInsightsTab from "@/Components/Calculator/InterestRate/InterestInsightsTab";
import InterestGuideTab from "@/Components/Calculator/InterestRate/InterestGuideTab";

export default function InterestRate() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>

      <CalculatorLayout
        title="Interest Rate Calculator"
        CalculateComponent={InterestRateCalculatorCard}
        InsightsComponent={InterestInsightsTab}
        GuideComponent={InterestGuideTab}
      />

    </AppLayout>
  );
}
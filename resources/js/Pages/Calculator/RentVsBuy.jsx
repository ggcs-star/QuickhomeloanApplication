import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import RentVsBuyCalculator from "@/Components/Calculator/RentVsBuy/RentVsBuyCalculator";
import InsightsTab from "@/Components/Calculator/RentVsBuy/InsightsTab";
import GuideTab from "@/Components/Calculator/RentVsBuy/GuideTab";

export default function RentVsBuy() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="Rent vs Buy Calculator"
        CalculateComponent={RentVsBuyCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
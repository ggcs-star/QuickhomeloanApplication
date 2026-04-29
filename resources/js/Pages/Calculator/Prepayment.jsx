import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import PrepaymentCalculator from "@/Components/Calculator/Prepayment/PrepaymentCalculator";
import InsightsTab from "@/Components/Calculator/Prepayment/InsightsTab";
import GuideTab from "@/Components/Calculator/Prepayment/GuideTab";

export default function Prepayment() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="Loan Prepayment Calculator"
        CalculateComponent={PrepaymentCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
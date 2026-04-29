import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import TenureCalculator from "@/Components/Calculator/LoanTenure/TenureCalculator";
import InsightsTab from "@/Components/Calculator/LoanTenure/InsightsTab";
import GuideTab from "@/Components/Calculator/LoanTenure/GuideTab";

export default function LoanTenure() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="Loan Tenure Calculator"
        CalculateComponent={TenureCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import FinancialComparisonCalculator from "@/Components/Calculator/FinancialComparison/FinancialComparisonCalculator";
import InsightsTab from "@/Components/Calculator/FinancialComparison/InsightsTab";
import GuideTab from "@/Components/Calculator/FinancialComparison/GuideTab";

export default function FinancialComparison() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="RTM vs UC Financial Comparison"
        CalculateComponent={FinancialComparisonCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
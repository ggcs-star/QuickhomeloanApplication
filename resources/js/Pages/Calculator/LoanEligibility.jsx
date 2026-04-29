import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import LoanEligibilityCalculator from "@/Components/Calculator/LoanEligibility/LoanEligibilityCalculator";
import LoanInsightsTab from "@/Components/Calculator/LoanEligibility/LoanInsightsTab";
import LoanGuideTab from "@/Components/Calculator/LoanEligibility/LoanGuideTab";

export default function LoanEligibility() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      
      <CalculatorLayout
        title="Loan Eligibility"
        CalculateComponent={LoanEligibilityCalculator}
        InsightsComponent={LoanInsightsTab}
        GuideComponent={LoanGuideTab}
      />

    </AppLayout>
  );
}
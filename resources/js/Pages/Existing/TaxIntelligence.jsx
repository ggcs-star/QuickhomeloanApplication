import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import TaxIntelligenceCalculator from "@/Components/Existing/TaxIntelligence/TaxIntelligenceCalculator";
import InsightsTab from "@/Components/Existing/TaxIntelligence/InsightsTab";
import LearnTab from "@/Components/Existing/TaxIntelligence/LearnTab";

export default function TaxIntelligence() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Tax Intelligence & Certificates"
        CalculateComponent={TaxIntelligenceCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
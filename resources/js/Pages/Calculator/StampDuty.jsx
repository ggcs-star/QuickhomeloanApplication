import AppLayout from "@/Layouts/AppLayout";
import CalculatorLayout from "@/Components/Common/CalculatorLayout";

import StampDutyCalculator from "@/Components/Calculator/StampDuty/StampDutyCalculator";
import InsightsTab from "@/Components/Calculator/StampDuty/InsightsTab";
import GuideTab from "@/Components/Calculator/StampDuty/GuideTab";

export default function StampDuty() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <CalculatorLayout
        title="Stamp Duty & Registration Calculator"
        CalculateComponent={StampDutyCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={GuideTab}
      />
    </AppLayout>
  );
}
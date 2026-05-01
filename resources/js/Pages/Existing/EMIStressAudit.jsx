import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import EMIStressCalculator from "@/Components/Existing/EMIStressAudit/EMIStressCalculator";
import InsightsTab from "@/Components/Existing/EMIStressAudit/InsightsTab";
import LearnTab from "@/Components/Existing/EMIStressAudit/LearnTab";

export default function EMIStressAudit() {
    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <ExistingLayout
                title="EMI Stress Index Audit"
                CalculateComponent={EMIStressCalculator}
                InsightsComponent={InsightsTab}
                GuideComponent={LearnTab}
            />
        </AppLayout>
    );
}
import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import JourneyCompletionCalculator from "@/Components/Existing/JourneyCompletion/JourneyCompletionCalculator";
import InsightsTab from "@/Components/Existing/JourneyCompletion/InsightsTab";
import LearnTab from "@/Components/Existing/JourneyCompletion/LearnTab";
export default function JourneyCompletion() {
    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <ExistingLayout
                title="Journey Completion Audit"
                CalculateComponent={JourneyCompletionCalculator}
                InsightsComponent={InsightsTab}
                GuideComponent={LearnTab}
            />
        </AppLayout>
    );
}
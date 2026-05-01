import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import InterestReviewCalculator from "@/Components/Existing/InterestReview/InterestReviewCalculator";
import InsightsTab from "@/Components/Existing/InterestReview/InsightsTab";
import LearnTab from "@/Components/Existing/InterestReview/LearnTab";

export default function InterestReview() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      
      <ExistingLayout
        title="Interest Review Calculator"
        CalculateComponent={InterestReviewCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />

    </AppLayout>
  );
}



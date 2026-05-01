import AppLayout from "@/Layouts/AppLayout";
import ExistingLayout from "@/Components/Common/ExistingLayout";
import BenchmarkTransmissionCalculator from "@/Components/Existing/BenchmarkTransmission/BenchmarkTransmissionCalculator";
import InsightsTab from "@/Components/Existing/BenchmarkTransmission/InsightsTab";
import LearnTab from "@/Components/Existing/BenchmarkTransmission/LearnTab";
export default function BenchmarkTransmission() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <ExistingLayout
        title="Benchmark Transmission Audit"
        CalculateComponent={BenchmarkTransmissionCalculator}
        InsightsComponent={InsightsTab}
        GuideComponent={LearnTab}
      />
    </AppLayout>
  );
}
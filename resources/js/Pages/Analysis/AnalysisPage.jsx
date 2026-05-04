import AppLayout from "@/Layouts/AppLayout";
import AnalysisSection from "@/Components/AnalysisSection";

export default function AnalysisPage() {
  return (
    <AppLayout showTopNav={false} showBottomNav={true} showFooter={true}>
      <AnalysisSection />
    </AppLayout>
  );
}


import AppLayout from "../Layouts/AppLayout";
import Banner from "@/Components/Home/Banner";
import QuickActions from "@/Components/Home/QuickActions";
import TrendingNews from "@/Components/Home/TrendingNews";
import LendersSection from "@/Components/Home/LendersSection";
import ApplyNowBanner from "@/Components/Home/ApplyNowBanner";
export default function Home() {
  return (
    <AppLayout showTopNav={true}>
      <div className="space-y-10 py-10 ">
        <Banner />
        <QuickActions />
        <TrendingNews />
        <LendersSection />
        <ApplyNowBanner />
      </div>
    </AppLayout>
  );
}
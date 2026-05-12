import AppLayout from "../Layouts/AppLayout";
import Banner from "@/Components/Home/Banner";
import QuickActions from "@/Components/Home/QuickActions";
// import TrendingNews from "@/Components/Home/TrendingNews";
import LendersSection from "@/Components/Home/LendersSection";
import ApplyNowBanner from "@/Components/Home/ApplyNowBanner";
import QuickFeatures from "@/Components/Home/QuickFeatures";

const Divider = () => (
  <div className="px-4 py-3">
    <div className="h-[1px] bg-[#ECECEC] rounded-full" />
  </div>
);

export default function Home() {
  return (
    <AppLayout showTopNav={true}>
      <div className="pb-6 bg-[#f3f4f6] min-h-screen">

        {/* ================= BANNER ================= */}
        <div className="pt-1">
          <Banner />
        </div>

        {/* ================= QUICK FEATURES ================= */}
        <div className="mt-4">
          <QuickFeatures />
        </div>

        <Divider />

        {/* ================= QUICK ACTIONS ================= */}
        <div className="mt-1">
          <QuickActions />
        </div>

        {/* Trending News Removed */}

        <Divider />

        {/* ================= LENDERS ================= */}
        <div className="mt-1">
          <LendersSection />
        </div>

        <Divider />

        {/* ================= APPLY NOW ================= */}
        <div className="mt-1 px-4">
          <ApplyNowBanner />
        </div>

      </div>
    </AppLayout>
  );
}
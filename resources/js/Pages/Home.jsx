  import AppLayout from "../Layouts/AppLayout";
  import Banner from "@/Components/Home/Banner";
  import QuickActions from "@/Components/Home/QuickActions";
  import TrendingNews from "@/Components/Home/TrendingNews";
  import LendersSection from "@/Components/Home/LendersSection";
  import ApplyNowBanner from "@/Components/Home/ApplyNowBanner";
  import QuickFeatures from "@/Components/Home/QuickFeatures";

  const Divider = () => (
    <div className="px-4 py-2">
      <div className="h-[1px] bg-[#ECECEC] rounded-full" />
    </div>
  );

  export default function Home() {
    return (
      <AppLayout showTopNav={true}>
        <div className="pb-4">
          <Banner />

          <QuickFeatures />

          <Divider />

          <QuickActions />

          <Divider />

          <TrendingNews />

          <Divider />

          <LendersSection />

          <Divider />

          <ApplyNowBanner />
        </div>
      </AppLayout>
    );
  }
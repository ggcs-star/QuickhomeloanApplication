import AppLayout from "../Layouts/AppLayout";
import Banner from "@/Components/Home/Banner";
import QuickActions from "@/Components/Home/QuickActions";
export default function Home() {
  return (
    <AppLayout showTopNav={true}>
      <div className="space-y-16 py-10 ">


        <Banner />
        <QuickActions />
      </div>
    </AppLayout>
  );
}
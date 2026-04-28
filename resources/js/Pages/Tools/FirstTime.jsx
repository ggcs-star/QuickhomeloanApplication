import AppLayout from "@/Layouts/AppLayout";

export default function FirstTime() {
  return (
   <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <div className="p-4">
        <h1 className="text-xl font-bold">First Time Loan</h1>
      </div>
    </AppLayout>
  );
}
import { useAuth } from "@/Context/AuthContext";
import { useEffect } from "react";
import { usePage } from "@inertiajs/react"; 
import BottomNav from "../Components/BottomNav";
import TopNav from "../Components/TopNav";
import Footer from "../Components/Common/Footer";
import { Capacitor } from "@capacitor/core";


export default function AppLayout({
  children,
  showBottomNav = true,
  showTopNav = false,
  showFooter = true,
}) {
  const { user, isProUser, loading } = useAuth();
  const { url } = usePage(); 

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const timeoutId = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);
    
    return () => clearTimeout(timeoutId);
}, [url]);

useEffect(() => {

    if (
        window.AndroidBridge &&
        user
    ) {

        const alreadyRequested =
            localStorage.getItem(
                "push_permission_requested"
            );

        if (!alreadyRequested) {

            console.log(
                "📢 Requesting notification permission"
            );

            window.AndroidBridge
                .enablePushNotifications();

            localStorage.setItem(
                "push_permission_requested",
                "true"
            );
        }
    }

}, [user]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        {/* TopNav Skeleton */}
        <div className="px-4 py-3" style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-[48px] bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* BottomNav Skeleton */}
        {showBottomNav && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="flex justify-around py-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {showTopNav && <TopNav user={user} isProUser={isProUser} />}
      <div className={`${showBottomNav ? "pb-24" : ""}`}>
        {children}
        {showFooter && <Footer />}
      </div>
      {showBottomNav && <BottomNav isProUser={isProUser} />}
    </div>
  );
}
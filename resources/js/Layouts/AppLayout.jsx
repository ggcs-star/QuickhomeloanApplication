import { useAuth } from "@/Context/AuthContext";
import { useEffect } from "react";
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
      <div className="min-h-screen flex justify-center bg-gray-100">
        <div className="w-full max-w-sm min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700">Loading App...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">

      {showTopNav && <TopNav user={user} isProUser={isProUser} />}

      {/* 🔥 SAFE AREA + CONTENT */}
      <div className={`${showBottomNav ? "pb-24" : ""}`}>
        {children}
        {showFooter && <Footer />}
      </div>

      {showBottomNav && <BottomNav isProUser={isProUser} />}
    </div>
  );
}
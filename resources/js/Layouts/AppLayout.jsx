import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import BottomNav from "../Components/BottomNav";
import TopNav from "../Components/TopNav";
import { Capacitor } from "@capacitor/core";
import Footer from "../Components/Common/Footer";
export default function AppLayout({ children, showBottomNav = true, showTopNav = false, showFooter = true }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.visit("/login");
    } else {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const requestPermission = async () => {
      if (Capacitor.getPlatform() === "android") {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);
      }
    };

    requestPermission();
  }, []);

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
    <div className="min-h-screen bg-[#f3f4f6] relative min-h-screen flex flex-col safe-bottom safe-top">
      {showTopNav && <TopNav user={user} />}

      <div className={showBottomNav ? "pb-24" : ""}>
        {children}
        {showFooter && <Footer />}
      </div>


      {showBottomNav && <BottomNav />}
    </div>
  );
}
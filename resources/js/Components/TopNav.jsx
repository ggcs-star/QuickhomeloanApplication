import { useState } from "react";
import { Search, User } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { router } from "@inertiajs/react";

export default function TopNav({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-between gap-3 bg-[#f3f4f6]"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        {/* ================= 1. LOGO ================= */}
        <div
          className="w-11 h-11 shrink-0 cursor-pointer shadow-sm rounded-xl overflow-hidden"
          onClick={() => router.visit("/")}
        >
          {/* Apne logo ka path yahan dale */}
          <img
            src="/images/Logo.png"
            alt="App Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ================= 2. SEARCH BAR ================= */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[42px] pl-4 pr-10 rounded-full border border-gray-200 bg-white text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* ================= 3. USER PROFILE (Opens Sidebar) ================= */}
      <button
  onClick={() => router.visit("/profile")}
  className="w-11 h-11 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm transition active:scale-95 text-[#1e2330]"
>
  <User size={22} strokeWidth={1.5} />
</button>
      </div>

      {/* Sidebar Component */}
     
    </>
  );
}
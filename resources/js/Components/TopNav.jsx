import { useState } from "react";
import { Menu, Crown } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { router } from "@inertiajs/react";

export default function TopNav({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed top-4 left-0 w-full z-50 px-4 flex justify-between items-center"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
       
        <button
          onClick={() => setOpen(true)}
          className="p-2 transition"
        >
          <Menu size={22} />
        </button>

       
        <button
          onClick={() => router.visit("/subscription")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95"
          style={{
            backgroundColor: "#10B981",
            borderRadius: "5px", 
          }}
        >
          <Crown size={16} color="#FACC15" />
          Pro Active
        </button>
      </div>

      
      <Sidebar open={open} onClose={() => setOpen(false)} user={user} />
    </>
  );
}
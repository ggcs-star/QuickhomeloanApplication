import { router } from "@inertiajs/react";
import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Lock,
  HelpCircle,
} from "lucide-react";

export default function Sidebar({ open, onClose, user }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-100 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-5 py-6">

          <button onClick={onClose} className="mb-4">
            <ArrowLeft size={22} />
          </button>

          <div className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border mb-6">

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full border flex items-center justify-center font-semibold text-lg">
                {user?.full_name?.charAt(0) || "U"}
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  {user?.full_name || "User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.mobile_number || "-"}
                </p>
              </div>
            </div>

            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border mb-6">

            <p className="px-4 pt-4 text-xs text-gray-500 font-semibold">
              SETTINGS
            </p>

            <div
              onClick={() => router.visit("")}
              className="flex justify-between items-center px-4 py-4 border-t active:scale-95 transition"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-blue-500" />
                <span>Membership</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>

            <div
              className="flex justify-between items-center px-4 py-4 border-t active:scale-95 transition"
            >
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-blue-500" />
                <span>Change secure PIN</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>

            <div
              className="flex justify-between items-center px-4 py-4 border-t active:scale-95 transition"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-blue-500" />
                <span>Need help? Reach out</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>

          </div>

          <div
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.visit("/login");
            }}
            className="bg-white rounded-2xl shadow-sm border px-4 py-4 flex justify-between items-center text-red-500 active:scale-95 transition"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span>Logout</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>

        </div>
      </div>
    </>
  );
}
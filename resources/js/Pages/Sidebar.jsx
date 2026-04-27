import { router } from "@inertiajs/react";
import { X, User, Home, GraduationCap, LogOut } from "lucide-react";

export default function Sidebar({ open, onClose, user }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white z-50 shadow-xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <p className="font-semibold">{user?.full_name || "User"}</p>
            <p className="text-sm text-gray-500">
              {user?.mobile_number || "-"}
            </p>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-4">

          <div
            onClick={() => router.visit("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          <div
            onClick={() => router.visit("/education")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <GraduationCap size={18} />
            <span>Education</span>
          </div>

          <div
            onClick={() => router.visit("/profile")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <User size={18} />
            <span>Profile</span>
          </div>

          <div
            onClick={() => {
              localStorage.removeItem("token");
              router.visit("/login");
            }}
            className="flex items-center gap-3 cursor-pointer text-red-500"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>

        </div>
      </div>
    </>
  );
}
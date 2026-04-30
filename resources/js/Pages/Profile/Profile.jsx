import React from "react";
import { router } from "@inertiajs/react";
import { useAuth } from "@/Context/AuthContext"; 
import AppLayout from "@/Layouts/AppLayout";

import {
  ArrowLeft,
  Pencil,
  Briefcase,
  IdCard,
  Bookmark,
  Download,
  History,
  Mic,
  MessageSquare,
  Users,
  Star,
  Bell,
  PlayCircle,
  Moon,
  Shield,
  Info,
  HelpCircle,
  LogOut,
  ChevronRight,
  Lock,
} from "lucide-react";

function ProfileContent() {
  const { user, isProUser } = useAuth(); 

  return (
    <div className="bg-[#f9fafc] min-h-screen px-5 pt-6 pb-12 font-sans">

      {/* HEADER */}
      <div className="mb-6">
        <ArrowLeft
          className="w-6 h-6 text-gray-800 cursor-pointer active:scale-95"
          onClick={() => window.history.back()}
        />
      </div>

      {/* PROFILE INFO */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-20 h-20 mb-4">
            <div className="relative w-20 h-20 mb-4">
                    <img
                        src={user.avatar || "/images/default-avatar.jpg"}
                        alt={user.full_name}
                        className="w-full h-full rounded-full object-cover shadow-sm border border-gray-200"
                    />
                    {/* Edit Button */}
                    <button className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border-[2px] border-white shadow-sm active:scale-95 transition-transform">
                        <Pencil size={12} className="text-gray-700" />
                    </button>
                </div>

          <button className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border-2 border-white shadow-sm active:scale-95">
            <Pencil size={12} />
          </button>
        </div>

        <h2 className="text-[19px] font-bold text-gray-900">
          {user?.full_name || "User"}
        </h2>

        <p className="text-[15px] text-gray-600">
          {user?.email || user?.mobile_number}
        </p>

        <p className="text-[13px] text-gray-400 mt-1">
          Member Since {user?.created_at?.slice(0, 7) || "—"}
        </p>
      </div>

      {/* PLAN CARD */}
      <div className="bg-white rounded-2xl p-5 border mb-6">

        <div className="flex items-center gap-2 mb-4">
          <Briefcase size={16} className="text-gray-500" />
          <span className="text-xs text-gray-500 uppercase">
            {isProUser ? "Premium Plan" : "Free Plan"}
          </span>
        </div>

        <div className="text-center">
          {isProUser ? (
            <>
              <h3 className="text-green-600 font-semibold">
                ✅ You are a Premium Member
              </h3>
              <p className="text-sm text-gray-500">
                Enjoy all premium features
              </p>
            </>
          ) : (
            <>
              <h3 className="text-gray-900 font-semibold mb-4">
                Upgrade to unlock full access
              </h3>

              <button
                onClick={() => router.visit("/membership")}
                className="w-full bg-[#1e2330] text-white py-3.5 rounded-xl"
              >
                Upgrade to Premium
              </button>
            </>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <SectionCard title="Content">
        <ListItem icon={IdCard} label="Membership" />
        <ListItem icon={Bookmark} label="Saved Items" />
        <ListItem icon={Download} label="Downloads" hasLock />
        <ListItem icon={History} label="History" />
        <ListItem icon={Mic} label="Followed Shows" />
      </SectionCard>

      {/* COMMUNITY */}
      <SectionCard title="Community">
        <ListItem icon={MessageSquare} label="My Posts" rightText="1" />
        <ListItem icon={Users} label="My Comments" rightText="2" />
        <ListItem icon={Star} label="Saved Discussions" />
      </SectionCard>

      {/* SETTINGS */}
      <SectionCard title="Settings">
        <ListItem icon={Bell} label="Notifications" />
        <ListItem icon={PlayCircle} label="Playback Settings" />
        <ListItem icon={Moon} label="Appearance" rightText="System" />
        <ListItem icon={Shield} label="Privacy" />
        <ListItem icon={Info} label="About" />
        <ListItem icon={HelpCircle} label="Help & Support" />
      </SectionCard>

      {/* LOGOUT */}
      <div
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          router.visit("/login");
        }}
        className="bg-white rounded-2xl border px-4 py-4 flex justify-between text-red-500 active:scale-95"
      >
        <div className="flex items-center gap-3">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
        <ChevronRight size={18} />
      </div>

    </div>
  );
}

/* ================= WRAP WITH LAYOUT ================= */

export default function Profile() {
  return (
    <AppLayout showTopNav={false} showBottomNav={true}>
      <ProfileContent />
    </AppLayout>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl pt-5 pb-2 px-2 border mb-6">
      <h4 className="text-[13px] text-gray-500 uppercase px-3 mb-2">
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
}

function ListItem({ icon: Icon, label, rightText, hasLock }) {
  return (
    <div className="flex justify-between px-3 py-3.5 border-b last:border-0">
      <div className="flex items-center gap-3.5">
        <Icon size={20} className="text-blue-500" />
        <div className="flex items-center gap-2">
          <span className="text-[15px]">{label}</span>
          {hasLock && <Lock size={14} className="text-gray-400" />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {rightText && <span className="text-xs text-gray-400">{rightText}</span>}
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
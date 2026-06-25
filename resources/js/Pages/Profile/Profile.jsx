import React, { useEffect, useState } from "react";
import PageSkeleton from "@/components/Skeleton/PageSkeleton";
import { router } from "@inertiajs/react";
import { useAuth } from "@/Context/AuthContext";

import api from "@/api";
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
  Sparkles,
  Crown,
  CalendarDays
} from "lucide-react";

function ProfileContent() {

  const { user, isProUser } = useAuth();

  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
    fetchMyComments();
    fetchSavedCount();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/community/my-posts");
      setPostCount(res.data.data.data.length);
    } catch (error) {
      console.log("Posts Error", error);
    }
  };

  const fetchMyComments = async () => {
    try {
      const res = await api.get("/community/my-comments");
      setCommentCount(res.data.data.data.length);
    } catch (error) {
      console.log("Comments Error", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSavedCount = async () => {
    try {
        const res = await api.get("/community/saved");
        const savedPosts = res?.data?.data?.data || [];
        setSavedCount(savedPosts.length);
    } catch (error) {
        console.log("Saved Count Error", error);
    }
};

  if (loading) {
    return (
      <PageSkeleton>
        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-4"></div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-2xl p-5 mb-6 border">
            <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border mb-4">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSkeleton>
    );
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen px-5 pt-6 pb-12 font-sans">

      {/* HEADER */}
      <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
        </button>

      {/* PROFILE INFO */}
      <div className="flex flex-col items-center mb-8">

        <div className="relative w-20 h-20 mb-4">

          <img
            src={user.avatar || "/images/default-avatar.jpg"}
            alt={user.full_name}
            className="w-full h-full rounded-full object-cover shadow-sm border border-gray-200"
          />

          <button className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full border-[2px] border-white shadow-sm active:scale-95 transition-transform">
            <Pencil size={12} className="text-gray-700" />
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

      {/* PREMIUM CARD */}
      <div className={`rounded-2xl p-5 mb-6 border relative overflow-hidden
      ${isProUser
          ? 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border-yellow-300 shadow-lg'
          : 'bg-white border-gray-200'}`}>

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">
            <Briefcase
              size={16}
              className={isProUser
                ? "text-yellow-600"
                : "text-gray-500"}
            />

            <span className={`text-xs uppercase font-medium tracking-wide
            ${isProUser
                ? "text-yellow-700"
                : "text-gray-500"}`}>

              {isProUser ? "Premium Plan" : "Free Plan"}

            </span>
          </div>

          {isProUser && (
            <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-yellow-500 text-white font-semibold">
              <Crown size={12} />
              PRO
            </div>
          )}

        </div>

        <div className="text-center">

          {isProUser ? (
            <>
              <h3 className="text-yellow-700 font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                <Crown size={18} />
                Premium Active
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                You have full access to all premium features
              </p>

              <div className="bg-yellow-200/50 text-yellow-800 text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2">
                <Sparkles size={14} />
                Priority access enabled
              </div>
            </>
          ) : (
            <>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">
                Upgrade to Premium
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Unlock all features and boost your experience
              </p>

              <button
                onClick={() => router.visit("/membership")}
                className="w-full bg-gradient-to-r from-[#1e2330] to-[#2f3a52]
                text-white py-3.5 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2">

                <Crown size={18} />
                Upgrade Now

              </button>
            </>
          )}

        </div>

      </div>

      {/* CONTENT */}
      <SectionCard title="Content">
        <ListItem icon={IdCard} label="Membership" />
        <ListItem icon={Bookmark} label="Saved Items" />
        {/* <ListItem icon={Download} label="Downloads" hasLock /> */}
        <ListItem
  icon={History}
  label="History"
  onClick={() => router.visit("/payment-history")}
/>
        {/* <ListItem icon={Mic} label="Followed Shows" /> */}
      </SectionCard>

      {/* COMMUNITY */}
      <SectionCard title="Community">

        <ListItem
          icon={MessageSquare}
          label="My Posts"
          rightText={postCount}
          onClick={() => router.visit("/my-posts")}
        />

  <ListItem
  icon={Users}
  label="My Comments"
  rightText={commentCount}
  onClick={() => router.visit("/my-comments")}
/>

       <ListItem
    icon={Star}
    label="Saved Discussions"
    rightText={savedCount}
    onClick={() => router.visit("/saved-discussions")}
/>

      </SectionCard>

      {/* SETTINGS */}
      <SectionCard title="Settings">
            <ListItem
    icon={Bell}
    label="Notifications"
    onClick={() => router.visit("/notifications")}
/>
        <ListItem icon={CalendarDays} label="My Calendar" onClick={() => router.visit("/my-calendar")} />
 


<ListItem
    icon={Shield}
    label="Privacy"
    onClick={() => router.visit("/privacy-policy")}
/>

<ListItem
    icon={Info}
    label="About"
    onClick={() => router.visit("/about-us")}
/>

<ListItem
    icon={HelpCircle}
    label="Help & Support"
    onClick={() => router.visit("/help-support")}
/>
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
    <AppLayout showTopNav={false} showBottomNav={false}>
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

function ListItem({ icon: Icon, label, rightText, hasLock, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex justify-between px-3 py-3.5 border-b last:border-0 cursor-pointer active:scale-95"
    >
      <div className="flex items-center gap-3.5">

        <Icon
          size={20}
          className="text-blue-500"
        />

        <div className="flex items-center gap-2">

          <span className="text-[15px]">
            {label}
          </span>

          {hasLock && (
            <Lock
              size={14}
              className="text-gray-400"
            />
          )}

        </div>

      </div>

      <div className="flex items-center gap-2">

        {rightText && (
          <span className="text-xs text-gray-400">
            {rightText}
          </span>
        )}

        <ChevronRight size={18} />

      </div>

    </div>
  );
}
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";

import {
  TrendingUp,
  Calendar,
  Scale,
  AlertCircle,
  Wallet,
  Percent,
  CheckCircle,
  ArrowLeft,
  TrendingDown,
  FileText,
  HeartPulse,
  Map,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    title: "Rate Risk",
    desc: "Check EMI impact",
    icon: Percent,
    route: "/existing/InterestReview",
    bg: "from-[#2563EB] to-[#1D4ED8]",
  },
  {
    title: "Journey Completion",
    desc: "Track loan progress",
    icon: CheckCircle,
    route: "/existing/journeyCompletion",
    bg: "from-[#0F766E] to-[#115E59]",
  },
  {
    title: "Rate Tracker",
    desc: "Track rate changes",
    icon: TrendingUp,
    route: "/existing/rateTracker",
    bg: "from-[#7C3AED] to-[#6D28D9]",
  },
  {
    title: "Benchmark Transmission",
    desc: "Rate change audit",
    icon: Scale,
    route: "/existing/benchmark-transmission",
    bg: "from-[#EA580C] to-[#C2410C]",
  },
  {
    title: "Hidden Costs Audit",
    desc: "Find extra charges",
    icon: Wallet,
    route: "/existing/hidden-costs-audit",
    bg: "from-[#DC2626] to-[#B91C1C]",
  },
  {
    title: "EMI Stress Audit",
    desc: "Check EMI burden",
    icon: AlertCircle,
    route: "/existing/emi-stress-audit",
    bg: "from-[#0891B2] to-[#0E7490]",
  },
  {
    title: "Yearly Interest",
    desc: "View yearly interest",
    icon: Calendar,
    route: "/existing/yearly-interest-projections",
    bg: "from-[#4F46E5] to-[#4338CA]",
  },
  {
    title: "Prepayment",
    desc: "Check savings",
    icon: TrendingDown,
    route: "/existing/prepayment-foreclosure",
    bg: "from-[#DB2777] to-[#BE185D]",
  },
  {
    title: "Tax Intelligence",
    desc: "View tax benefits",
    icon: FileText,
    route: "/existing/tax-intelligence",
    bg: "from-[#0284C7] to-[#0369A1]",
  },
  {
    title: "EMI Health",
    desc: "Check repayment health",
    icon: HeartPulse,
    route: "/existing/emi-repayment-health",
    bg: "from-[#15803D] to-[#166534]",
  },
  {
    title: "Freedom Roadmap",
    desc: "Debt-free planning",
    icon: Map,
    route: "/existing/freedom-roadmap",
    bg: "from-[#9333EA] to-[#7E22CE]",
  },
];

export default function ExistingPage() {
  return (
    <AppLayout
      showTopNav={false}
      showBottomNav={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-[#f5f7fd] pb-24">

        {/* HEADER */}
        <div className="px-4 pt-5">

          <div className="flex items-center gap-3">

            <button
              onClick={() => window.history.back()}
              className="
                w-10 h-10 rounded-full
                bg-white
                border border-[#edf1f7]
                flex items-center justify-center
                shadow-sm
              "
            >
              <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
            </button>

            <div>

              <h1 className="
                text-[24px]
                font-black
                tracking-[-0.5px]
                text-[#081c4b]
                leading-tight
              ">

                Existing Loan

              </h1>

              <p className="text-[12px] text-gray-500 mt-[2px]">
                Manage and optimize your current loan
              </p>

            </div>

          </div>

        </div>

        {/* HERO */}
        <div className="px-4 mt-4">

          <div className="
            relative overflow-hidden
            rounded-[22px]
            bg-gradient-to-r
            from-[#001B5E]
            to-[#0038b8]
            px-5 py-5
            text-white
          ">

            <div className="relative z-10 max-w-[70%]">

              <p className="text-[11px] opacity-90 font-medium">
                Existing Loan Management
              </p>

              <h2 className="
                text-[28px]
                leading-[30px]
                font-black
                mt-2
                tracking-[-1px]
              ">

                Track & Improve Loan Health

              </h2>

              <p className="
                text-[12px]
                opacity-90
                mt-2
                leading-5
              ">
                Analyze EMI stress, hidden charges and optimize repayments.
              </p>

            </div>

            <img
              src="/images/house.png"
              alt="house"
              className="
                absolute right-0 bottom-0
                h-[120px]
                object-contain
              "
            />

          </div>

        </div>

        {/* GRID */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">

          {items.map((item, i) => {

            const Icon = item.icon;

            return (
              <button
                key={i}
                onClick={() =>
                  item.route && router.visit(item.route)
                }
                className="
                  relative overflow-hidden
                  rounded-[20px]
                  bg-white
                  border border-[#edf1f7]
                  p-4
                  text-left
                  shadow-sm
                  active:scale-[0.98]
                  transition-all
                "
              >

                {/* TOP ICON */}
                <div className={`
                  w-14 h-14 rounded-[16px]
                  bg-gradient-to-br
                  ${item.bg}
                  flex items-center justify-center
                  shadow-md
                `}>

                  <Icon
                    className="w-7 h-7 text-white"
                    strokeWidth={2.2}
                  />

                </div>

                {/* CONTENT */}
                <div className="mt-4">

                  <h3 className="
                    text-[15px]
                    leading-[20px]
                    font-bold
                    text-[#081c4b]
                  ">

                    {item.title}

                  </h3>

                  <p className="
                    text-[11px]
                    leading-[17px]
                    text-gray-500
                    mt-1
                  ">

                    {item.desc}

                  </p>

                </div>

                {/* BOTTOM */}
                <div className="
                  mt-4
                  flex items-center justify-between
                ">

                  <span className="
                    text-[11px]
                    font-semibold
                    text-[#2563eb]
                  ">
                    Explore
                  </span>

                  <div className="
                    w-7 h-7 rounded-full
                    bg-[#f5f7fd]
                    flex items-center justify-center
                  ">

                    <ChevronRight className="w-4 h-4 text-[#081c4b]" />

                  </div>

                </div>

                {/* BG DECOR */}
                <div className={`
                  absolute -right-8 -top-8
                  w-24 h-24 rounded-full
                  opacity-[0.06]
                  bg-gradient-to-br
                  ${item.bg}
                `} />

              </button>
            );
          })}

        </div>

      </div>
    </AppLayout>
  );
}
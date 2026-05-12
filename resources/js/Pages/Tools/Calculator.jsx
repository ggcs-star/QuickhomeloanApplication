import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";

import {
  Calculator,
  BadgeCheck,
  Wallet,
  Percent,
  CalendarDays,
  PieChart,
  Scale,
  Stamp,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    title: "EMI",
    desc: "Calculate monthly EMI",
    icon: Calculator,
    route: "/calculator/emi",
    bg: "from-[#2563EB] to-[#1D4ED8]",
  },
  {
    title: "Loan Eligibility",
    desc: "Check loan eligibility",
    icon: BadgeCheck,
    route: "/calculator/loan-eligibility",
    bg: "from-[#0F766E] to-[#115E59]",
  },
  {
    title: "Interest Rate",
    desc: "Compare interest rates",
    icon: Percent,
    route: "/calculator/interest-rate",
    bg: "from-[#7C3AED] to-[#6D28D9]",
  },
  {
    title: "Loan Tenure",
    desc: "Adjust loan duration",
    icon: CalendarDays,
    route: "/calculator/LoanTenure",
    bg: "from-[#EA580C] to-[#C2410C]",
  },
  {
    title: "Prepayment Impact",
    desc: "Reduce loan cost",
    icon: PieChart,
    route: "/calculator/Prepayment",
    bg: "from-[#DC2626] to-[#B91C1C]",
  },
  {
    title: "Rent vs Buy",
    desc: "Rent vs Buy analysis",
    icon: Scale,
    route: "/calculator/RentVsBuy",
    bg: "from-[#0891B2] to-[#0E7490]",
  },
  {
    title: "Property Investment vs EMI",
    desc: "Investment comparison",
    icon: Stamp,
    route: "/calculator/PropertyInvestment",
    bg: "from-[#4F46E5] to-[#4338CA]",
  },
  {
    title: "UC vs RTM",
    desc: "Under Construction vs Ready",
    icon: Wallet,
    route: "/calculator/FinancialComparison",
    bg: "from-[#DB2777] to-[#BE185D]",
  },
  {
    title: "Stamp Duty",
    desc: "Registration & charges",
    icon: Stamp,
    route: "/calculator/StampDuty",
    bg: "from-[#15803D] to-[#166534]",
  },
];

export default function CalculatorPage() {
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

                Loan Calculators

              </h1>

              <p className="text-[12px] text-gray-500 mt-[2px]">
                Smart tools for better loan planning
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
                Financial Planning Tools
              </p>

              <h2 className="
                text-[28px]
                leading-[30px]
                font-black
                mt-2
                tracking-[-1px]
              ">

                Calculate Before You Apply

              </h2>

              <p className="
                text-[12px]
                opacity-90
                mt-2
                leading-5
              ">
                EMI, eligibility, investment and loan comparison tools.
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

          {items.map((item, index) => {

            const Icon = item.icon;

            return (
              <button
                key={index}
                onClick={() =>
                  item.route &&
                  router.visit(item.route)
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
                    Open Tool
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
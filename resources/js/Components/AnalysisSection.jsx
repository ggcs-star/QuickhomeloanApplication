import {
  FileSearch,
  ShieldCheck,
  LineChart,
  ChevronRight,
  CreditCard,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import { router } from "@inertiajs/react";

export default function AnalysisSection({
  activeLoan = {
    outstanding: 250000,
    total: 350000,
    nextEmiDate: "12 May, 2026",
    emiAmount: 8540,
    image: "/images/analysis-house.png",
  },

  cards = [
    {
      title: "Statement Analyzer",
      desc: "Analyze statements",
      icon: FileSearch,
      route: "/analysis/statement-analyzer",
    },
    {
      title: "Rate Change Risk",
      desc: "Interest risk alert",
      icon: ShieldCheck,
      route: "/analysis/rate-change-risk",
    },
    {
      title: "Rate Change Tracker",
      desc: "Track rate changes",
      icon: LineChart,
      route: "/analysis/rate-change-tracker",
    },
  ],
}) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] px-5 pt-7 pb-28">

      {/* TITLE */}
      <h1 className="text-[24px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">
        Analysis
      </h1>

      {/* ACTIVE LOAN CARD */}
      <div
        className="
          bg-[#EEF3FB]
          border border-[#E2E8F3]
          rounded-[26px]
          px-5 pt-5 pb-4
          shadow-[0_2px_6px_rgba(15,23,42,0.04)]
          mb-7
        "
      >

        {/* HEADER */}
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex-1">

            {/* TOP */}
            <div className="flex items-center gap-3 mb-8">

              <div className="w-8 h-8 flex items-center justify-center">
                <CreditCard
                  size={23}
                  strokeWidth={2.2}
                  className="text-[#2F67F6]"
                />
              </div>

              <h2 className="text-[18px] font-semibold text-[#111827] tracking-[-0.2px]">
                Active Loan
              </h2>
            </div>

            {/* LABEL */}
            <p className="text-[14px] text-[#7B8190] mb-2 font-medium">
              Outstanding Amount
            </p>

            {/* AMOUNT */}
            <h3 className="text-[30px] leading-none font-bold text-[#111827] tracking-[-1px]">
              ₹ {formatCurrency(activeLoan.outstanding)}
            </h3>

            {/* TOTAL */}
            <div
              className="
                inline-flex items-center
                h-[36px]
                px-4
                rounded-full
                bg-white
                mt-5
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
              "
            >
              <span className="text-[14px] font-medium text-[#2F67F6]">
                of ₹ {formatCurrency(activeLoan.total)}
              </span>
            </div>
          </div>

          {/* IMAGE */}
          <img
            src={activeLoan.image}
            alt="loan"
            className="
              w-[150px]
              object-contain
              mt-8
              -mr-1
              mix-blend-multiply
            "
          />
        </div>

        {/* DIVIDER */}
        <div className="h-[1px] bg-[#D8DFEB] my-5" />

        {/* BOTTOM */}
        <div className="grid grid-cols-2">

          {/* NEXT EMI */}
          <div className="flex items-start gap-3">

            <CalendarDays
              size={22}
              strokeWidth={2.1}
              className="text-[#2F67F6] mt-[2px]"
            />

            <div>
              <p className="text-[14px] text-[#7B8190] leading-none mb-2">
                Next EMI
              </p>

              <h4 className="text-[16px] font-bold text-[#111827] leading-none tracking-[-0.2px]">
                {activeLoan.nextEmiDate}
              </h4>
            </div>
          </div>

          {/* EMI */}
          <div className="flex items-start gap-3">

            <IndianRupee
              size={22}
              strokeWidth={2.4}
              className="text-[#2F67F6] mt-[2px]"
            />

            <div>
              <p className="text-[14px] text-[#7B8190] leading-none mb-2">
                EMI Amount
              </p>

              <h4 className="text-[16px] font-bold text-[#111827] leading-[20px] tracking-[-0.2px]">
                ₹ {formatCurrency(activeLoan.emiAmount)} / month
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="space-y-4">

        {cards.map((item, i) => {

          const Icon = item.icon;

          return (
            <div
              key={i}
              onClick={() => router.visit(item.route)}
              className="
                bg-white
                border border-[#E8ECF3]
                rounded-[24px]
                px-4 py-4
                flex items-center justify-between
                shadow-[0_2px_6px_rgba(15,23,42,0.04)]
                active:scale-[0.99]
                transition-all
                cursor-pointer
              "
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* ICON */}
                <div
                  className="
                    w-[56px]
                    h-[56px]
                    rounded-[18px]
                    bg-[#FAFBFF]
                    border border-[#EDF1F7]
                    flex items-center justify-center
                  "
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    className="text-[#4B82F1]"
                  />
                </div>

                {/* TEXT */}
                <div>

                  <h3 className="text-[17px] font-semibold text-[#111827] tracking-[-0.2px]">
                    {item.title}
                  </h3>

                  <p className="text-[14px] text-[#7B8190] mt-1">
                    {item.desc}
                  </p>

                </div>
              </div>

              {/* RIGHT */}
              <ChevronRight
                size={23}
                strokeWidth={2.4}
                className="text-[#111827]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
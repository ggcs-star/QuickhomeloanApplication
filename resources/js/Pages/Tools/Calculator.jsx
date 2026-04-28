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
} from "lucide-react";

const items = [
  {
    title: "EMI",
    desc: "Calculate monthly EMI",
    icon: Calculator,
    route: "/calculator/emi",
  },
  {
    title: "Loan Eligibility",
    desc: "Check loan eligibility",
    icon: BadgeCheck,
    route: "/calculator/loan-eligibility"
  },
  {
    title: "Loan Amount",
    desc: "Find loan amount",
    icon: Wallet,
  },
  {
    title: "Interest Rate",
    desc: "Compare interest rates",
    icon: Percent,
     route: "/calculator/interest-rate"
  },
  {
    title: "Loan Tenure",
    desc: "Adjust loan duration",
    icon: CalendarDays,
  },
  {
    title: "Prepayment Impact",
    desc: "Reduce loan cost",
    icon: PieChart,
  },
  {
    title: "Comparison",
    desc: "Compare loan options",
    icon: Scale,
  },
  {
    title: "Stamp Duty",
    desc: "Estimate stamp charges",
    icon: Stamp,
  },
];

export default function CalculatorPage() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <div className="px-4 py-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft
            className="text-gray-700 cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Calculator
          </h1>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">

          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
              onClick={() => item.route && router.visit(item.route)}
                key={i}
                className="
                bg-white
                rounded-2xl
                p-4
                border border-gray-200
                shadow-[0_2px_6px_rgba(0,0,0,0.06)]
                active:scale-95 transition
                cursor-pointer
                "
              >

                {/* ICON */}
                <div className="w-12 h-12 mb-3 rounded-xl bg-[#eef1f4] flex items-center justify-center shadow-inner">
                  <Icon className="text-blue-500" size={22} />
                </div>

                {/* TITLE */}
                <h3 className="text-[15px] font-semibold text-gray-800">
                  {item.title}
                </h3>

                {/* DESC */}
                <p className="text-sm text-gray-500 mt-1 leading-snug">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>
      </div>
    </AppLayout>
  );
}
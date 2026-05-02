import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import {
  TrendingUp,
  Calendar,
  Scale,
  AlertCircle,
  Wallet,
  Percent,
  Settings,
  CheckCircle,
  ArrowLeft,
  TrendingDown,
  FileText,
  HeartPulse,
  Map
} from "lucide-react";

const items = [
  {
    title: "Safety Engine",
    desc: "Monitor rate change impact",
    icon: Percent,
    route: "/first-time/safety-engine",
  },
  {
    title: "Interest Truth",
    desc: "Understand your interest rates",
    icon: CheckCircle,
    route: "/first-time/interest-truth",
  },
  {
    title: "Rate Shock Simulator",
    desc: "Simulate the impact of rate changes",
    icon: TrendingUp,
    route: "/first-time/rate-shock-simulator",
  },
  {
    title: "Tenure Trap Detector",
    desc: "Identify potential tenure traps",
    icon: AlertCircle,
    route: "/first-time/tenure-trap-detector",
  },
  {
    title: "Offer Truth Decoder",
    desc: "Decode offer truths",
    icon: FileText,
    route: "/first-time/offer-decoder",
  }

];

export default function FirstTime() {
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
            First Time
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
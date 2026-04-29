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
} from "lucide-react";

const items = [
    {
        title: "Rate Risk",
        desc: "Calculate monthly EMI",
        icon: TrendingUp,
        route: "/existing/InterestReview",
    },
    {
        title: "Tenure Track",
        desc: "Check loan eligibility",
        icon: Calendar,
    },
    {
        title: "Rate Compare",
        desc: "Find loan amount",
        icon: Scale,
    },
    {
        title: "Penalty Check",
        desc: "Compare interest rates",
        icon: AlertCircle,
    },
    {
        title: "Affordability",
        desc: "Adjust loan duration",
        icon: Wallet,
    },
    {
        title: "Interest Review",
        desc: "Reduce loan cost",
        icon: Percent,
    },
    {
        title: "Prepay Savings",
        desc: "Compare loan options",
        icon: Settings,
    },
    {
        title: "Benefits Check",
        desc: "Estimate stamp charges",
        icon: CheckCircle,
    },

];

export default function ExistingPage() {
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
                        Existing
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
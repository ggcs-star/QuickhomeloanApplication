import AppLayout from "../Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { Sparkles, Layers, Calculator, Calendar, ArrowRight } from "lucide-react";

const tools = [
    {
        title: "First Time",
        desc: "Start Loan Journey",
        icon: Sparkles,
    },
    {
        title: "Existing",
        desc: "Manage Loan Smartly",
        icon: Layers,
    },
    {
        title: "Calculator",
        desc: "Calculate EMI Easily",
        icon: Calculator,
    },
    {
        title: "calendar",
        desc: "Track Loan Dates",
        icon: Calendar,
    },
];

export default function Tools() {
    return (
        <AppLayout showTopNav={false} showBottomNav={true}>
            <div className="px-4 py-5">

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Tools
                </h1>

                {/* List */}
                <div className="space-y-5">

                    {tools.map((item, i) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={i}
                                onClick={() => router.visit(`/tools/${item.title.toLowerCase().replace(" ", "-")}`)}
                                className="
                bg-white
                rounded-2xl 
                p-4 
                flex items-center justify-between
                border border-gray-200
                shadow-[0_2px_6px_rgba(0,0,0,0.06)]
                active:scale-[0.98] transition
                cursor-pointer
                "
                            >

                                {/* LEFT */}
                                <div className="flex items-center gap-4">

                                    {/* ICON BOX */}
                                    <div
                                        className="
                    w-12 h-12 
                    rounded-xl 
                    bg-[#eef1f4] 
                    flex items-center justify-center
                    shadow-inner
                    "
                                    >
                                        <Icon className="text-blue-500" size={22} />
                                    </div>

                                    {/* TEXT */}
                                    <div>
                                        <h3 className="text-[17px] font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-[2px]">
                                            {item.desc}
                                        </p>
                                    </div>

                                </div>

                                {/* RIGHT ARROW */}
                                <ArrowRight className="text-gray-400" size={22} />

                            </div>
                        );
                    })}

                </div>
            </div>
        </AppLayout>
    );
}
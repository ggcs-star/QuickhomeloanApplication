import { Lock } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ProUpgradeBanner({
    title = "Unlock Full Access",
    description = "Upgrade to Pro to access all premium features.",
    buttonText = "Upgrade to Pro",
    className = ""
}) {
    return (
        <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200 ${className}`}>
            <div className="flex items-start gap-3">
                
                {/* Icon */}
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock size={18} className="text-indigo-600" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-indigo-900 mb-1">
                        {title}
                    </h4>

                    <p className="text-xs text-indigo-800 mb-3">
                        {description}
                    </p>

                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                        onClick={() => router.visit("/membership")}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
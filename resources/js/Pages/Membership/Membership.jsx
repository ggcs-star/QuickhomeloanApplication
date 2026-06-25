import { ArrowLeft, BadgeCheck } from "lucide-react";
import RazorpaySubscribeButton from "@/Components/Common/RazorpaySubscribeButton";
import { useAuth } from "@/Context/AuthContext";
export default function Membership() {
    const benefits = [
        "All Audio Lessons",
        "Video Masterclasses",
        "Downloadable Resources",
        "Priority Support",
        "Certificate of Completion",
        "Exclusive Webinars",
    ];
    const { isProUser } = useAuth();
    return (
        <div className="bg-gray-100 min-h-screen px-4 py-5 pb-24">

            {/* ================= HEADER ================= */}
            <div className="flex items-center gap-3 mb-5">
                <button
                    onClick={() => window.history.back()}
                    className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
                </button>
            </div>

            {/* ================= HERO CARD ================= */}
            <div className="rounded-3xl mb-6 relative overflow-hidden h-56">

                {/* IMAGE */}
                <img
                    src="/images/Membership.png"
                    alt="membership"
                    className="w-full h-full object-cover"
                />

                {/* TEXT OVER IMAGE */}
                <div className="absolute top-4 left-4">
                    <span className="text-blue-600 bg-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                        Become a Member
                    </span>

                    <h2 className="text-3xl font-bold mt-3 text-black">
                        {isProUser ? "Premium Active" : "₹ 999"}
                        {!isProUser && (
                            <span className="text-lg font-medium text-gray-700"> / year</span>
                        )}
                    </h2>
                </div>

            </div>

            {/* ================= BENEFITS ================= */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 mb-6">

                <div className="flex items-center gap-2 mb-4">
                    <BadgeCheck className="text-gray-600" size={18} />
                    <h3 className="font-semibold text-gray-800">
                        Membership Benefits
                    </h3>
                </div>

                <div className="space-y-3">
                    {benefits.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-green-500 text-lg">✔</span>
                            <p className="text-gray-700 text-sm">{item}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= CTA ================= */}
            <div className="fixed bottom-4 left-4 right-4">
                {isProUser ? (
                    <div className="bg-green-100 text-green-700 py-4 rounded-xl text-center font-semibold border border-green-300">
                        You are already a Pro Member
                    </div>
                ) : (
                    <RazorpaySubscribeButton />
                )}
            </div>

        </div>
    );
}
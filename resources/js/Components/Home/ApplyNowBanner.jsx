import { router } from "@inertiajs/react";

export default function ApplyNowBanner() {
    return (
        <section className="px-4">
            <div
                className="
          relative rounded-3xl overflow-hidden
          bg-gradient-to-r from-blue-100 to-blue-200
          h-[220px] sm:h-[260px]   /* fixed height for proper centering */
        "
            >
                {/* BACKGROUND IMAGE */}
                <img
                    src="/images/Home/Apply_Now.png"
                    alt="Apply Now"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />

                {/* CENTERED CONTENT */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

                    {/* TITLE */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        Get Your Home Loan Faster
                    </h2>

                    {/* SUBTITLE */}
                    <p className="text-gray-600 mb-5 text-sm sm:text-base max-w-md">
                        Compare rates, check eligibility, and apply in minutes.
                    </p>

                    {/* BUTTON */}
                    <button
                        onClick={() => router.visit("/profile/smart-setup")}
                        className="
                            bg-gray-900 text-white px-6 py-3 rounded-xl
                            font-medium text-sm sm:text-base
                            hover:bg-gray-800 transition
                            shadow-md
                            "
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </section>
    );
}
import {
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

import { useEffect } from "react";

export default function AboutUs() {

 useEffect(() => {

    const timeout = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timeout);

}, []);
    return (
        <div className="min-h-screen bg-[#f5f5f5]">

            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">

                <button
                    onClick={() =>
                        window.history.back()
                    }
                    className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-[#111827]" />
                </button>

                <h1 className="text-[18px] font-semibold text-[#111827]">
                    About Us
                </h1>

            </div>

            {/* CONTENT */}
            <div className="px-4 py-6 pb-14 max-w-7xl mx-auto">

                {/* HERO */}
                <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">

                    {/* LEFT */}
                    <div>

                        <p className="text-[13px] uppercase tracking-wide font-semibold text-gray-500 mb-4">
                            About QuickHomeLoan
                        </p>

                        <h1 className="text-[38px] leading-[46px] md:text-[58px] md:leading-[68px] font-bold text-[#0f172a] mb-6">
                            Empowering Your Home Ownership Journey
                        </h1>

                        <p className="text-[17px] leading-8 text-gray-700 mb-5">
                            At QuickHomeLoan, we believe in making home
                            ownership simple, transparent, and affordable.
                            Since our inception, we’ve been helping
                            thousands of borrowers compare rates, apply
                            smarter, and save more on their dream homes —
                            every step of the way.
                        </p>

                        <p className="text-[17px] leading-8 text-gray-700">
                            Whether you’re buying your first home,
                            transferring your existing loan, or seeking a
                            top-up, our goal is to empower you with tools,
                            insights, and support to make confident
                            financial decisions.
                        </p>

                    </div>

                    {/* IMAGE */}
                    <div>

                        <img
                            src="/images/about-home-loan.jpg"
                            alt="About Quick Home Loan"
className="w-full h-[260px] md:h-[520px] object-cover rounded-[32px] border border-gray-200 shadow-sm grayscale"                        />

                    </div>

                </div>

                {/* MISSION + VISION */}
                <div className="grid md:grid-cols-2 gap-5 mb-14">

                    {/* MISSION */}
                    <div className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">

                        <h2 className="text-[30px] font-bold text-[#0f172a] mb-5">
                            Our Mission
                        </h2>

                        <p className="text-[16px] leading-8 text-gray-700 mb-6">
                            To simplify the home loan process for every
                            Indian borrower — making it easy to compare,
                            choose, and secure the right home financing
                            with complete transparency.
                        </p>

                        <div className="space-y-4">

                            <FeaturePoint text="Provide unbiased, accurate information" />
                            <FeaturePoint text="Empower borrowers with financial literacy" />
                            <FeaturePoint text="Partner with leading banks and NBFCs for best deals" />
                            <FeaturePoint text="Deliver exceptional support through every loan stage" />

                        </div>

                    </div>

                    {/* VISION */}
                    <div className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">

                        <h2 className="text-[30px] font-bold text-[#0f172a] mb-5">
                            Our Vision
                        </h2>

                        <p className="text-[16px] leading-8 text-gray-700 mb-6">
                            To be India’s most trusted and customer-centric
                            home finance platform, where every borrower
                            finds clarity, confidence, and the best value.
                        </p>

                        <div className="space-y-4">

                            <FeaturePoint text="Digitize home loan comparison and approval" />
                            <FeaturePoint text="Build trust through transparency and technology" />
                            <FeaturePoint text="Enable smarter decisions through AI-driven insights" />

                        </div>

                    </div>

                </div>

                {/* CORE VALUES */}
                <div className="mb-14">

                    <h2 className="text-[36px] font-bold text-center text-[#0f172a] mb-10">
                        Our Core Values
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        <ValueCard
                            title="Transparency"
                            description="We disclose all costs, rates, and lender policies upfront."
                        />

                        <ValueCard
                            title="Integrity"
                            description="We recommend what’s best for you — not for us."
                        />

                        <ValueCard
                            title="Innovation"
                            description="We leverage technology to simplify complex loan processes."
                        />

                        <ValueCard
                            title="Customer First"
                            description="Every service, feature, and update revolves around you."
                        />

                        <ValueCard
                            title="Excellence"
                            description="We strive to exceed expectations in every interaction."
                        />

                        <ValueCard
                            title="Accessibility"
                            description="We make financial assistance inclusive and approachable."
                        />

                    </div>

                </div>

                {/* CTA */}
                <div className="bg-[#0f172a] rounded-[32px] p-8 md:p-12 text-center text-white">

                    <h2 className="text-[32px] md:text-[42px] leading-[46px] font-bold mb-5">
                        Join Us on the Journey to Smarter Home Loans
                    </h2>

                    <p className="text-[18px] leading-8 text-gray-300 max-w-3xl mx-auto mb-8">
                        We’re committed to transforming how India accesses
                        home finance — one borrower at a time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                        <button className="px-7 py-4 rounded-2xl bg-white text-[#0f172a] font-semibold hover:opacity-90 transition">
                            Contact Us
                        </button>

                        <button className="px-7 py-4 rounded-2xl border border-white text-white font-semibold hover:bg-white hover:text-[#0f172a] transition">
                            Explore Loan Options
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

/* FEATURE POINT */

function FeaturePoint({ text }) {
    return (
        <div className="flex items-start gap-3">

            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />

            <p className="text-[16px] leading-7 text-gray-700">
                {text}
            </p>

        </div>
    );
}

/* VALUE CARD */

function ValueCard({
    title,
    description,
}) {
    return (
        <div className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm">

            <h3 className="text-[24px] font-bold text-[#0f172a] mb-4">
                {title}
            </h3>

            <p className="text-[16px] leading-8 text-gray-700">
                {description}
            </p>

        </div>
    );
}
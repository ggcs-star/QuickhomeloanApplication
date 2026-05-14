import { ArrowLeft, CheckCircle2, Heart, Eye, Lightbulb, Users, Award, Globe } from "lucide-react";
import { router } from '@inertiajs/react';
import { useEffect } from "react";

export default function AboutUs() {

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const coreValues = [
    {
      title: "Transparency",
      description: "We disclose all costs, rates, and lender policies upfront.",
      icon: Eye,
      bg: "from-[#2563EB] to-[#1D4ED8]",
    },
    {
      title: "Integrity",
      description: "We recommend what's best for you — not for us.",
      icon: Heart,
      bg: "from-[#0F766E] to-[#115E59]",
    },
    {
      title: "Innovation",
      description: "We leverage technology to simplify complex loan processes.",
      icon: Lightbulb,
      bg: "from-[#7C3AED] to-[#6D28D9]",
    },
    {
      title: "Customer First",
      description: "Every service, feature, and update revolves around you.",
      icon: Users,
      bg: "from-[#EA580C] to-[#C2410C]",
    },
    {
      title: "Excellence",
      description: "We strive to exceed expectations in every interaction.",
      icon: Award,
      bg: "from-[#DC2626] to-[#B91C1C]",
    },
    {
      title: "Accessibility",
      description: "We make financial assistance inclusive and approachable.",
      icon: Globe,
      bg: "from-[#0891B2] to-[#0E7490]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fd] pb-24">

      {/* HEADER - Sticky Top Bar (same as Privacy Policy) */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#edf1f7] px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
          </button>
          <div>
            <h1 className="text-[24px] font-black tracking-[-0.5px] text-[#081c4b] leading-tight">
              About Us
            </h1>
            <p className="text-[12px] text-gray-500 mt-[2px]">
              Empowering your home ownership journey
            </p>
          </div>
        </div>
      </div>

      {/* HERO SECTION with house.png image */}
      <div className="px-4 mt-4">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-5 py-5 text-white">
          <div className="relative z-10 max-w-[70%]">
            <p className="text-[11px] opacity-90 font-medium">About QuickHomeLoan</p>
            <h2 className="text-[28px] leading-[30px] font-black mt-2 tracking-[-1px]">
              Empowering Your Home Ownership Journey
            </h2>
            <p className="text-[12px] opacity-90 mt-2 leading-5">
              Making home ownership simple, transparent, and affordable for every Indian borrower.
            </p>
          </div>
          
          {/* house.png image - same as Privacy Policy & Loan by Profession */}
          <img
            src="/images/house.png"
            alt="house"
            className="absolute right-0 bottom-0 h-[120px] object-contain"
          />
        </div>
      </div>

      {/* MAIN CONTENT - About Section */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-[20px] border border-[#edf1f7] p-5 shadow-sm">
          <p className="text-[15px] text-gray-700 leading-7 mb-4">
            At QuickHomeLoan, we believe in making home ownership simple, transparent, and affordable. 
            Since our inception, we've been helping thousands of borrowers compare rates, apply smarter, 
            and save more on their dream homes — every step of the way.
          </p>
          <p className="text-[15px] text-gray-700 leading-7">
            Whether you're buying your first home, transferring your existing loan, or seeking a top-up, 
            our goal is to empower you with tools, insights, and support to make confident financial decisions.
          </p>
        </div>
      </div>

      {/* MISSION & VISION - 2 Column Grid (same as Privacy Policy cards) */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {/* MISSION CARD */}
        <div className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-md mt-4 ml-4">
            <Eye className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <div className="p-4 pt-3">
            <h3 className="text-[18px] leading-[24px] font-bold text-[#081c4b]">
              Our Mission
            </h3>
            <div className="h-px bg-[#edf1f7] my-3"></div>
            <p className="text-[13px] text-gray-700 leading-6 mb-4">
              To simplify the home loan process for every Indian borrower — making it easy to compare, 
              choose, and secure the right home financing with complete transparency.
            </p>
            <div className="space-y-2">
              <FeaturePointSmall text="Provide unbiased, accurate information" />
              <FeaturePointSmall text="Empower borrowers with financial literacy" />
              <FeaturePointSmall text="Partner with leading banks and NBFCs for best deals" />
              <FeaturePointSmall text="Deliver exceptional support through every loan stage" />
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.06] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" />
        </div>

        {/* VISION CARD */}
        <div className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#0F766E] to-[#115E59] flex items-center justify-center shadow-md mt-4 ml-4">
            <Eye className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <div className="p-4 pt-3">
            <h3 className="text-[18px] leading-[24px] font-bold text-[#081c4b]">
              Our Vision
            </h3>
            <div className="h-px bg-[#edf1f7] my-3"></div>
            <p className="text-[13px] text-gray-700 leading-6 mb-4">
              To be India's most trusted and customer-centric home finance platform, where every borrower 
              finds clarity, confidence, and the best value.
            </p>
            <div className="space-y-2">
              <FeaturePointSmall text="Digitize home loan comparison and approval" />
              <FeaturePointSmall text="Build trust through transparency and technology" />
              <FeaturePointSmall text="Enable smarter decisions through AI-driven insights" />
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.06] bg-gradient-to-br from-[#0F766E] to-[#115E59]" />
        </div>
      </div>

      {/* CORE VALUES SECTION - Section Header */}
      <div className="px-4 mt-6">
        <div className="text-center mb-4">
          <h2 className="text-[24px] font-black tracking-[-0.5px] text-[#081c4b]">
            Our Core Values
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            What drives us every day
          </p>
        </div>
      </div>

      {/* CORE VALUES GRID - 2 Column */}
      <div className="px-4 mt-2 grid grid-cols-2 gap-3">
        {coreValues.map((value, index) => {
          const Icon = value.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm transition-all hover:shadow-md"
            >
              <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${value.bg} flex items-center justify-center shadow-md mt-4 ml-4`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div className="p-4 pt-2">
                <h3 className="text-[16px] leading-[20px] font-bold text-[#081c4b]">
                  {value.title}
                </h3>
                <div className="h-px bg-[#edf1f7] my-2"></div>
                <p className="text-[12px] text-gray-600 leading-5">
                  {value.description}
                </p>
              </div>
              <div className={`absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-[0.05] bg-gradient-to-br ${value.bg}`} />
            </div>
          );
        })}
      </div>

      {/* CTA SECTION - Same as Privacy Policy contact section */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-[#001B5E] to-[#0038b8] rounded-[20px] p-5 text-white">
          <div className="text-center">
            <h4 className="text-[20px] font-bold">Join Us on the Journey to Smarter Home Loans</h4>
            <p className="text-[12px] opacity-90 mt-2 mb-5">
              We're committed to transforming how India accesses home finance — one borrower at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.visit("/help-support")}
                className="bg-white text-[#001B5E] px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-md hover:opacity-90 transition"
              >
                Contact Us
              </button>
              <button
                onClick={() => router.visit("/loan-by-profession")}
                className="border border-white text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-white hover:text-[#001B5E] transition"
              >
                Explore Loan Options
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* Small Feature Point for Mission/Vision */
function FeaturePointSmall({ text }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
      <p className="text-[12px] leading-5 text-gray-600">
        {text}
      </p>
    </div>
  );
}
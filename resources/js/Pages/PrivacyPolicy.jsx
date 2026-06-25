import { router } from "@inertiajs/react";
import { ArrowLeft, ShieldCheck, Database, Target, Share2, Cookie, Lock, Users, Baby, RefreshCw } from "lucide-react";

export default function PrivacyPolicy() {
  const policySections = [
    {
      title: "Information Collection",
      desc: "What data we collect from you",
      icon: Database,
      bg: "from-[#2563EB] to-[#1D4ED8]",
      content: (
        <>
          <p className="text-[13px] text-gray-700 leading-6 mb-3">
            We collect the following types of information:
          </p>
          <ul className="space-y-2 text-[13px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold text-sm">•</span>
              <span><span className="font-semibold">Personal Information:</span> Name, phone number, email, address, employment details, income, and loan requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold text-sm">•</span>
              <span><span className="font-semibold">Financial Information:</span> Basic financial details required for loan eligibility (we do not store sensitive banking credentials).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold text-sm">•</span>
              <span><span className="font-semibold">Technical Information:</span> IP address, browser type, device information, and usage data.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Purpose of Information Use",
      desc: "How we use your data",
      icon: Target,
      bg: "from-[#0F766E] to-[#115E59]",
      content: (
        <>
          <p className="text-[13px] text-gray-700 leading-6 mb-3">
            We use your information for:
          </p>
          <ul className="space-y-2 text-[13px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold text-sm">•</span>
              <span>Processing loan inquiries and connecting with lenders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold text-sm">•</span>
              <span>Customer support and communication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold text-sm">•</span>
              <span>Marketing and promotional updates (with consent)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold text-sm">•</span>
              <span>Improving website performance and user experience</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Information Sharing",
      desc: "When and why we share your data",
      icon: Share2,
      bg: "from-[#7C3AED] to-[#6D28D9]",
      content: (
        <>
          <p className="text-[13px] text-gray-700 leading-6 mb-3">
            We may share your data with:
          </p>
          <ul className="space-y-2 text-[13px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold text-sm">•</span>
              <span>Banks and NBFCs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold text-sm">•</span>
              <span>Lending partners and DSAs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold text-sm">•</span>
              <span>Service providers for processing applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold text-sm">•</span>
              <span>Legal authorities when required</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Cookies",
      desc: "How we use tracking technologies",
      icon: Cookie,
      bg: "from-[#EA580C] to-[#C2410C]",
      content: (
        <p className="text-[13px] text-gray-700 leading-6">
          We use cookies to enhance user experience and analyze traffic. 
          Users can disable cookies via browser settings.
        </p>
      ),
    },
    {
      title: "Data Security",
      desc: "How we protect your information",
      icon: Lock,
      bg: "from-[#DC2626] to-[#B91C1C]",
      content: (
        <p className="text-[13px] text-gray-700 leading-6">
          We implement industry-standard security measures. However, no online platform is completely secure.
        </p>
      ),
    },
    {
      title: "User Rights",
      desc: "Your control over your data",
      icon: Users,
      bg: "from-[#0891B2] to-[#0E7490]",
      content: (
        <>
          <p className="text-[13px] text-gray-700 leading-6 mb-3">
            You have the right to:
          </p>
          <ul className="space-y-2 text-[13px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold text-sm">•</span>
              <span>Access your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold text-sm">•</span>
              <span>Request correction or deletion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold text-sm">•</span>
              <span>Opt-out of marketing communications</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Children's Privacy",
      desc: "Age restrictions",
      icon: Baby,
      bg: "from-[#4F46E5] to-[#4338CA]",
      content: (
        <p className="text-[13px] text-gray-700 leading-6">
          Our services are not intended for individuals under 18 years of age.
        </p>
      ),
    },
    {
      title: "Policy Updates",
      desc: "Changes to this policy",
      icon: RefreshCw,
      bg: "from-[#DB2777] to-[#BE185D]",
      content: (
        <p className="text-[13px] text-gray-700 leading-6">
          We may update this policy from time to time. Changes will be posted on this page.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fd] pb-20">

      {/* HEADER */}
      <div className="px-4 pt-5 pb-2">
          <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#081c4b]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#081c4b]">Privacy Policy</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">How we protect your information</p>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="px-4 mt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-4 text-white">
          <div className="relative z-10 max-w-[65%]">
            <p className="text-[10px] opacity-80 font-medium">Your Privacy Matters</p>
            <h2 className="text-2xl font-bold mt-1 tracking-tight">We Value Your Trust</h2>
            <p className="text-[11px] opacity-90 mt-1 leading-5">
              Learn how Quick Home Loan collects, uses, and protects your personal information.
            </p>
          </div>
          <img
            src="/images/house.png"
            alt="house"
            className="absolute right-0 bottom-0 h-24 object-contain opacity-90"
          />
        </div>
      </div>

      {/* GRID - 1 COLUMN (CHANGED FROM grid-cols-2 TO grid-cols-1) */}
      <div className="px-4 mt-4 grid grid-cols-1 gap-3">
        {policySections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.bg} flex items-center justify-center mt-3 ml-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>

              <div className="p-3 pt-2">
                <h3 className="text-sm font-bold text-[#081c4b]">{section.title}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{section.desc}</p>

                <div className="h-px bg-gray-100 my-2"></div>

                <div className="text-[12px] leading-5">
                  {section.content}
                </div>
              </div>

              <div className={`absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-[0.04] bg-gradient-to-br ${section.bg}`} />
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      {/* <div className="px-4 mt-4 text-center pb-4">
        <p className="text-[10px] text-gray-400">Last Updated: May 15, 2026</p>
      </div> */}

    </div>
  );
}
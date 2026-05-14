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
          <p className="text-[15px] text-gray-700 leading-7 mb-4">
            We collect the following types of information:
          </p>
          <ul className="space-y-3 text-[15px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold">•</span>
              <span><span className="font-semibold">Personal Information:</span> Name, phone number, email, address, employment details, income, and loan requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold">•</span>
              <span><span className="font-semibold">Financial Information:</span> Basic financial details required for loan eligibility (we do not store sensitive banking credentials).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563eb] font-bold">•</span>
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
          <p className="text-[15px] text-gray-700 leading-7 mb-4">
            We use your information for:
          </p>
          <ul className="space-y-3 text-[15px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">•</span>
              <span>Processing loan inquiries and connecting with lenders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">•</span>
              <span>Customer support and communication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">•</span>
              <span>Marketing and promotional updates (with consent)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">•</span>
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
          <p className="text-[15px] text-gray-700 leading-7 mb-4">
            We may share your data with:
          </p>
          <ul className="space-y-3 text-[15px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold">•</span>
              <span>Banks and NBFCs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold">•</span>
              <span>Lending partners and DSAs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold">•</span>
              <span>Service providers for processing applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C3AED] font-bold">•</span>
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
        <p className="text-[15px] text-gray-700 leading-7">
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
        <p className="text-[15px] text-gray-700 leading-7">
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
          <p className="text-[15px] text-gray-700 leading-7 mb-4">
            You have the right to:
          </p>
          <ul className="space-y-3 text-[15px] text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold">•</span>
              <span>Access your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold">•</span>
              <span>Request correction or deletion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0891B2] font-bold">•</span>
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
        <p className="text-[15px] text-gray-700 leading-7">
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
        <p className="text-[15px] text-gray-700 leading-7">
          We may update this policy from time to time. Changes will be posted on this page.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fd] pb-24">

      {/* HEADER - Sticky Top Bar */}
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
              Privacy Policy
            </h1>
            <p className="text-[12px] text-gray-500 mt-[2px]">
              How we protect your information
            </p>
          </div>
        </div>
      </div>

      {/* HERO SECTION with house.png image */}
      <div className="px-4 mt-4">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-5 py-5 text-white">
          <div className="relative z-10 max-w-[70%]">
            <p className="text-[11px] opacity-90 font-medium">Your Privacy Matters</p>
            <h2 className="text-[28px] leading-[30px] font-black mt-2 tracking-[-1px]">
              We Value Your Trust
            </h2>
            <p className="text-[12px] opacity-90 mt-2 leading-5">
              Learn how Quick Home Loan collects, uses, and protects your personal information.
            </p>
          </div>
          
          {/* house.png image - same as Loan by Profession */}
          <img
            src="/images/house.png"
            alt="house"
            className="absolute right-0 bottom-0 h-[120px] object-contain"
          />
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {policySections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm transition-all hover:shadow-md"
            >
              <div className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${section.bg} flex items-center justify-center shadow-md mt-4 ml-4`}>
                <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
              </div>

              <div className="p-4 pt-3">
                <h3 className="text-[16px] leading-[20px] font-bold text-[#081c4b]">
                  {section.title}
                </h3>
                <p className="text-[11px] leading-[17px] text-gray-500 mt-1">
                  {section.desc}
                </p>

                <div className="h-px bg-[#edf1f7] my-3"></div>

                <div className="text-[13px]">
                  {section.content}
                </div>
              </div>

              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.06] bg-gradient-to-br ${section.bg}`} />
            </div>
          );
        })}
      </div>

      {/* CONTACT SECTION */}
 

    </div>
  );
}
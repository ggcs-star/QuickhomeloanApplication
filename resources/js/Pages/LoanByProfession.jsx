import AppLayout from "@/Layouts/AppLayout";

import {
  ArrowLeft,
  Stethoscope,
  Calculator,
  Cpu,
  BookOpen,
  Scale,
  Laptop,
  Briefcase,
  Video,
  Plane,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function LoanByProfession() {

  const professions = [
    {
      title: "Doctors",
      desc: "Easy medical financing",
      icon: Stethoscope,
      route:
        "https://quickhomeloan.in/home-loan/profession/doctor",
      bg: "from-[#2563EB] to-[#1D4ED8]",
    },
    {
      title: "Chartered Accountant",
      desc: "Smart finance solutions",
      icon: Calculator,
      route:
        "https://quickhomeloan.in/home-loan/profession/chartered-accountants",
      bg: "from-[#0F766E] to-[#115E59]",
    },
    {
      title: "Engineers",
      desc: "Flexible loan options",
      icon: Cpu,
      route:
        "https://quickhomeloan.in/home-loan/profession/engineer",
      bg: "from-[#7C3AED] to-[#6D28D9]",
    },
    {
      title: "Teachers",
      desc: "Easy educator financing",
      icon: BookOpen,
      route:
        "https://quickhomeloan.in/home-loan/profession/teacher",
      bg: "from-[#EA580C] to-[#C2410C]",
    },
    {
      title: "Lawyers",
      desc: "Trusted legal financing",
      icon: Scale,
      route:
        "https://quickhomeloan.in/home-loan/profession/lawyer",
      bg: "from-[#DC2626] to-[#B91C1C]",
    },
    {
      title: "IT Professionals",
      desc: "Fast digital approvals",
      icon: Laptop,
      route:
        "https://quickhomeloan.in/home-loan/profession/it-professional",
      bg: "from-[#0891B2] to-[#0E7490]",
    },
    {
      title: "Business Owners",
      desc: "Grow business faster",
      icon: Briefcase,
      route:
        "https://quickhomeloan.in/home-loan/profession/business-owner",
      bg: "from-[#4F46E5] to-[#4338CA]",
    },
    {
      title: "Influencers",
      desc: "Smart creator funding",
      icon: Video,
      route:
        "https://quickhomeloan.in/home-loan/profession/influencer",
      bg: "from-[#DB2777] to-[#BE185D]",
    },
    {
      title: "NRIs",
      desc: "Easy overseas financing",
      icon: Plane,
      route:
        "https://quickhomeloan.in/home-loan/profession/nri",
      bg: "from-[#0284C7] to-[#0369A1]",
    },
    {
      title: "Defense Personnel",
      desc: "Service member benefits",
      icon: ShieldCheck,
      route:
        "https://quickhomeloan.in/home-loan/profession/defense",
      bg: "from-[#15803D] to-[#166534]",
    },
  ];

  const handleOpen = (
    url
  ) => {

    window.location.href =
      url;
  };

  return (
    <AppLayout>

      <div className="min-h-screen bg-[#f5f7fd] pb-24">

        {/* HEADER */}
        <div className="px-4 pt-5">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                window.history.back()
              }
              className="
                w-10 h-10 rounded-full
                bg-white
                border border-[#edf1f7]
                flex items-center justify-center
                shadow-sm
              "
            >
              <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
            </button>

            <div>

              <h1 className="text-[24px] font-black tracking-[-0.5px] text-[#081c4b] leading-tight">

                Loan by Profession

              </h1>

              <p className="text-[12px] text-gray-500 mt-[2px]">
                Special financing offers for professionals
              </p>

            </div>

          </div>

        </div>

        {/* HERO */}
        <div className="px-4 mt-4">

          <div className="
            relative overflow-hidden
            rounded-[22px]
            bg-gradient-to-r
            from-[#001B5E]
            to-[#0038b8]
            px-5 py-5
            text-white
          ">

            <div className="relative z-10 max-w-[70%]">

              <p className="text-[11px] opacity-90 font-medium">
                Professional Loan Programs
              </p>

              <h2 className="text-[28px] leading-[30px] font-black mt-2 tracking-[-1px]">

                Get Better Loan Benefits

              </h2>

              <p className="text-[12px] opacity-90 mt-2 leading-5">
                Lower rates, faster approvals and higher eligibility.
              </p>

            </div>

            <img
              src="/images/house.png"
              alt="house"
              className="
                absolute right-0 bottom-0
                h-[120px]
                object-contain
              "
            />

          </div>

        </div>

        {/* GRID */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">

          {professions.map(
            (item, index) => {

              const Icon =
                item.icon;

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleOpen(
                      item.route
                    )
                  }
                  className="
                    relative overflow-hidden
                    rounded-[20px]
                    bg-white
                    border border-[#edf1f7]
                    p-4
                    text-left
                    shadow-sm
                    active:scale-[0.98]
                    transition-all
                  "
                >

                  {/* TOP ICON */}
                  <div className={`
                    w-14 h-14 rounded-[16px]
                    bg-gradient-to-br
                    ${item.bg}
                    flex items-center justify-center
                    shadow-md
                  `}>

                    <Icon
                      className="w-7 h-7 text-white"
                      strokeWidth={2.2}
                    />

                  </div>

                  {/* CONTENT */}
                  <div className="mt-4">

                    <h3 className="
                      text-[16px]
                      leading-[20px]
                      font-bold
                      text-[#081c4b]
                    ">

                      {item.title}

                    </h3>

                    <p className="
                      text-[11px]
                      leading-[17px]
                      text-gray-500
                      mt-1
                    ">

                      {item.desc}

                    </p>

                  </div>

                  {/* ARROW */}
                  <div className="
                    mt-4
                    flex items-center justify-between
                  ">

                    <span className="
                      text-[11px]
                      font-semibold
                      text-[#2563eb]
                    ">
                      Explore
                    </span>

                    <div className="
                      w-7 h-7 rounded-full
                      bg-[#f5f7fd]
                      flex items-center justify-center
                    ">

                      <ChevronRight className="w-4 h-4 text-[#081c4b]" />

                    </div>

                  </div>

                  {/* BG DECOR */}
                  <div className={`
                    absolute -right-8 -top-8
                    w-24 h-24 rounded-full
                    opacity-[0.06]
                    bg-gradient-to-br
                    ${item.bg}
                  `} />

                </button>
              );
            }
          )}

        </div>

      </div>

    </AppLayout>
  );
}
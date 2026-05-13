import { useState } from "react";
import { ArrowLeft, Calculator, BookOpen } from "lucide-react";

export default function FirstTimeLayout({
  title,
  CalculateComponent,
  InsightsComponent,
  GuideComponent,
}) {

  const [activeTab, setActiveTab] = useState("calculate");

  const tabs = [
    {
      key: "calculate",
      label: "Calculate",
      icon: Calculator,
    },
    {
      key: "learn",
      label: "Learn",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fd] pb-24">

      {/* ================= HEADER ================= */}
      <div className="px-4 pt-5">

        <div className="flex items-center gap-3">

          {/* BACK */}
          <button
            onClick={() => window.history.back()}
            className="
              w-10 h-10 rounded-full
              bg-white
              border border-[#edf1f7]
              flex items-center justify-center
              shadow-sm
              shrink-0
            "
          >
            <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
          </button>

          {/* TITLE */}
          <div className="min-w-0">

            <h1 className="
              text-[24px]
              font-black
              tracking-[-0.5px]
              text-[#081c4b]
              leading-tight
              truncate
            ">

              {title}

            </h1>

            <p className="text-[12px] text-gray-500 mt-[2px]">
              Smart loan planning & learning tools
            </p>

          </div>

        </div>

      </div>

      {/* ================= HERO ================= */}
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

          <div className="relative z-10 max-w-[72%]">

            <p className="text-[11px] opacity-90 font-medium">
              Financial Intelligence
            </p>

            <h2 className="
              text-[28px]
              leading-[30px]
              font-black
              mt-2
              tracking-[-1px]
            ">

              Understand Before You Decide

            </h2>

            <p className="
              text-[12px]
              opacity-90
              mt-2
              leading-5
            ">
              Use calculators and learning tools to make smarter financial decisions.
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

      {/* ================= TABS ================= */}
      <div className="px-4 mt-5">

        <div className="
          bg-white
          rounded-2xl
          p-1
          border border-[#edf1f7]
          shadow-sm
          flex
        ">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-1
                  h-[48px]
                  rounded-xl
                  text-sm
                  font-semibold
                  transition-all
                  flex items-center justify-center gap-2
                  ${
                    activeTab === tab.key
                      ? "bg-[#081c4b] text-white shadow-sm"
                      : "text-gray-500"
                  }
                `}
              >

                <Icon size={18} />

                {tab.label}

              </button>
            );
          })}

        </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-4 mt-5">

        {activeTab === "calculate" && (
          <div className="
            bg-white
            rounded-[24px]
            border border-[#edf1f7]
            shadow-sm
            p-4
          ">
            <CalculateComponent />
          </div>
        )}

        {activeTab === "learn" && (
          <div className="
            bg-white
            rounded-[24px]
            border border-[#edf1f7]
            shadow-sm
            p-4
          ">
            <GuideComponent />
          </div>
        )}

      </div>

    </div>
  );
}
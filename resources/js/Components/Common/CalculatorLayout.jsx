import { useState } from "react";

import {
  ArrowLeft,
  RotateCcw,
  BookOpenText,
} from "lucide-react";

export default function CalculatorLayout({
  title,
  subtitle = "Plan your loan repayments smartly",
  onReset = null,

  CalculateComponent,
  InsightsComponent,
  GuideComponent,
}) {

  const [activeTab, setActiveTab] =
    useState("calculate");

  return (
    <div className="bg-[#f5f7fd] min-h-screen max-w-[430px] mx-auto">

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-30 bg-[#f5f7fd]/95 backdrop-blur-md px-3 pt-3 pb-2">

        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-2">

            <button
                onClick={() => {
                    if (activeTab !== "calculate") {
                        setActiveTab("calculate");
                        return;
                    }
                    window.history.back();
                }}
                className="
                    w-10 h-10
                    rounded-full
                    bg-white
                    border border-[#edf1f7]
                    flex items-center justify-center
                    shadow-sm
                    active:scale-95
                    transition-all
                "
            >
                <ArrowLeft
                    size={20}
                    strokeWidth={2}
                    className="text-[#081c4b]"
                />
            </button>

            <div>

              <h1 className="text-[16px] font-bold text-[#081c4b] leading-none">
                {title}
              </h1>

              <p className="text-gray-500 mt-[3px] text-[10px] leading-3">
                {subtitle}
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {onReset && activeTab === "calculate" && (
              <button
                onClick={onReset}
                className="
                  w-9 h-9 rounded-full
                  flex items-center justify-center
                  bg-white
                  border border-[#e9eefb]
                  shadow-sm
                  active:scale-95
                  transition-all
                "
              >
                <RotateCcw
                  size={18}
                  strokeWidth={2.2}
                  className="text-[#081c4b]"
                />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* PAGE BODY */}
      <div className="pb-28">

        {activeTab === "calculate" && (
          <CalculateComponent />
        )}

        {activeTab === "insights" &&
          InsightsComponent && (
            <InsightsComponent />
          )}

        {activeTab === "guide" &&
          GuideComponent && (
            <GuideComponent />
          )}

      </div>

      {/* BOTTOM GUIDE BUTTON */}
      {GuideComponent &&
        activeTab === "calculate" && (

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-40">

            <button
              onClick={() =>
                setActiveTab("guide")
              }
              className="
                w-full
                bg-[#5C9DF6]
                rounded-2xl
                px-4
                py-4
                flex
                items-center
                justify-between
                shadow-[0_10px_30px_rgba(92,157,246,0.25)]
                active:scale-[0.98]
                transition-all
              "
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <BookOpenText
                    size={20}
                    className="text-[#5C9DF6]"
                  />
                </div>

                <div className="text-left">

                  <p className="text-white font-semibold text-[16px] leading-none">
                    Frequently Asked Questions
                  </p>

                  <p className="text-white/80 text-[11px] mt-1">
                    EMI guide, tips & answers
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">

                <ArrowLeft
                  size={20}
                  className="text-[#5C9DF6] rotate-180"
                />

              </div>

            </button>

          </div>
        )}

    </div>
  );
}
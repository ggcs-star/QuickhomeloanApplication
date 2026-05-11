import {
  ArrowLeft,
  RotateCcw,
  BookOpenText,
} from "lucide-react";

export default function CalculatorLayout({
  title,
  subtitle = "Plan your loan repayments smartly",
  guideLink = null,
  onReset = null,
  CalculateComponent,
}) {
  return (
    <div className="bg-[#f5f7fd] min-h-screen max-w-[430px] mx-auto">

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-30 bg-[#f5f7fd]/95 backdrop-blur-md px-3 pt-3 pb-2">

        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-2">

            <button
              onClick={() => window.history.back()}
              className="
                mt-[1px]
                w-8 h-8
                rounded-full
                flex items-center justify-center
                active:scale-95
                transition-all
              "
            >
              <ArrowLeft
                size={22}
                strokeWidth={2.4}
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

            {/* RESET */}
            {onReset && (
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

            {/* GUIDE */}
            {guideLink && (
              <button
                onClick={() => {
                  window.location.href = guideLink;
                }}
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
                <BookOpenText
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
      <div>
        <CalculateComponent />
      </div>

    </div>
  );
}
import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Lightbulb,
  Calculator,
  Clock3,
  ListChecks,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const ICONS = [
  {
    icon: Calculator,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    icon: Clock3,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: ListChecks,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    icon: BarChart3,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
  {
    icon: TrendingUp,
    bg: "bg-green-100",
    color: "text-green-600",
  },
];

export default function GuideLayout({
  title = "FAQs",
  faqs = [],
  tips = [],
}) {
  const [openIndex, setOpenIndex] =
    useState(null);

  const toggle = (index) => {
    setOpenIndex(
      openIndex === index ? null : index
    );
  };

  return (
    <div className="pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-2 px-1 mb-4">

        <HelpCircle
          size={19}
          className="text-gray-500"
        />

        <h2 className="text-[18px] font-semibold text-gray-800">
          {title}
        </h2>

      </div>

      {/* FAQ LIST */}
      <div className="bg-white rounded-[24px] overflow-hidden border border-gray-200">

        {faqs.map((faq, index) => {

          const isOpen =
            openIndex === index;

          const itemIcon =
            ICONS[index % ICONS.length];

          const Icon =
            itemIcon.icon;

          return (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >

              {/* QUESTION */}
              <button
                type="button"
                onMouseDown={(e) =>
                  e.preventDefault()
                }
                onClick={() =>
                  toggle(index)
                }
                className="w-full flex items-start justify-between gap-3 px-4 py-4 text-left"
              >

                <div className="flex items-start gap-3">

                  {/* ICON */}
                  <div
                    className={`
                      w-11 h-11
                      rounded-xl
                      flex items-center justify-center
                      shrink-0
                      ${itemIcon.bg}
                    `}
                  >

                    <Icon
                      size={19}
                      className={
                        itemIcon.color
                      }
                    />

                  </div>

                  {/* TEXT */}
                  <div>

                    <h3 className="text-[16px] leading-[22px] font-semibold text-gray-900">
                      {faq.question}
                    </h3>

                    <p className="text-[14px] text-gray-500 mt-1">
                      Discover the best use
                      cases and scenarios.
                    </p>

                  </div>

                </div>

                {/* ARROW */}
                <ChevronDown
                  size={20}
                  className={`
                    text-gray-500
                    shrink-0
                    mt-2
                    transition-transform duration-300
                    ${
                      isOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>

              {/* ANSWER */}
              <div
                className={`
                  overflow-hidden
                  transition-all duration-300
                  ${
                    isOpen
                      ? "max-h-[300px] opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
              >

                <div className="pl-[70px] pr-5 pb-5">

                  <p className="text-[14px] leading-7 text-gray-600">
                    {faq.answer}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* PRO TIPS */}
      {tips.length > 0 && (
        <div className="mt-6">

          <div
            className="
              bg-[#1f2a3c]
              rounded-[28px]
              p-5
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            "
          >

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-5">

              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">

                <Lightbulb
                  size={18}
                  className="text-blue-400"
                />

              </div>

              <h3 className="text-[18px] font-semibold text-white">
                Pro Tips
              </h3>

            </div>

            {/* TIPS */}
            <div className="space-y-4">

              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                >

                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">

                    <span className="text-[11px] text-blue-400">
                      ✓
                    </span>

                  </div>

                  <p className="text-[14px] leading-7 text-gray-200">
                    {tip}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
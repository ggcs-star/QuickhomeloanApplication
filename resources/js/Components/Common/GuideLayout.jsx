import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function GuideLayout({
  title = "FAQs",
  faqs = [],
  tips = [],
}) {

  // DEFAULT CLOSED
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
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle
          size={20}
          className="text-gray-500"
        />

        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">

        {faqs.map((faq, index) => {

          const isOpen =
            openIndex === index;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                px-4 py-4
                shadow-[0_4px_12px_rgba(0,0,0,0.06)]
                border border-gray-200
              "
            >

              {/* QUESTION */}
            <button
  type="button"
  onMouseDown={(e) => e.preventDefault()}
  onClick={() => toggle(index)}
  className="w-full flex justify-between items-center text-left"
>

                <span className="text-[15px] font-semibold text-gray-800">
                  {faq.question}
                </span>

                <ChevronDown
                  size={20}
                  className={`
                    text-gray-500
                    shrink-0
                    transition-transform
                    duration-300
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
                  transition-all
                  duration-300
                  ${
                    isOpen
                      ? "max-h-[300px] opacity-100 mt-3"
                      : "max-h-0 opacity-0"
                  }
                `}
              >

                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>

              </div>

            </div>
          );
        })}

      </div>

      {/* PRO TIP */}
      {tips.length > 0 && (
        <div className="mt-6">

          <div
            className="
              bg-[#1f2a3c]
              rounded-3xl
              p-5
              text-white
              shadow-[0_8px_20px_rgba(0,0,0,0.2)]
            "
          >

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">

              <Lightbulb
                size={20}
                className="text-blue-400"
              />

              <h3 className="text-lg font-semibold">
                Pro Tip
              </h3>

            </div>

            {/* LIST */}
            <ul className="space-y-4">

              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                >

                  <span className="text-blue-400 mt-1 text-sm">
                    ✓
                  </span>

                  <span className="text-sm text-gray-200 leading-relaxed">
                    {tip}
                  </span>

                </li>
              ))}

            </ul>

          </div>

        </div>
      )}

    </div>
  );
}
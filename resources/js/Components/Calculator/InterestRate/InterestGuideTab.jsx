import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ProTip from "@/Components/Calculator/InterestRate/ProTip";

const FAQS = [
  {
    question: "What does this Interest Rate Calculator do?",
    answer:
      "It calculates the effective annual interest rate of your loan using your EMI, loan amount, and tenure. This helps you uncover the real rate you are paying.",
  },
  {
    question: "How accurate is it?",
    answer:
      "The calculator is highly accurate and uses an iterative bisection method similar to banking systems. Minor rounding differences may occur.",
  },
  {
    question: "Why can't the interest rate be calculated directly?",
    answer:
      "Because the EMI formula cannot be algebraically reversed for the interest rate. The calculator uses numerical approximation to solve it.",
  },
  {
    question: "Can I use this for home, car, and personal loans?",
    answer:
      "Yes. It works for all EMI-based loans including home, car, personal, and education loans.",
  },
  {
    question: "What if my EMI includes insurance or other fees?",
    answer:
      "If EMI includes insurance or add-ons, the calculated interest rate may appear higher since those costs are not part of the principal.",
  },
  {
    question: "Does the processing fee change the interest rate?",
    answer:
      "Processing fees do not change the EMI rate mathematically, but they increase the effective cost of borrowing.",
  },
  {
    question: "Why is my calculated interest rate very high?",
    answer:
      "High rates are common for unsecured loans or short tenures. It may also indicate bundled fees or dealer markups.",
  },
  {
    question: "What about floating interest rate loans?",
    answer:
      "For floating-rate loans, the calculator shows the effective rate based on your current EMI and outstanding tenure.",
  },
  {
    question: "Can I calculate the interest rate on an old loan?",
    answer:
      "Yes. As long as you know the EMI, original loan amount, and tenure, this calculator will work.",
  },
  {
    question: "Will this calculator save my personal data?",
    answer:
      "No. All calculations happen locally in your browser. No data is stored or transmitted.",
  },
  {
    question: "Can I calculate the rate if my EMI changes?",
    answer:
      "Yes. Enter the revised EMI to instantly see the updated effective interest rate.",
  },
];

export default function InterestGuideTab() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle size={20} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-800">
          Interest Rate Calculator FAQs
        </h2>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">

        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;

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
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-[15px] font-semibold text-gray-800">
                  {faq.question}
                </span>

                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ANSWER */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

            </div>
          );
        })}

        <ProTip />
      </div>
    </div>
  );
}
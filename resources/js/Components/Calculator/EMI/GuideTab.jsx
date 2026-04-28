import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ProTip from "@/Components/Calculator/EMI/ProTip";
const FAQS = [
  {
    question: "What is an EMI?",
    answer:
      "EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay your loan.",
  },
  {
    question: "How accurate is this EMI calculator?",
    answer:
      "This calculator gives a close estimate based on inputs. Actual EMI may vary slightly based on bank terms.",
  },
  {
    question: "How does loan tenure affect my EMI?",
    answer:
      "Longer tenure reduces EMI but increases total interest. Shorter tenure increases EMI but reduces total cost.",
  },
  {
    question: "What is the difference between fixed and floating interest rates?",
    answer:
      "Fixed stays constant, while floating changes based on market conditions.",
  },
  {
    question: "Does this calculator include processing fees?",
    answer:
      "No, it only calculates EMI based on principal, rate, and tenure.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, your data is not stored and is used only for calculation.",
  },
  {
    question: "What is an amortization schedule?",
    answer:
      "It is a breakdown of loan repayment showing principal and interest over time.",
  },
];

export default function GuideTab() {
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
          Frequently Asked Questions
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
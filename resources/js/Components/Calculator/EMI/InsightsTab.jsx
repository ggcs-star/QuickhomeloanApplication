import React from "react";
import {
  Calculator,
  Clock,
  ListChecks,
  BarChart3,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function InsightsTab() {
  return (
    <div className="space-y-6">

      {/* WHAT THIS CALCULATOR DOES */}
      <Section title="What This Calculator Does" icon={Calculator}>
        <ul className="space-y-3">
          {[
            "Calculate the fixed monthly EMI.",
            "Understand total interest payable.",
            "Break down repayment into principal and interest.",
            "Analyze the impact of tenure and rate changes.",
            "Compare loan offers across banks.",
            "Plan monthly budgeting accurately.",
            "Assess loan affordability before applying.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-green-500 mt-1">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* WHEN TO USE */}
      <Section title="When to Use This Calculator" icon={Clock}>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Before applying for a home loan",
            "While planning a car purchase",
            "To compare personal loan rates",
            "To choose the right tenure",
            "Before taking a top-up loan",
            "For financial planning",
            "To avoid over-borrowing",
            "To assess EMI affordability",
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-blue-500">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW TO USE */}
      <Section title="How to Use – Step by Step" icon={ListChecks}>
        <div className="grid grid-cols-1 gap-3">
          {[
            ["Enter Loan Amount (₹)", "Input the total amount you want to borrow."],
            ["Enter Interest Rate (%)", "Provide the annual interest rate."],
            ["Select Loan Tenure", "Choose repayment duration in years."],
            ["Click Calculate EMI", "Instantly see repayment details."],
            ["Review EMI Details", "Check EMI, interest, and total payment."],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-gray-50 p-3 rounded-lg border flex gap-3"
            >
              <div className="text-blue-600 font-bold">
                {i + 1}
              </div>

              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {title}
                </p>
                <p className="text-xs text-gray-600">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section title="How This Calculator Works" icon={BarChart3}>
        <div className="bg-gray-100 rounded-lg p-4 text-center font-mono text-sm">
          EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)
        </div>

        <div className="grid grid-cols-1 gap-2 mt-3">
          <p><strong>P</strong> = Principal amount</p>
          <p><strong>r</strong> = Monthly interest rate</p>
          <p><strong>n</strong> = Number of months</p>
        </div>
      </Section>

      {/* PRACTICAL APPLICATIONS */}
      <Section title="Practical Applications" icon={TrendingUp}>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Home & car budgeting",
            "Loan comparison",
            "Tenure optimization",
            "Prepayment planning",
            "Eligibility assessment",
            "Financial forecasting",
            "Interest impact analysis",
            "Loan restructuring",
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Lightbulb size={14} className="text-yellow-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

/* SECTION WRAPPER */
function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-blue-600" />}
        <h2 className="text-sm font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      {/* CONTENT */}
      <div className="text-gray-600 text-sm leading-relaxed space-y-2">
        {children}
      </div>

    </section>
  );
}
import React from "react";
import {
  Calculator,
  Clock,
  ListChecks,
  BarChart3,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function LoanEligibilityInsights() {
  return (
    <div className="space-y-6">

      {/* WHAT THIS CALCULATOR DOES */}
      <Section title="What This Calculator Does" icon={Calculator}>
        <ul className="space-y-3">
          {[
            "Estimates the maximum loan amount based on your financial profile.",
            "Uses FOIR (Fixed Obligation to Income Ratio) method.",
            "Helps determine a safe borrowing limit.",
            "Checks eligibility for home, car, and personal loans.",
            "Allows scenario testing with tenure and interest changes.",
            "Enables pre-check before applying for a loan.",
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
            "Before searching for a home",
            "Planning to buy a car",
            "Before taking a personal loan",
            "Comparing different bank offers",
            "Checking eligibility based on salary",
            "If you already have existing EMIs",
            "Choosing the right loan tenure",
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
            ["Enter Monthly Income", "Add your net take-home salary."],
            ["Enter Existing EMIs", "Include all current monthly obligations."],
            ["Adjust Interest & Tenure", "Match loan offer details."],
            ["Select Loan Type", "Choose home, car, or personal loan."],
            ["Click Check Eligibility", "Get instant loan eligibility."],
            ["View Results", "See maximum loan you can get."],
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
      <Section title="How This Calculator Works" icon={Calculator}>
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-lg p-3 text-center font-mono text-sm">
            Eligible EMI = (Income × FOIR) − Existing EMIs
          </div>

          <div className="bg-gray-100 rounded-lg p-3 text-center font-mono text-sm">
            Loan Amount = EMI × [ (1+r)^n − 1 ] / [ r × (1+r)^n ]
          </div>
        </div>
      </Section>

      {/* PRACTICAL APPLICATIONS */}
      <Section title="Practical Applications" icon={Lightbulb}>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Plan property or car budget",
            "Compare lender offers",
            "Optimize tenure vs EMI",
            "Improve FOIR before applying",
            "Negotiate better loan terms",
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
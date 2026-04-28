import React from "react";
import {
  Calculator,
  Clock,
  ListChecks,
  BarChart3,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function InterestInsightsTab() {
  return (
    <div className="space-y-6">

      {/* WHAT THIS CALCULATOR DOES */}
      <Section title="What This Calculator Does" icon={Calculator}>
        <ul className="space-y-3">
          {[
            "Identify your effective interest rate.",
            "Verify if your bank is charging the correct interest.",
            "Check if refinancing makes financial sense.",
            "Compare bank offers with your current loan.",
            "Validate processing by DSA/agents.",
            "Check interest rate for old loans (where you forgot).",
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
            "Identify your effective interest rate",
            "Verify bank interest charges",
            "Check refinancing opportunities",
            "Compare loan offers",
            "Validate agent calculations",
            "Analyze old loans",
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
            ["Enter Your EMI", "The fixed monthly payment (e.g., ₹30,000)."],
            ["Enter Loan Amount", "Total borrowed principal (e.g., ₹35,00,000)."],
            ["Enter Tenure", "Loan duration (e.g., 20 years / 240 months)."],
            ["Click Calculate", "Let the system compute the interest rate."],
            ["View Result", "See monthly & annual interest rates + total interest."],
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
        <p>
          This calculator uses an iterative <strong>bisection method</strong> to
          reverse the EMI formula and find the exact interest rate.
        </p>

        <div className="bg-gray-100 rounded-lg p-3 text-center font-mono text-sm">
          EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)
        </div>

        <p>
          Since the formula cannot be directly solved for interest rate, the
          system repeatedly refines guesses until it matches your EMI.
        </p>

        <div className="mt-2 space-y-1 text-xs">
          <p><strong>Includes:</strong> EMI, Loan Amount, Tenure</p>
          <p><strong>Excludes:</strong> Fees, insurance, extra charges</p>
        </div>
      </Section>

      {/* PRACTICAL APPLICATIONS */}
      <Section title="Practical Applications" icon={TrendingUp}>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Verify loan offers before switching",
            "Negotiate better interest rates",
            "Detect overcharging by lenders",
            "Analyze zero-cost EMI schemes",
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
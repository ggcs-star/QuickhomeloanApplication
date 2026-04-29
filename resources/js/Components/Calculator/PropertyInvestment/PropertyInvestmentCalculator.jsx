import React, { useState, useMemo } from "react";

/* -------------------------------------------
   SCENARIO PRESETS
------------------------------------------- */
const SCENARIOS = {
  base: {
    label: "Base",
    inputs: {
      propertyValue: 5000000,
      appreciation: 4,
      years: 20,
      loanAmount: 4000000,
      interestRate: 9.5,
      tenure: 20,
      emiFrequency: 12,
    },
  },
  conservative: {
    label: "Conservative",
    inputs: {
      propertyValue: 5000000,
      appreciation: 10,
      years: 20,
      loanAmount: 4000000,
      interestRate: 8,
      tenure: 20,
      emiFrequency: 12,
    },
  },
  aggressive: {
    label: "Aggressive",
    inputs: {
      propertyValue: 5000000,
      appreciation: 7,
      years: 20,
      loanAmount: 4000000,
      interestRate: 8.5,
      tenure: 20,
      emiFrequency: 12,
    },
  },
};

/* -------------------------------------------
   CALCULATION LOGIC
------------------------------------------- */
function calculateResults(inputs) {
  const exitValue =
    inputs.propertyValue *
    Math.pow(1 + inputs.appreciation / 100, inputs.years);

  const totalEmiPaid = inputs.loanAmount * 1.25; // Note: using your simplified logic here
  const totalInterest = totalEmiPaid - inputs.loanAmount;
  const totalInvested = inputs.propertyValue - inputs.loanAmount + totalEmiPaid;
  const netProfit = exitValue - totalInvested;

  const cagr = Math.pow(exitValue / inputs.propertyValue, 1 / inputs.years) - 1;

  return {
    exitValue: Math.round(exitValue),
    netProfit: Math.round(netProfit),
    totalInterest: Math.round(totalInterest),
    totalInvested: Math.round(totalInvested),
    breakEvenYear: netProfit > 0 ? 1 : inputs.years,
    cagr: (cagr * 100).toFixed(2),
    roi: ((netProfit / totalInvested) * 100).toFixed(2),
  };
}

/* -------------------------------------------
   MAIN COMPONENT
------------------------------------------- */
export default function PropertyInvestmentCalculator() {
  const [activeScenario, setActiveScenario] = useState("base");
  const [inputs, setInputs] = useState(SCENARIOS.base.inputs);

  /* ACCORDION STATES */
  const [showAnnualCosts, setShowAnnualCosts] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleScenarioSelect = (key) => {
    setActiveScenario(key);
    setInputs(SCENARIOS[key].inputs);
  };

  const updateInput = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  return (
    <div className="space-y-6 pb-12">
      {/* QUICK SCENARIOS */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-sm text-gray-700 mr-2">
            Quick Scenarios:
          </span>

          {Object.keys(SCENARIOS).map((key) => (
            <button
              key={key}
              onClick={() => handleScenarioSelect(key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${
                  activeScenario === key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-5 space-y-6">
          {/* PROPERTY & LOAN */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4 border-b pb-4">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Property & Loan</h2>
            </div>

            <div className="space-y-4">
              <Input label="Current Property Value" prefix="₹" value={inputs.propertyValue} onChange={(v) => updateInput("propertyValue", v)} />
              <Input label="Expected Annual Appreciation" prefix="%" value={inputs.appreciation} onChange={(v) => updateInput("appreciation", v)} />
              <Input label="Number of Years to Hold" prefix="Yrs" value={inputs.years} onChange={(v) => updateInput("years", v)} />
              <Input label="Loan Amount" prefix="₹" value={inputs.loanAmount} onChange={(v) => updateInput("loanAmount", v)} />
              <Input label="Annual Interest Rate" prefix="%" value={inputs.interestRate} onChange={(v) => updateInput("interestRate", v)} />
              <Input label="Loan Tenure" prefix="Yrs" value={inputs.tenure} onChange={(v) => updateInput("tenure", v)} />
            </div>
          </div>

          {/* ANNUAL COSTS + ADVANCED OPTIONS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
            {/* ANNUAL COSTS */}
            <div>
              <button
                onClick={() => setShowAnnualCosts(!showAnnualCosts)}
                className="w-full flex justify-between items-center p-5 font-bold text-gray-800 hover:bg-gray-50 rounded-t-xl transition-colors"
              >
                Annual Costs
                <span className={`transition-transform text-gray-500 ${showAnnualCosts ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {showAnnualCosts && (
                <div className="p-5 border-t bg-gray-50">
                  <table className="w-full text-sm border bg-white rounded-lg overflow-hidden">
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-gray-600">Maintenance</td>
                        <td className="p-3 text-right font-medium">₹50,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-gray-600">Property Tax</td>
                        <td className="p-3 text-right font-medium">₹30,000</td>
                      </tr>
                      <tr className="font-bold bg-gray-100 text-gray-800">
                        <td className="p-3">Total / Year</td>
                        <td className="p-3 text-right">₹80,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ADVANCED OPTIONS */}
            <div>
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full flex justify-between items-center p-5 font-bold text-gray-800 hover:bg-gray-50 rounded-b-xl transition-colors"
              >
                Advanced Options
                <span className={`transition-transform text-gray-500 ${showAdvancedOptions ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {showAdvancedOptions && (
                <div className="p-5 border-t bg-gray-50 space-y-3 text-sm text-gray-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-gray-800 focus:ring-gray-800" />
                    Include rental income
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-gray-800 focus:ring-gray-800" />
                    Include tax benefits
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-gray-800 focus:ring-gray-800" />
                    Early loan prepayment
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-xl font-bold mb-6 border-b pb-4 text-gray-800">Investment Summary & Takeaways</h3>

            <ul className="space-y-3 text-base text-gray-600 mb-8 bg-blue-50/50 p-5 rounded-lg border border-blue-100">
              <li className="flex justify-between items-center">
                <span>Property Value at Exit:</span>
                <b className="text-gray-900 text-lg">₹{results.exitValue.toLocaleString()}</b>
              </li>
              <li className="flex justify-between items-center border-t border-blue-200 pt-3">
                <span>Net Profit:</span>
                <b className="text-green-600 text-xl">₹{results.netProfit.toLocaleString()}</b>
              </li>
              <li className="flex justify-between items-center border-t border-blue-200 pt-3">
                <span>Break-even Timeline:</span>
                <b className="text-gray-900">Year {results.breakEvenYear}</b>
              </li>
            </ul>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Metric label="Net Profit" value={`₹${results.netProfit.toLocaleString()}`} highlight />
              <Metric label="CAGR" value={`${results.cagr}%`} />
              <Metric label="ROI" value={`${results.roi}%`} />
              <Metric label="Exit Value" value={`₹${results.exitValue.toLocaleString()}`} />
              <Metric label="Total Invested" value={`₹${results.totalInvested.toLocaleString()}`} />
              <Metric label="Interest Paid" value={`₹${results.totalInterest.toLocaleString()}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   SMALL COMPONENTS
------------------------------------------- */
function Input({ label, prefix, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{prefix}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all"
        />
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-lg sm:text-xl font-bold ${highlight ? "text-green-700" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
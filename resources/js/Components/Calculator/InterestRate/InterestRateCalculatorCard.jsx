import React, { useState } from "react";

/* ---------------------------------------------
   EMI HELPERS
--------------------------------------------- */
const calculateEMI = (P, r, n) => {
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const findMonthlyRate = (emi, P, n) => {
  let low = 0;
  let high = 1;
  let mid = 0;

  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    const calc = calculateEMI(P, mid, n);
    calc > emi ? (high = mid) : (low = mid);
  }
  return mid;
};

export default function InterestRateCalculatorCard() {
  /* ---------------- STATE ---------------- */
  const [emi, setEmi] = useState(20000);
  const [loanAmount, setLoanAmount] = useState(400000);
  const [tenure, setTenure] = useState(2);
  const [tenureUnit, setTenureUnit] = useState("years");
  const [result, setResult] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  /* ---------------- CALCULATE ---------------- */
  const handleCalculate = () => {
    const months =
      tenureUnit === "years" ? tenure * 12 : tenure;

    const monthlyRate = findMonthlyRate(
      Number(emi),
      Number(loanAmount),
      months
    );

    const annualRate = monthlyRate * 12 * 100;
    const totalPaid = emi * months;
    const totalInterest = totalPaid - loanAmount;

    setResult({
      annualRate,
      monthlyRate: monthlyRate * 100,
      totalInterest,
      totalPaid,
      emi,
    });

    setHasCalculated(true);
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
  };

  /* ---------------- DONUT ---------------- */
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = hasCalculated
    ? Math.min(result.annualRate / 20, 1) // scale to 20%
    : 0;
  const dash = progress * circumference;

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Interest Rate Calculator
          </h2>

          <div className="space-y-6 pt-4 border-t border-gray-200">
            <InputField label="Monthly EMI (₹)" value={emi} onChange={setEmi} />
            <InputField label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} />

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Loan Tenure
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-l-lg px-4 py-3 text-lg font-semibold"
                />
                <select
                  value={tenureUnit}
                  onChange={(e) => setTenureUnit(e.target.value)}
                  className="border border-gray-300 rounded-r-lg px-3 bg-gray-100"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleCalculate}
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 shadow-lg"
            >
              Calculate Interest Rate
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Interest Overview
          </h3>

          {/* DONUT */}
          <div className="relative w-[180px] h-[180px] mb-6">
            <svg viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="20"
                fill="none"
              />
              {hasCalculated && (
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#374151"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${dash} ${circumference}`}
                  transform="rotate(-90 90 90)"
                  strokeLinecap="round"
                />
              )}
            </svg>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              {!hasCalculated ? (
                <span className="text-gray-500 font-medium">
                  Click Calculate
                </span>
              ) : (
                <div>
                  <span className="block text-xs text-gray-500">
                    Annual Rate
                  </span>
                  <span className="block text-2xl font-bold text-gray-800">
                    {result.annualRate.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {!hasCalculated ? (
            <p className="text-gray-500 font-medium">
              Results appear after calculation
            </p>
          ) : (
            <div className="w-full space-y-3">
              <Stat label="Monthly Rate" value={`${result.monthlyRate.toFixed(4)}%`} />
              <Stat
                label="Total Interest"
                value={`₹${Math.round(result.totalInterest).toLocaleString("en-IN")}`}
              />
              <Stat
                label="Total Paid"
                value={`₹${Math.round(result.totalPaid).toLocaleString("en-IN")}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   INPUT FIELD
--------------------------------------------- */
function InputField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold"
      />
    </div>
  );
}

/* ---------------------------------------------
   STAT
--------------------------------------------- */
function Stat({ label, value }) {
  return (
    <div className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}

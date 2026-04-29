import React, { useState } from "react";

const formatNumber = (num) => `₹${Math.round(num).toLocaleString("en-IN")}`;

const calculateTenureMonths = (P, EMI, annualRate) => {
  const r = annualRate / 12 / 100;
  if (EMI <= P * r) return null; // EMI is too low to cover even the interest
  return Math.log(EMI / (EMI - P * r)) / Math.log(1 + r);
};

const addMonthsToDate = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

export default function TenureCalculator() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [emi, setEmi] = useState(25000);
  const [interestRate, setInterestRate] = useState(8.5);

  const [result, setResult] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const months = calculateTenureMonths(
      Number(loanAmount),
      Number(emi),
      Number(interestRate)
    );

    if (!months || !isFinite(months)) {
      setResult(null);
      setHasCalculated(true);
      return;
    }

    const totalMonths = Math.ceil(months);
    const years = Math.floor(totalMonths / 12);
    const remMonths = totalMonths % 12;

    const totalPaid = emi * totalMonths;
    const totalInterest = totalPaid - loanAmount;

    setResult({
      years,
      remMonths,
      totalMonths,
      totalInterest,
      endDate: addMonthsToDate(totalMonths),
    });

    setHasCalculated(true);
  };

  const handleReset = () => {
    setLoanAmount(3000000);
    setEmi(25000);
    setInterestRate(8.5);
    setResult(null);
    setHasCalculated(false);
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = hasCalculated && result ? Math.min(result.totalMonths / (30 * 12), 1) : 0;
  const dash = progress * circumference;

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-3">
          <div className="space-y-6 pt-4 border-t border-gray-200">
            <InputField label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} />
            <InputField label="Monthly EMI (₹)" value={emi} onChange={setEmi} />
            <InputField label="Interest Rate (% p.a.)" value={interestRate} onChange={setInterestRate} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleCalculate}
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition shadow-lg"
            >
              Calculate Tenure
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Real Wealth Comparison</h3>

          <div className="relative w-[180px] h-[180px] mb-6">
            <svg viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} stroke="#e5e7eb" strokeWidth="18" fill="none" />
              {hasCalculated && result && (
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#374151"
                  strokeWidth="18"
                  fill="none"
                  strokeDasharray={`${dash} ${circumference}`}
                  transform="rotate(-90 90 90)"
                  strokeLinecap="round"
                />
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {!hasCalculated ? (
                <span className="text-gray-500 font-medium">Calculate <br /> Loan Tenure</span>
              ) : !result ? (
                <span className="text-red-600 font-semibold text-sm">EMI Too Low</span>
              ) : (
                <>
                  <span className="text-xs text-gray-500">Loan Duration</span>
                  <span className="text-xl font-bold text-gray-800">
                    {result.years}y {result.remMonths}m
                  </span>
                </>
              )}
            </div>
          </div>

          {!hasCalculated && (
            <p className="text-gray-500 font-medium text-center">Results appear only after calculation</p>
          )}

          {hasCalculated && !result && (
            <p className="text-red-600 font-semibold text-center">EMI is too low to repay this loan</p>
          )}

          {hasCalculated && result && (
            <div className="w-full space-y-3">
              <Stat label="Total Interest Paid" value={formatNumber(result.totalInterest)} />
              <Stat label="Loan Closure Date" value={result.endDate} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}
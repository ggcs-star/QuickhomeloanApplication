import React, { useState } from "react";

const formatINR = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

function calculateEMI(P, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (!r) return P / months;
  return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function PrepaymentCalculator() {
  const [form, setForm] = useState({
    outstandingLoan: 3500000,
    currentEmi: 30000,
    interestRate: 8.5,
    remainingTenure: 240,
    prepaymentAmount: 200000,
    prepaymentType: "reduceTenure",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "radio" ? value : Number(value),
    });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const {
      outstandingLoan,
      interestRate,
      remainingTenure,
      prepaymentAmount,
    } = form;

    const originalEmi = calculateEMI(
      outstandingLoan,
      interestRate,
      remainingTenure
    );

    const originalInterest = originalEmi * remainingTenure - outstandingLoan;
    const newPrincipal = outstandingLoan - prepaymentAmount;

    /* -------- Reduce Tenure -------- */
    let balance = newPrincipal;
    let months = 0;
    const r = interestRate / 12 / 100;

    while (balance > 0 && months < 600) {
      balance = balance + balance * r - originalEmi;
      months++;
    }

    const tenureSaved = remainingTenure - months;
    const interestReduceTenure = originalEmi * months - newPrincipal;

    /* -------- Reduce EMI -------- */
    const newEmi = calculateEMI(newPrincipal, interestRate, remainingTenure);
    const interestReduceEmi = newEmi * remainingTenure - newPrincipal;

    setResult({
      originalInterest,
      reduceTenure: {
        interestSaved: originalInterest - interestReduceTenure,
        newEmi: originalEmi,
        newTenure: months,
        tenureReduced: tenureSaved,
        totalInterest: interestReduceTenure,
      },
      reduceEmi: {
        interestSaved: originalInterest - interestReduceEmi,
        newEmi,
        newTenure: remainingTenure,
        tenureReduced: 0,
        totalInterest: interestReduceEmi,
      },
    });
  };

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ================= LEFT FORM ================= */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleCalculate} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Enter Loan Details
              </h2>

              <Input label="Outstanding Loan Amount" prefix="₹" name="outstandingLoan" value={form.outstandingLoan} onChange={handleChange} />
              <Input label="Current EMI" prefix="₹" name="currentEmi" value={form.currentEmi} onChange={handleChange} />
              <Input label="Annual Interest Rate (%)" name="interestRate" value={form.interestRate} onChange={handleChange} />
              <Input label="Remaining Tenure (Months)" name="remainingTenure" value={form.remainingTenure} onChange={handleChange} />
              <Input label="Prepayment Amount" prefix="₹" name="prepaymentAmount" value={form.prepaymentAmount} onChange={handleChange} />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose Prepayment Type
                </label>
                <div className="flex gap-4">
                  <Radio label="Reduce Tenure" value="reduceTenure" checked={form.prepaymentType} onChange={handleChange} />
                  <Radio label="Reduce EMI" value="reduceEmi" checked={form.prepaymentType} onChange={handleChange} />
                </div>
              </div>

              <button className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-900">
                Calculate Prepayment Impact
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT RESULT ================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* -------- Donut Summary -------- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[320px]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Prepayment Summary
            </h3>

            <div className="relative w-[180px] h-[180px] mb-4">
              <svg viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="70" stroke="#e5e7eb" strokeWidth="18" fill="none" />
                {result && (
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke="#374151"
                    strokeWidth="18"
                    fill="none"
                    strokeDasharray="328 440"
                    transform="rotate(-90 90 90)"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {!result ? (
                  <span className="text-gray-500 font-medium">
                    Calculate <br /> Prepayment Impact
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-gray-500">Max Interest Saved</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatINR(result.reduceTenure.interestSaved)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {!result && (
              <p className="text-gray-500 text-sm text-center">
                Results appear after calculation
              </p>
            )}
          </div>

          {/* -------- Impact Analysis -------- */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                Prepayment Impact Analysis
              </h2>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-4 rounded mb-6">
                <h3 className="font-bold">
                  Recommendation: Reduce Tenure for Maximum Savings!
                </h3>
                <p className="text-sm mt-1">
                  You save an additional{" "}
                  <strong className="text-green-600">
                    {formatINR(result.reduceTenure.interestSaved - result.reduceEmi.interestSaved)}
                  </strong>{" "}
                  compared to reducing EMI.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Option 1: Reduce Tenure"
                  badge="Recommended"
                  data={result.reduceTenure}
                />
                <ResultCard
                  title="Option 2: Reduce EMI"
                  data={result.reduceEmi}
                />
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
                <h4 className="font-semibold mb-2">Before Prepayment</h4>
                <Row label="Total Interest Payable" value={formatINR(result.originalInterest)} />
                <Row label="Original Tenure" value={`${form.remainingTenure / 12} years`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   UI COMPONENTS
--------------------------------------------- */
function Input({ label, prefix, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          {...props}
          type="number"
          className={`w-full px-4 py-2 border rounded-md ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
}

function Radio({ label, value, checked, onChange }) {
  return (
    <label className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer flex-1 ${
      checked === value ? "border-gray-800 bg-gray-100" : "border-gray-300"
    }`}>
      <input type="radio" name="prepaymentType" value={value} checked={checked === value} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function ResultCard({ title, badge, data }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold text-lg flex justify-between">
        {title}
        {badge && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </h3>
      <div className="mt-4 space-y-3 text-sm">
        <Row label="Interest Saved" value={formatINR(data.interestSaved)} highlight />
        <Row label="New EMI" value={formatINR(data.newEmi)} />
        <Row label="New Tenure" value={`${Math.floor(data.newTenure / 12)}y ${data.newTenure % 12}m`} />
        <Row label="Tenure Reduced By" value={`${Math.floor(data.tenureReduced / 12)}y ${data.tenureReduced % 12}m`} />
        <Row label="Total Interest Payable" value={formatINR(data.totalInterest)} border />
      </div>
    </div>
  );
}

function Row({ label, value, highlight, border }) {
  return (
    <div className={`flex justify-between ${border ? "pt-2 border-t" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${highlight ? "text-green-600" : ""}`}>
        {value}
      </span>
    </div>
  );
}
import React, { useState } from "react";

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */
const calculateEMI = (P, annualRate, years) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const formatCurrency = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

/* -------------------------------------------------
   MAIN COMPONENT
------------------------------------------------- */
export default function FinancialComparisonCalculator() {
  const [common, setCommon] = useState({
    loanTenure: 20,
    interestRate: 8.5,
    downPaymentRate: 20,
  });

  const [rtmPrice, setRtmPrice] = useState(5000000);
  const [ucPrice, setUcPrice] = useState(4500000);
  const [constructionTimeline, setConstructionTimeline] = useState(24);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [rentIncreaseRate, setRentIncreaseRate] = useState(5);

  const [disbursements, setDisbursements] = useState([
    { month: 0, percent: 20 },
    { month: 6, percent: 30 },
    { month: 12, percent: 30 },
    { month: 18, percent: 20 },
  ]);

  const [results, setResults] = useState(null);

  /* ---------------- HANDLERS ---------------- */
  const handleCommonChange = (e) => {
    setCommon({ ...common, [e.target.name]: Number(e.target.value) });
  };

  const updateDisbursement = (index, field, value) => {
    const updated = [...disbursements];
    updated[index][field] = Number(value);
    setDisbursements(updated);
  };

  const removeDisbursement = (index) => {
    setDisbursements(disbursements.filter((_, i) => i !== index));
  };

  const addDisbursement = () => {
    setDisbursements([...disbursements, { month: 0, percent: 0 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const downPayment = (rtmPrice * common.downPaymentRate) / 100;
    const loanAmount = rtmPrice - downPayment;
    const emi = calculateEMI(loanAmount, common.interestRate, common.loanTenure);

    const totalPaid = emi * common.loanTenure * 12;
    const totalInterest = totalPaid - loanAmount;

    setResults({
      loanAmount,
      emi,
      totalPaid,
      totalInterest,
      annualRate: common.interestRate,
    });
  };

  const totalPercent = disbursements.reduce((sum, d) => sum + d.percent, 0);

  /* ---------------- DONUT ---------------- */
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = results ? Math.min(results.annualRate / 25, 1) : 0;
  const dash = progress * circumference;

  return (
    <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* COMMON INPUTS */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Common Inputs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Loan Tenure" suffix="Yrs" name="loanTenure" value={common.loanTenure} onChange={handleCommonChange} />
                <Input label="Annual Interest Rate" suffix="%" name="interestRate" value={common.interestRate} onChange={handleCommonChange} />
                <Input label="Down Payment" suffix="%" name="downPaymentRate" value={common.downPaymentRate} onChange={handleCommonChange} />
              </div>
            </div>

            {/* PROPERTY INPUTS */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Property Specific Inputs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Ready-to-Move Property</h4>
                  <Input label="Property Price" suffix="₹" value={rtmPrice} onChange={(e) => setRtmPrice(+e.target.value)} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Under Construction Property</h4>
                  <Input label="Property Price" suffix="₹" value={ucPrice} onChange={(e) => setUcPrice(+e.target.value)} />
                  <Select label="Construction Period" value={constructionTimeline} onChange={(e) => setConstructionTimeline(+e.target.value)} options={[12, 24, 36, 48, 60]} />
                  <Input label="Starting Monthly Rent" suffix="₹/mo" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} />
                  <Input label="Annual Rent Increase" suffix="%" value={rentIncreaseRate} onChange={(e) => setRentIncreaseRate(+e.target.value)} />
                </div>
              </div>
            </div>

            {/* DISBURSEMENTS */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  UC Loan Disbursement Phases
                </h3>
                <span className={`text-sm font-bold px-3 py-1 rounded ${totalPercent === 100 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  Total: {totalPercent}%
                </span>
              </div>

              <div className="space-y-3">
                {disbursements.map((d, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1 text-center text-gray-500">{i + 1}</div>
                    <div className="col-span-5">
                      <Input label="Disbursement Month" suffix="Mo" value={d.month} onChange={(e) => updateDisbursement(i, "month", e.target.value)} />
                    </div>
                    <div className="col-span-5">
                      <Input label="Percentage of Loan" suffix="%" value={d.percent} onChange={(e) => updateDisbursement(i, "percent", e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <button type="button" onClick={() => removeDisbursement(i)} className="mt-6 text-gray-400 hover:text-red-600 font-bold text-xl">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addDisbursement} className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900">
                + Add Disbursement Phase
              </button>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full md:w-1/2 px-12 py-4 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-900">
                Calculate & Compare
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Interest Overview</h3>

          {/* DONUT */}
          <div className="relative w-[180px] h-[180px] mb-6">
            <svg viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} stroke="#e5e7eb" strokeWidth="20" fill="none" />
              {results && (
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

            <div className="absolute inset-0 flex items-center justify-center text-center">
              {!results ? (
                <span className="text-gray-500 text-sm">Calculate to view results</span>
              ) : (
                <div>
                  <span className="block text-xs text-gray-500">Annual Rate</span>
                  <span className="block text-2xl font-bold text-gray-800">{results.annualRate}%</span>
                </div>
              )}
            </div>
          </div>

          {results && (
            <div className="w-full space-y-3">
              <Stat label="Loan Amount" value={formatCurrency(results.loanAmount)} />
              <Stat label="Monthly EMI" value={formatCurrency(results.emi)} />
              <Stat label="Total Interest" value={formatCurrency(results.totalInterest)} />
              <Stat label="Total Paid" value={formatCurrency(results.totalPaid)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------
   REUSABLE COMPONENTS
------------------------------------------------- */
const Input = ({ label, suffix, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <input type="number" min="0" className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-base font-semibold focus:ring-2 focus:ring-gray-800 outline-none" {...props} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">{suffix}</span>}
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base font-semibold focus:ring-2 focus:ring-gray-800 outline-none bg-white" {...props}>
      {options.map((o) => (
        <option key={o} value={o}>{o} Months</option>
      ))}
    </select>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="flex justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);
import { useState } from "react";

const LOAN_PRESETS = {
  "Home Buyer": { amount: 5000000, rate: 8.5, tenure: 20 },
  "Car Loan": { amount: 800000, rate: 9.5, tenure: 5 },
  "Personal Loan": { amount: 150000, rate: 13.5, tenure: 3 },
};

const types = ["Home Buyer", "Car Loan", "Personal Loan"];

function calculateEMI(P, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function EmiCalculator() {
  const [loanType, setLoanType] = useState("Home Buyer");
  const [amount, setAmount] = useState(LOAN_PRESETS["Home Buyer"].amount);
  const [rate, setRate] = useState(LOAN_PRESETS["Home Buyer"].rate);
  const [tenure, setTenure] = useState(LOAN_PRESETS["Home Buyer"].tenure);

  const [emi, setEmi] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const months = tenure * 12;

  const handleLoanTypeChange = (type) => {
    const preset = LOAN_PRESETS[type];
    setLoanType(type);
    setAmount(preset.amount);
    setRate(preset.rate);
    setTenure(preset.tenure);
    setEmi(null);
    setHasCalculated(false);
  };

  const handleCalculate = () => {
    setEmi(calculateEMI(Number(amount), Number(rate), Number(tenure)));
    setHasCalculated(true);
  };

  const handleReset = () => {
    handleLoanTypeChange("Home Buyer");
  };

  const totalPayment = hasCalculated ? emi * months : 0;
  const totalInterest = hasCalculated ? totalPayment - amount : 0;

  return (
    <section className="bg-white p-4 rounded-2xl shadow-xl">
      {/* LEFT PART */}
      <div>
        <LoanTypeSelector
          loanType={loanType}
          onChange={handleLoanTypeChange}
        />

        <div className="space-y-6 pt-6 border-t mt-4">
          <InputField label="Loan Amount (₹)" value={amount} onChange={setAmount} />
          <InputField label="Annual Interest Rate (%)" value={rate} onChange={setRate} />
          <InputField label="Loan Tenure (Years)" value={tenure} onChange={setTenure} />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCalculate}
            className="w-full bg-gray-800 text-white py-3 rounded-lg"
          >
            Calculate EMI
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 px-4 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* RIGHT PART (Chart) */}
      <div className="mt-6">
        <EmiChart
          emi={emi}
          amount={amount}
          totalPayment={totalPayment}
          totalInterest={totalInterest}
          hasCalculated={hasCalculated}
        />
      </div>
    </section>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border rounded-lg px-4 py-3 text-lg font-semibold"
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between bg-white p-3 rounded-lg shadow-sm">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function LoanTypeSelector({ loanType, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {types.map((type) => {
        const active = loanType === type;

        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`
              text-xs sm:text-sm
              py-2 px-2 sm:px-4
              rounded-full
              w-full
              transition-all duration-200
              active:scale-95
              ${
                active
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}

function EmiChart({
  emi,
  amount,
  totalPayment,
  totalInterest,
  hasCalculated,
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const progress = totalPayment ? amount / totalPayment : 0;
  const dash = progress * circumference;

  const format = (v) => `₹${Math.round(v || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center">
      <h3 className="text-lg font-bold mb-4">
        Loan Repayment Details
      </h3>

      {!hasCalculated ? (
        <div>
          <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 border flex items-center justify-center">
            Calculate EMI
          </div>
          <p className="mt-3">Repayment Breakdown</p>
        </div>
      ) : (
        <>
          <div className="relative w-[160px] h-[160px] mx-auto mb-4">
            <svg viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} stroke="#e5e7eb" strokeWidth="20" fill="none" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#374151"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 90 90)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-xs">Monthly EMI</span>
              <span className="text-xl font-bold">{format(emi)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Stat label="Principal" value={format(amount)} />
            <Stat label="Total Interest" value={format(totalInterest)} />
            <Stat label="Total Payment" value={format(totalPayment)} />
          </div>
        </>
      )}
    </div>
  );
}
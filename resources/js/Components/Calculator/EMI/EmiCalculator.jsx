import { useState } from "react";
import InputField from "./InputField";
import Stat from "./Stat";
import LoanTypeSelector from "./LoanTypeSelector";
import EmiChart from "./EmiChart";

const LOAN_PRESETS = {
  "Home Buyer": { amount: 5000000, rate: 8.5, tenure: 20 },
  "Car Loan": { amount: 800000, rate: 9.5, tenure: 5 },
  "Personal Loan": { amount: 150000, rate: 13.5, tenure: 3 },
};

function calculateEMI(P, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) /
         (Math.pow(1 + r, n) - 1);
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
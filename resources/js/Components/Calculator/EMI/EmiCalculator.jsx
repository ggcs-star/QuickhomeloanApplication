  import { useState } from "react";
  import {
    ArrowLeft,
    RotateCcw,
    BookOpenText,
    Home,
    Car,
    UserRound,
    Pencil,
    WalletCards,
    BarChart3,
    ReceiptText,
  } from "lucide-react";

  import InsightsLayout from "@/Components/Common/InsightsLayout";
  import { EMI_INSIGHTS } from "./emiInsightsData";

  const LOAN_PRESETS = {
    "Home Loan": {
      amount: 5000000,
      rate: 8.5,
      tenure: 20,
    },

    "Personal Loan": {
      amount: 150000,
      rate: 13.5,
      tenure: 3,
    },

    "Car Loan": {
      amount: 800000,
      rate: 9.5,
      tenure: 5,
    },
  };

  const types = [
    "Home Loan",
    "Personal Loan",
    "Car Loan",
  ];

  function calculateEMI(P, annualRate, years) {
    const r = annualRate / 12 / 100;
    const n = years * 12;

    if (r === 0) return P / n;

    return (
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1)
    );
  }

  export default function EmiCalculator() {
    const [loanType, setLoanType] =
      useState("Home Loan");

    const [amount, setAmount] = useState(
      LOAN_PRESETS["Home Loan"].amount
    );

    const [rate, setRate] = useState(
      LOAN_PRESETS["Home Loan"].rate
    );

    const [tenure, setTenure] = useState(
      LOAN_PRESETS["Home Loan"].tenure
    );

    const handleLoanTypeChange = (type) => {
      const preset = LOAN_PRESETS[type];

      setLoanType(type);
      setAmount(preset.amount);
      setRate(preset.rate);
      setTenure(preset.tenure);
    };

    const emi = calculateEMI(
      Number(amount),
      Number(rate),
      Number(tenure)
    );

    const months = tenure * 12;

    const totalPayment = emi * months;

    const totalInterest =
      totalPayment - amount;

    return (
      <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

  
        {/* LOAN TYPES */}
        <div className="px-3 mt-3">

          <LoanTypeSelector
            loanType={loanType}
            onChange={handleLoanTypeChange}
          />

        </div>

        {/* HERO CARD */}
        <div className="px-3 mt-3">

          <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

            <div className="relative z-10 max-w-[58%]">

              <p className="text-[10px] opacity-90 font-medium">
                Your Estimated EMI
              </p>

              <div className="flex items-end gap-1 mt-1">

                <h2 className="text-[34px] leading-none font-black tracking-[-1px]">
                  ₹{Math.round(emi).toLocaleString("en-IN")}
                </h2>

                <span className="text-[10px] opacity-90 mb-[5px]">
                  / month
                </span>

              </div>

              <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

                <span>
                  {rate}% Interest Rate
                </span>

                <span>•</span>

                <span>
                  {tenure} Years Tenure
                </span>

              </div>

            </div>

            <img
              src="/images/house.png"
              alt="house"
              className="absolute right-0 bottom-0 h-[106px] w-auto object-contain"
            />

          </div>

        </div>

        {/* INPUTS */}
        <div className="px-3 mt-3 space-y-2">

          <InputField
            label="Loan Amount"
            value={amount}
            onChange={setAmount}
            min={100000}
            max={10000000}
            step={50000}
            format="currency"
          />

          <InputField
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={1}
            max={15}
            step={0.1}
            format="percent"
          />

          <InputField
            label="Loan Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
            format="year"
          />

        </div>

        {/* SUMMARY */}
        <div className="px-3 mt-3">

          <EmiChart
            emi={emi}
            amount={amount}
            totalPayment={totalPayment}
            totalInterest={totalInterest}
          />

        </div>

        {/* INSIGHTS */}
        <div className="mt-3">

          <InsightsLayout
            title=""
            sections={EMI_INSIGHTS}
          />

        </div>

      </section>
    );
  }
function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}) {
  const [editing, setEditing] =
    useState(false);

  const [tempValue, setTempValue] =
    useState(value);

  const displayValue = () => {
    if (format === "currency") {
      return `₹${Number(value).toLocaleString(
        "en-IN"
      )}`;
    }

    if (format === "percent") {
      return `${value}%`;
    }

    return `${value} Years`;
  };

  const saveValue = () => {
    let finalValue = Number(tempValue);

    if (isNaN(finalValue)) {
      finalValue = min;
    }

    if (finalValue < min) {
      finalValue = min;
    }

    if (finalValue > max) {
      finalValue = max;
    }

    onChange(finalValue);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          <p className="text-[11px] text-gray-500">
            {label}
          </p>

          {!editing ? (
            <h3 className="text-[16px] leading-tight font-black text-[#081c4b] mt-2 break-words">
              {displayValue()}
            </h3>
          ) : (
            <div className="flex items-center gap-2 mt-2">

              <input
                type="number"
                value={tempValue}
                min={min}
                max={max}
                step={step}
                autoFocus
                onChange={(e) =>
                  setTempValue(e.target.value)
                }
                className="
                  h-9
                  flex-1
                  rounded-xl
                  border border-[#d9e2f2]
                  px-3
                  text-[14px]
                  font-semibold
                  outline-none
                  focus:border-blue-500
                "
              />

              <button
                onClick={saveValue}
                className="
                  h-9 px-3
                  rounded-xl
                  bg-[#001B5E]
                  text-white
                  text-[12px]
                  font-semibold
                "
              >
                OK
              </button>

            </div>
          )}

        </div>

        {!editing && (
          <button
            onClick={() => {
              setEditing(true);
              setTempValue(value);
            }}
            className="
              w-8 h-8
              rounded-xl
              bg-[#f5f7fd]
              flex items-center justify-center
              text-gray-500
              shrink-0
            "
          >
            <Pencil size={14} />
          </button>
        )}

      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full mt-3 accent-blue-600"
      />

      <div className="flex justify-between text-[10px] text-gray-400 mt-1">

        <span>
          {format === "currency"
            ? "₹1L"
            : format === "percent"
            ? "1%"
            : "1 Year"}
        </span>

        <span>
          {format === "currency"
            ? "₹1Cr"
            : format === "percent"
            ? "15%"
            : "30 Years"}
        </span>

      </div>

    </div>
  );
}
  function LoanTypeSelector({
    loanType,
    onChange,
  }) {
    return (
      <div className="grid grid-cols-3 gap-[10px]">

        {types.map((type) => {

          const active =
            loanType === type;

          const Icon =
            type === "Home Loan"
              ? Home
              : type === "Car Loan"
              ? Car
              : UserRound;

          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`
                h-[42px]
                rounded-full
                text-[11px]
                font-semibold
                transition-all
                flex items-center justify-center gap-2
                border
                ${
                  active
                    ? "bg-[#001B5E] text-white border-[#001B5E]"
                    : "bg-white text-[#081c4b] border-[#edf1f7]"
                }
              `}
            >

              <Icon size={14} />

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
  }) {

    const radius = 58;

    const circumference =
      2 * Math.PI * radius;

    const progress =
      amount / totalPayment;

    const dash =
      progress * circumference;

    const format = (v) =>
      `₹${Math.round(v).toLocaleString(
        "en-IN"
      )}`;

    const principalPercent = (
      (amount / totalPayment) *
      100
    ).toFixed(1);

    const interestPercent = (
      (totalInterest / totalPayment) *
      100
    ).toFixed(1);

    return (
      <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

        {/* TITLE */}
        <h3 className="text-[15px] font-bold text-[#081c4b] mb-3">
          Your Loan Summary
        </h3>

        <div className="flex gap-3">

          {/* LEFT CHART */}
          <div className="relative w-[118px] h-[118px] shrink-0">

            <svg
              viewBox="0 0 180 180"
              className="w-full h-full"
            >

              {/* GREEN */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#22c55e"
                strokeWidth="16"
                fill="none"
              />

              {/* BLUE */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#2563eb"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 90 90)"
                strokeLinecap="butt"
              />

            </svg>

            {/* CENTER */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">

              <span className="text-[8px] text-gray-500 leading-tight">
                Total Payment
              </span>

              <h4 className="text-[12px] font-black text-[#081c4b] leading-tight mt-1">
                {format(totalPayment)}
              </h4>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 min-w-0">

            {/* TOP STATS */}
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#edf1f7]">

              <SummaryStat
                icon={
                  <WalletCards
                    size={14}
                    className="text-blue-600"
                    strokeWidth={2.3}
                  />
                }
                iconBg="bg-blue-50"
                label="Monthly EMI"
                value={format(emi)}
              />

              <SummaryStat
                icon={
                  <BarChart3
                    size={14}
                    className="text-green-600"
                    strokeWidth={2.3}
                  />
                }
                iconBg="bg-green-50"
                label="Total Interest"
                value={format(totalInterest)}
              />

              <SummaryStat
                icon={
                  <ReceiptText
                    size={14}
                    className="text-orange-500"
                    strokeWidth={2.3}
                  />
                }
                iconBg="bg-orange-50"
                label="Total Payment"
                value={format(totalPayment)}
              />

            </div>

            {/* BREAKDOWN */}
            <div className="pt-3 space-y-2">

              {/* PRINCIPAL */}
              <div className="flex items-center justify-between text-[11px]">

                <div className="flex items-center gap-2">

                  <div className="w-2 h-2 rounded-full bg-blue-600" />

                  <span className="text-[#081c4b]">
                    Principal Amount
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="font-semibold text-[#081c4b]">
                    {format(amount)}
                  </span>

                  <span className="text-gray-500">
                    ({principalPercent}%)
                  </span>

                </div>

              </div>

              {/* INTEREST */}
              <div className="flex items-center justify-between text-[11px]">

                <div className="flex items-center gap-2">

                  <div className="w-2 h-2 rounded-full bg-green-500" />

                  <span className="text-[#081c4b]">
                    Total Interest
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="font-semibold text-[#081c4b]">
                    {format(totalInterest)}
                  </span>

                  <span className="text-gray-500">
                    ({interestPercent}%)
                  </span>

                </div>

              </div>

            </div>

            {/* ARROW */}
            <div className="flex justify-end mt-[2px]">

              <button className="text-[#081c4b] text-[18px] leading-none font-semibold">
                ›
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  function SummaryStat({
    label,
    value,
    icon,
    iconBg,
  }) {
    return (
      <div className="text-center relative">

        <div
          className={`
            w-8 h-8 rounded-[10px]
            ${iconBg}
            flex items-center justify-center
            mx-auto mb-1
          `}
        >
          {icon}
        </div>

        <p className="text-[8px] text-gray-500 leading-tight whitespace-nowrap">
          {label}
        </p>

        <h4 className="text-[11px] font-black text-[#081c4b] mt-[3px] leading-tight">
          {value}
        </h4>

      </div>
    );
  }
  function Stat({
    label,
    value,
  }) {
    return (
      <div className="bg-[#f8faff] rounded-xl p-2.5">

        <p className="text-[9px] text-gray-500">
          {label}
        </p>

        <h4 className="text-[13px] font-black text-[#081c4b] mt-1 break-words leading-tight">
          {value}
        </h4>

      </div>
    );
  }
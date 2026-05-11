import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  BarChart3,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { LOAN_INSIGHTS } from "./LoanInsightsData";
/* HELPERS */
const formatCurrency = (num) =>
  num
    ? `₹${Math.round(num).toLocaleString("en-IN")}`
    : "₹0";

const getFoirLimit = (income) => {
  if (income <= 30000) return 0.4;
  if (income <= 60000) return 0.5;
  return 0.6;
};

const calculateLoanFromEmi = (
  emi,
  annualRate,
  years
) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;

  if (r === 0) return emi * n;

  return (
    (emi * (Math.pow(1 + r, n) - 1)) /
    (r * Math.pow(1 + r, n))
  );
};

const types = [
  "Home Loan",
  "Personal Loan",
  "Car Loan",
];

export default function LoanEligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] =
    useState(80000);

  const [existingEmis, setExistingEmis] =
    useState(10000);

  const [loanType, setLoanType] =
    useState("home");

  const [method, setMethod] =
    useState("foir");

  const [interestRate, setInterestRate] =
    useState(8.5);

  const [tenure, setTenure] =
    useState(20);

  const [assetValue, setAssetValue] =
    useState(4500000);

  const [ltvRatio, setLtvRatio] =
    useState(80);

  const [result, setResult] =
    useState(null);

  /* LIVE PREVIEW */

  let previewEligibleLoan = 0;

  if (method === "foir") {

    const eligibleEmi =
      monthlyIncome *
        getFoirLimit(monthlyIncome) -
      Number(existingEmis);

    if (eligibleEmi > 0) {

      const loanFromIncome =
        calculateLoanFromEmi(
          eligibleEmi,
          interestRate,
          tenure
        );

      const ltvCap =
        (assetValue * ltvRatio) / 100;

      previewEligibleLoan =
        Math.min(
          loanFromIncome,
          ltvCap
        );
    }

  } else {

    const multiplier =
      loanType === "home"
        ? 60
        : loanType === "car"
        ? 36
        : 24;

    previewEligibleLoan =
      monthlyIncome * multiplier;
  }

  /* CALCULATE */

  const handleCalculate = () => {
    let eligibleEmi = 0;

    if (method === "foir") {

      eligibleEmi =
        monthlyIncome *
          getFoirLimit(monthlyIncome) -
        Number(existingEmis);

    } else {

      const multiplier =
        loanType === "home"
          ? 60
          : loanType === "car"
          ? 36
          : 24;

      setResult({
        eligibleLoan:
          monthlyIncome * multiplier,
        maxEmi: null,
      });

      return;
    }

    if (eligibleEmi <= 0) {

      setResult({
        error:
          "Existing EMIs are too high for eligibility.",
      });

      return;
    }

    const loanFromIncome =
      calculateLoanFromEmi(
        eligibleEmi,
        interestRate,
        tenure
      );

    const ltvCap =
      (assetValue * ltvRatio) / 100;

    setResult({
      maxEmi: eligibleEmi,
      eligibleLoan: Math.min(
        loanFromIncome,
        ltvCap
      ),
    });
  };

  /* CHART */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    previewEligibleLoan && assetValue
      ? Math.min(
          previewEligibleLoan /
            assetValue,
          1
        )
      : 0;

  const dash =
    progress * circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

    

      {/* HERO CARD */}
      <div className="px-3 mt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[65%]">

            <p className="text-[10px] opacity-90 font-medium">
              Your Eligible Loan
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[30px] leading-none font-black tracking-[-1px]">

                {formatCurrency(
                  previewEligibleLoan
                )}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {interestRate}% Interest
              </span>

              <span>•</span>

              <span>
                {tenure} Years
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
          label="Monthly Income"
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          min={10000}
          max={1000000}
          step={5000}
          format="currency"
        />

        <InputField
          label="Existing EMIs"
          value={existingEmis}
          onChange={setExistingEmis}
          min={0}
          max={500000}
          step={1000}
          format="currency"
        />

        <SelectField
          label="Calculation Method"
          value={method}
          onChange={setMethod}
          options={[
            {
              value: "foir",
              label: "FOIR Method",
            },
            {
              value: "multiplier",
              label:
                "Multiplier Method",
            },
          ]}
        />

        <InputField
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={20}
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

        <InputField
          label="Asset Value"
          value={assetValue}
          onChange={setAssetValue}
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="LTV Ratio"
          value={ltvRatio}
          onChange={setLtvRatio}
          min={50}
          max={100}
          step={1}
          format="percent"
        />

        <button
          onClick={handleCalculate}
          className="
            w-full h-[48px]
            rounded-[14px]
            bg-[#001B5E]
            text-white
            font-semibold
            text-[14px]
            shadow-sm
            active:scale-[0.99]
            transition-all
          "
        >
          Calculate Eligibility
        </button>

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <h3 className="text-[15px] font-bold text-[#081c4b] mb-3">
            Eligibility Summary
          </h3>

          <div className="flex gap-3">

            {/* CHART */}
            <div className="relative w-[118px] h-[118px] shrink-0">

              <svg
                viewBox="0 0 180 180"
                className="w-full h-full"
              >

                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />

                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#2563eb"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${dash} ${circumference}`}
                  transform="rotate(-90 90 90)"
                  strokeLinecap="round"
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">

                <span className="text-[8px] text-gray-500">
                  Eligible Loan
                </span>

                <h4 className="text-[12px] font-black text-[#081c4b] leading-tight mt-1">

                  {formatCurrency(
                    previewEligibleLoan
                  )}

                </h4>

              </div>

            </div>

            {/* STATS */}
            <div className="flex-1 min-w-0">

              <div className="grid grid-cols-2 gap-2">

                <SummaryStat
                  icon={
                    <WalletCards
                      size={14}
                      className="text-blue-600"
                    />
                  }
                  iconBg="bg-blue-50"
                  label="Eligible EMI"
                  value={
                    method === "foir"
                      ? formatCurrency(
                          monthlyIncome *
                            getFoirLimit(
                              monthlyIncome
                            ) -
                            existingEmis
                        )
                      : "-"
                  }
                />

                <SummaryStat
                  icon={
                    <BarChart3
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="Asset Value"
                  value={formatCurrency(
                    assetValue
                  )}
                />

              </div>

              {result?.error && (
                <div className="mt-3 text-red-500 text-[12px] font-medium">
                  {result.error}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
      {/* INSIGHTS */}
<div className="mt-3">

  <InsightsLayout
    title=""
    sections={LOAN_INSIGHTS}
  />

</div>

    </section>
  );
}

/* INPUT */

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

      return `₹${Number(
        value
      ).toLocaleString("en-IN")}`;
    }

    if (format === "percent") {
      return `${value}%`;
    }

    return `${value} Years`;
  };

  const saveValue = () => {

    let finalValue =
      Number(tempValue);

    if (isNaN(finalValue))
      finalValue = min;

    if (finalValue < min)
      finalValue = min;

    if (finalValue > max)
      finalValue = max;

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
                  setTempValue(
                    e.target.value
                  )
                }
                className="
                  h-9 flex-1 rounded-xl
                  border border-[#d9e2f2]
                  px-3 text-[14px]
                  font-semibold outline-none
                "
              />

              <button
                onClick={saveValue}
                className="
                  h-9 px-3 rounded-xl
                  bg-[#001B5E]
                  text-white text-[12px]
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
              w-8 h-8 rounded-xl
              bg-[#f5f7fd]
              flex items-center justify-center
              text-gray-500 shrink-0
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
          onChange(
            Number(e.target.value)
          )
        }
        className="w-full mt-3 accent-blue-600"
      />

    </div>
  );
}

/* SELECT */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

      <p className="text-[11px] text-gray-500 mb-2">
        {label}
      </p>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full h-[42px]
          rounded-xl
          border border-[#d9e2f2]
          px-3
          text-[14px]
          font-semibold
          outline-none
          bg-white
        "
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

      </select>

    </div>
  );
}

/* LOAN TYPES */

function LoanTypeSelector({
  loanType,
  onChange,
}) {
  return (
    <div className="grid grid-cols-3 gap-[10px]">

      {types.map((type) => {

        const value =
          type === "Home Loan"
            ? "home"
            : type === "Car Loan"
            ? "car"
            : "personal";

        const active =
          loanType === value;

        const Icon =
          type === "Home Loan"
            ? Home
            : type === "Car Loan"
            ? Car
            : UserRound;

        return (
          <button
            key={type}
            onClick={() =>
              onChange(value)
            }
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

/* STATS */

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
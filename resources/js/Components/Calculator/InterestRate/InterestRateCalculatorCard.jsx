import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  BarChart3,
  ReceiptText,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { INTEREST_INSIGHTS } from "./InterestInsightsData";

/* ---------------------------------------------
   EMI HELPERS
--------------------------------------------- */

const calculateEMI = (P, r, n) => {
  if (r === 0) return P / n;

  return (
    (P * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1)
  );
};

const findMonthlyRate = (
  emi,
  P,
  n
) => {

  let low = 0;
  let high = 1;
  let mid = 0;

  for (let i = 0; i < 50; i++) {

    mid = (low + high) / 2;

    const calc = calculateEMI(
      P,
      mid,
      n
    );

    calc > emi
      ? (high = mid)
      : (low = mid);
  }

  return mid;
};

const formatCurrency = (v) =>
  `₹${Math.round(v).toLocaleString(
    "en-IN"
  )}`;

export default function InterestRateCalculatorCard() {

  /* ---------------- STATE ---------------- */

  const [emi, setEmi] =
    useState(20000);

  const [loanAmount, setLoanAmount] =
    useState(400000);

  const [tenure, setTenure] =
    useState(2);

  const [tenureUnit, setTenureUnit] =
    useState("years");

  /* ---------------- LIVE CALCULATION ---------------- */

  const months =
    tenureUnit === "years"
      ? tenure * 12
      : tenure;

  const monthlyRate =
    findMonthlyRate(
      Number(emi),
      Number(loanAmount),
      months
    );

  const annualRate =
    monthlyRate * 12 * 100;

  const totalPaid =
    emi * months;

  const totalInterest =
    totalPaid - loanAmount;

  /* ---------------- CHART ---------------- */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(annualRate / 20, 1);

  const dash =
    progress * circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO CARD */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[65%]">

            <p className="text-[10px] opacity-90 font-medium">
              Estimated Interest Rate
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[34px] leading-none font-black tracking-[-1px]">

                {annualRate.toFixed(2)}%

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                EMI ₹
                {emi.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span>•</span>

              <span>
                {months} Months
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
          label="Monthly EMI"
          value={emi}
          onChange={setEmi}
          min={1000}
          max={500000}
          step={500}
          format="currency"
        />

        <InputField
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={10000}
          max={100000000}
          step={10000}
          format="currency"
        />

        <InputField
          label="Loan Tenure"
          value={tenure}
          onChange={setTenure}
          min={1}
          max={
            tenureUnit === "years"
              ? 30
              : 360
          }
          step={1}
          format={
            tenureUnit === "years"
              ? "year"
              : "month"
          }
        />

        {/* TENURE TYPE */}
        <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

          <p className="text-[11px] text-gray-500 mb-2">
            Tenure Type
          </p>

          <select
            value={tenureUnit}
            onChange={(e) =>
              setTenureUnit(
                e.target.value
              )
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

            <option value="years">
              Years
            </option>

            <option value="months">
              Months
            </option>

          </select>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <h3 className="text-[15px] font-bold text-[#081c4b] mb-3">
            Interest Overview
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
                  Annual Rate
                </span>

                <h4 className="text-[14px] font-black text-[#081c4b] leading-tight mt-1">

                  {annualRate.toFixed(2)}%

                </h4>

              </div>

            </div>

            {/* STATS */}
            <div className="flex-1 min-w-0">

              <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#edf1f7]">

                <SummaryStat
                  icon={
                    <WalletCards
                      size={14}
                      className="text-blue-600"
                    />
                  }
                  iconBg="bg-blue-50"
                  label="Monthly Rate"
                  value={`${monthlyRate.toFixed(
                    4
                  )}%`}
                />

                <SummaryStat
                  icon={
                    <BarChart3
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="Total Interest"
                  value={formatCurrency(
                    totalInterest
                  )}
                />

                <SummaryStat
                  icon={
                    <ReceiptText
                      size={14}
                      className="text-orange-500"
                    />
                  }
                  iconBg="bg-orange-50"
                  label="Total Paid"
                  value={formatCurrency(
                    totalPaid
                  )}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={INTEREST_INSIGHTS}
        />

      </div>

    </section>
  );
}

/* ---------------------------------------------
   INPUT FIELD
--------------------------------------------- */

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

    if (format === "month") {
      return `${value} Months`;
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

/* ---------------------------------------------
   SUMMARY STAT
--------------------------------------------- */

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
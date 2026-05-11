import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { TENURE_INSIGHTS } from "./TenureInsightsData";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

const formatNumber = (num) =>
  `₹${Math.round(num).toLocaleString(
    "en-IN"
  )}`;

const calculateTenureMonths = (
  P,
  EMI,
  annualRate
) => {

  const r =
    annualRate / 12 / 100;

  if (EMI <= P * r)
    return null;

  return (
    Math.log(
      EMI / (EMI - P * r)
    ) / Math.log(1 + r)
  );
};

const addMonthsToDate = (
  months
) => {

  const d = new Date();

  d.setMonth(
    d.getMonth() + months
  );

  return d.toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );
};

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function TenureCalculator() {

  const [loanAmount, setLoanAmount] =
    useState(3000000);

  const [emi, setEmi] =
    useState(25000);

  const [interestRate, setInterestRate] =
    useState(8.5);

  /* LIVE CALCULATION */

  const months =
    calculateTenureMonths(
      Number(loanAmount),
      Number(emi),
      Number(interestRate)
    );

  const isValid =
    months && isFinite(months);

  const totalMonths =
    isValid
      ? Math.ceil(months)
      : 0;

  const years =
    Math.floor(
      totalMonths / 12
    );

  const remMonths =
    totalMonths % 12;

  const totalPaid =
    emi * totalMonths;

  const totalInterest =
    totalPaid - loanAmount;

  const endDate =
    addMonthsToDate(
      totalMonths
    );

  /* CHART */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(
      totalMonths / (30 * 12),
      1
    );

  const dash =
    progress * circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO CARD */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[65%]">

            <p className="text-[10px] opacity-90 font-medium">
              Estimated Loan Tenure
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[30px] leading-none font-black tracking-[-1px]">

                {!isValid
                  ? "--"
                  : `${years}Y ${remMonths}M`}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {interestRate}% Interest
              </span>

              <span>•</span>

              <span>
                EMI ₹
                {emi.toLocaleString(
                  "en-IN"
                )}
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
          value={loanAmount}
          onChange={setLoanAmount}
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="Monthly EMI"
          value={emi}
          onChange={setEmi}
          min={1000}
          max={1000000}
          step={500}
          format="currency"
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

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <h3 className="text-[15px] font-bold text-[#081c4b] mb-3">
            Loan Tenure Summary
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

                {isValid && (

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

                )}

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">

                {!isValid ? (

                  <span className="text-red-500 text-[10px] font-semibold">
                    EMI Too Low
                  </span>

                ) : (

                  <>
                    <span className="text-[8px] text-gray-500">
                      Duration
                    </span>

                    <h4 className="text-[13px] font-black text-[#081c4b] leading-tight mt-1">

                      {years}Y {remMonths}M

                    </h4>
                  </>

                )}

              </div>

            </div>

            {/* STATS */}
            <div className="flex-1 min-w-0">

              {isValid ? (

                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#edf1f7]">

                  <SummaryStat
                    icon={
                      <WalletCards
                        size={14}
                        className="text-blue-600"
                      />
                    }
                    iconBg="bg-blue-50"
                    label="Interest"
                    value={formatNumber(
                      totalInterest
                    )}
                  />

                  <SummaryStat
                    icon={
                      <BarChart3
                        size={14}
                        className="text-green-600"
                      />
                    }
                    iconBg="bg-green-50"
                    label="Total Paid"
                    value={formatNumber(
                      totalPaid
                    )}
                  />

                  <SummaryStat
                    icon={
                      <CalendarDays
                        size={14}
                        className="text-orange-500"
                      />
                    }
                    iconBg="bg-orange-50"
                    label="Closure"
                    value={endDate}
                  />

                </div>

              ) : (

                <div className="text-red-500 text-[12px] font-medium mt-3">
                  EMI is too low to repay this loan.
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
          sections={TENURE_INSIGHTS}
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

    if (format === "percent") {
      return `${value}%`;
    }

    return value;
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
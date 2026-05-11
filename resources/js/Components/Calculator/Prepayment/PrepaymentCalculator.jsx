import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  TrendingDown,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { PREPAYMENT_INSIGHTS } from "./PrepaymentInsightsData";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

const formatINR = (v) =>
  `₹${Math.round(v).toLocaleString(
    "en-IN"
  )}`;

function calculateEMI(
  P,
  annualRate,
  months
) {

  const r =
    annualRate / 12 / 100;

  if (!r) return P / months;

  return (
    (P *
      r *
      Math.pow(
        1 + r,
        months
      )) /
    (Math.pow(
      1 + r,
      months
    ) -
      1)
  );
}

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function PrepaymentCalculator() {

  const [form, setForm] =
    useState({
      outstandingLoan: 3500000,
      currentEmi: 30000,
      interestRate: 8.5,
      remainingTenure: 240,
      prepaymentAmount: 200000,
      prepaymentType:
        "reduceTenure",
    });

  /* LIVE CALCULATION */

  const {
    outstandingLoan,
    interestRate,
    remainingTenure,
    prepaymentAmount,
  } = form;

  const originalEmi =
    calculateEMI(
      outstandingLoan,
      interestRate,
      remainingTenure
    );

  const originalInterest =
    originalEmi *
      remainingTenure -
    outstandingLoan;

  const newPrincipal =
    outstandingLoan -
    prepaymentAmount;

  /* REDUCE TENURE */

  let balance =
    newPrincipal;

  let months = 0;

  const r =
    interestRate /
    12 /
    100;

  while (
    balance > 0 &&
    months < 600
  ) {

    balance =
      balance +
      balance * r -
      originalEmi;

    months++;
  }

  const tenureSaved =
    remainingTenure -
    months;

  const interestReduceTenure =
    originalEmi *
      months -
    newPrincipal;

  /* REDUCE EMI */

  const newEmi =
    calculateEMI(
      newPrincipal,
      interestRate,
      remainingTenure
    );

  const interestReduceEmi =
    newEmi *
      remainingTenure -
    newPrincipal;

  const result = {
    originalInterest,

    reduceTenure: {
      interestSaved:
        originalInterest -
        interestReduceTenure,

      newEmi: originalEmi,

      newTenure: months,

      tenureReduced:
        tenureSaved,

      totalInterest:
        interestReduceTenure,
    },

    reduceEmi: {
      interestSaved:
        originalInterest -
        interestReduceEmi,

      newEmi,

      newTenure:
        remainingTenure,

      tenureReduced: 0,

      totalInterest:
        interestReduceEmi,
    },
  };

  const activeResult =
    form.prepaymentType ===
    "reduceTenure"
      ? result.reduceTenure
      : result.reduceEmi;

  /* CHART */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(
      activeResult
        .interestSaved /
        originalInterest,
      1
    );

  const dash =
    progress * circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO CARD */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[68%]">

            <p className="text-[10px] opacity-90 font-medium">
              Estimated Savings
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[30px] leading-none font-black tracking-[-1px]">

                {formatINR(
                  activeResult.interestSaved
                )}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {interestRate}% Interest
              </span>

              <span>•</span>

              <span>
                {remainingTenure}
                m Tenure
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
          label="Outstanding Loan"
          value={
            form.outstandingLoan
          }
          onChange={(v) =>
            setForm({
              ...form,
              outstandingLoan: v,
            })
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="Current EMI"
          value={form.currentEmi}
          onChange={(v) =>
            setForm({
              ...form,
              currentEmi: v,
            })
          }
          min={1000}
          max={1000000}
          step={500}
          format="currency"
        />

        <InputField
          label="Interest Rate"
          value={form.interestRate}
          onChange={(v) =>
            setForm({
              ...form,
              interestRate: v,
            })
          }
          min={1}
          max={20}
          step={0.1}
          format="percent"
        />

        <InputField
          label="Remaining Tenure"
          value={
            form.remainingTenure
          }
          onChange={(v) =>
            setForm({
              ...form,
              remainingTenure: v,
            })
          }
          min={1}
          max={360}
          step={1}
          format="months"
        />

        <InputField
          label="Prepayment Amount"
          value={
            form.prepaymentAmount
          }
          onChange={(v) =>
            setForm({
              ...form,
              prepaymentAmount: v,
            })
          }
          min={10000}
          max={50000000}
          step={10000}
          format="currency"
        />

      </div>

      {/* OPTION SELECTOR */}
      <div className="px-3 mt-3">

        <div className="grid grid-cols-2 gap-[10px]">

          <OptionCard
            title="Reduce Tenure"
            active={
              form.prepaymentType ===
              "reduceTenure"
            }
            onClick={() =>
              setForm({
                ...form,
                prepaymentType:
                  "reduceTenure",
              })
            }
          />

          <OptionCard
            title="Reduce EMI"
            active={
              form.prepaymentType ===
              "reduceEmi"
            }
            onClick={() =>
              setForm({
                ...form,
                prepaymentType:
                  "reduceEmi",
              })
            }
          />

        </div>

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-[15px] font-bold text-[#081c4b]">
              Prepayment Summary
            </h3>

            {form.prepaymentType ===
              "reduceTenure" && (

              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">

                <BadgeCheck size={12} />

                Recommended

              </div>

            )}

          </div>

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
                  Interest Saved
                </span>

                <h4 className="text-[12px] font-black text-[#081c4b] leading-tight mt-1">

                  {formatINR(
                    activeResult.interestSaved
                  )}

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
                  label="New EMI"
                  value={formatINR(
                    activeResult.newEmi
                  )}
                />

                <SummaryStat
                  icon={
                    <TrendingDown
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="Saved"
                  value={formatINR(
                    activeResult.interestSaved
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
                  label="Tenure"
                  value={`${Math.floor(
                    activeResult.newTenure /
                      12
                  )}Y`}
                />

              </div>

              {/* EXTRA INFO */}
              <div className="mt-3 space-y-2 text-[11px]">

                <InfoRow
                  label="New Tenure"
                  value={`${Math.floor(
                    activeResult.newTenure /
                      12
                  )}Y ${
                    activeResult.newTenure %
                    12
                  }M`}
                />

                <InfoRow
                  label="Tenure Reduced"
                  value={`${Math.floor(
                    activeResult.tenureReduced /
                      12
                  )}Y ${
                    activeResult.tenureReduced %
                    12
                  }M`}
                />

                <InfoRow
                  label="Total Interest"
                  value={formatINR(
                    activeResult.totalInterest
                  )}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RECOMMENDATION */}
      <div className="px-3 mt-3">

        <div className="bg-green-50 border border-green-100 rounded-[16px] p-4">

          <h3 className="text-[13px] font-bold text-green-800">
            Recommendation
          </h3>

          <p className="text-[11px] text-green-700 mt-1 leading-5">

            Reducing tenure saves
            additional{" "}

            <span className="font-bold">

              {formatINR(
                result
                  .reduceTenure
                  .interestSaved -
                  result.reduceEmi
                    .interestSaved
              )}

            </span>

            {" "}compared to reducing EMI.

          </p>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={
            PREPAYMENT_INSIGHTS
          }
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

    if (format === "months") {
      return `${value} Months`;
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
   OPTION CARD
--------------------------------------------- */

function OptionCard({
  title,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        h-[44px]
        rounded-full
        text-[12px]
        font-semibold
        transition-all
        border
        ${
          active
            ? "bg-[#001B5E] text-white border-[#001B5E]"
            : "bg-white text-[#081c4b] border-[#edf1f7]"
        }
      `}
    >
      {title}
    </button>
  );
}

/* ---------------------------------------------
   INFO ROW
--------------------------------------------- */

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-bold text-[#081c4b]">
        {value}
      </span>

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
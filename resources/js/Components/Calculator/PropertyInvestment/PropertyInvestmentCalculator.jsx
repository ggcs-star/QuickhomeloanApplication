import React, { useState, useMemo } from "react";

import {
  Pencil,
  TrendingUp,
  WalletCards,
  BarChart3,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { PROPERTY_INVESTMENT_INSIGHTS } from "./PropertyInvestmentInsightsData";

/* ---------------------------------------------
   SCENARIOS
--------------------------------------------- */

const SCENARIOS = {
  base: {
    label: "Base",
    inputs: {
      propertyValue: 5000000,
      appreciation: 4,
      years: 20,
      loanAmount: 4000000,
      interestRate: 9.5,
      tenure: 20,
    },
  },

  conservative: {
    label: "Safe",
    inputs: {
      propertyValue: 5000000,
      appreciation: 10,
      years: 20,
      loanAmount: 4000000,
      interestRate: 8,
      tenure: 20,
    },
  },

  aggressive: {
    label: "Growth",
    inputs: {
      propertyValue: 5000000,
      appreciation: 7,
      years: 20,
      loanAmount: 4000000,
      interestRate: 8.5,
      tenure: 20,
    },
  },
};

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

const formatCurrency = (value) =>
  `₹${Math.round(value).toLocaleString(
    "en-IN"
  )}`;

function calculateResults(inputs) {

  const exitValue =
    inputs.propertyValue *
    Math.pow(
      1 +
        inputs.appreciation /
          100,
      inputs.years
    );

  const totalEmiPaid =
    inputs.loanAmount * 1.25;

  const totalInterest =
    totalEmiPaid -
    inputs.loanAmount;

  const totalInvested =
    inputs.propertyValue -
    inputs.loanAmount +
    totalEmiPaid;

  const netProfit =
    exitValue -
    totalInvested;

  const cagr =
    Math.pow(
      exitValue /
        inputs.propertyValue,
      1 / inputs.years
    ) - 1;

  return {
    exitValue:
      Math.round(exitValue),

    netProfit:
      Math.round(netProfit),

    totalInterest:
      Math.round(totalInterest),

    totalInvested:
      Math.round(totalInvested),

    breakEvenYear:
      netProfit > 0
        ? 1
        : inputs.years,

    cagr: (
      cagr * 100
    ).toFixed(2),

    roi: (
      (netProfit /
        totalInvested) *
      100
    ).toFixed(2),
  };
}

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function PropertyInvestmentCalculator() {

  const [activeScenario, setActiveScenario] =
    useState("base");

  const [inputs, setInputs] =
    useState(
      SCENARIOS.base.inputs
    );

  const results = useMemo(
    () =>
      calculateResults(
        inputs
      ),
    [inputs]
  );

  const updateInput = (
    key,
    value
  ) => {

    setInputs((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  /* CHART */

  const radius = 72;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(
      results.roi / 100,
      1
    );

  const dash =
    progress * circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[68%]">

            <p className="text-[10px] opacity-90 font-medium">
              Projected Net Profit
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[28px] leading-none font-black tracking-[-1px]">

                {formatCurrency(
                  results.netProfit
                )}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                ROI {results.roi}%
              </span>

              <span>•</span>

              <span>
                {inputs.years}Y Hold
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

      {/* SCENARIOS */}
      <div className="px-3 mt-3">

        <div className="grid grid-cols-3 gap-[10px]">

          {Object.keys(
            SCENARIOS
          ).map((key) => {

            const active =
              activeScenario ===
              key;

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveScenario(
                    key
                  );

                  setInputs(
                    SCENARIOS[key]
                      .inputs
                  );
                }}
                className={`
                  h-[42px]
                  rounded-full
                  text-[11px]
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

                {
                  SCENARIOS[key]
                    .label
                }

              </button>
            );
          })}

        </div>

      </div>

      {/* INPUTS */}
      <div className="px-3 mt-3 space-y-2">

        <InputField
          label="Property Value"
          value={
            inputs.propertyValue
          }
          onChange={(v) =>
            updateInput(
              "propertyValue",
              v
            )
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="Annual Appreciation"
          value={
            inputs.appreciation
          }
          onChange={(v) =>
            updateInput(
              "appreciation",
              v
            )
          }
          min={1}
          max={20}
          step={0.5}
          format="percent"
        />

        <InputField
          label="Holding Years"
          value={inputs.years}
          onChange={(v) =>
            updateInput(
              "years",
              v
            )
          }
          min={1}
          max={40}
          step={1}
          format="years"
        />

        <InputField
          label="Loan Amount"
          value={
            inputs.loanAmount
          }
          onChange={(v) =>
            updateInput(
              "loanAmount",
              v
            )
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="Interest Rate"
          value={
            inputs.interestRate
          }
          onChange={(v) =>
            updateInput(
              "interestRate",
              v
            )
          }
          min={1}
          max={20}
          step={0.1}
          format="percent"
        />

        <InputField
          label="Loan Tenure"
          value={inputs.tenure}
          onChange={(v) =>
            updateInput(
              "tenure",
              v
            )
          }
          min={1}
          max={30}
          step={1}
          format="years"
        />

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-[15px] font-bold text-[#081c4b]">
              Investment Summary
            </h3>

            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">

              <BadgeCheck size={12} />

              Profitable

            </div>

          </div>

          <div className="flex gap-3">

            {/* DONUT */}
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
                  ROI
                </span>

                <h4 className="text-[15px] font-black text-[#081c4b] leading-tight mt-1">

                  {results.roi}%

                </h4>

              </div>

            </div>

            {/* STATS */}
            <div className="flex-1 min-w-0">

              <div className="grid grid-cols-2 gap-2">

                <SummaryStat
                  icon={
                    <TrendingUp
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="Profit"
                  value={formatCurrency(
                    results.netProfit
                  )}
                />

                <SummaryStat
                  icon={
                    <WalletCards
                      size={14}
                      className="text-blue-600"
                    />
                  }
                  iconBg="bg-blue-50"
                  label="Exit Value"
                  value={formatCurrency(
                    results.exitValue
                  )}
                />

                <SummaryStat
                  icon={
                    <BarChart3
                      size={14}
                      className="text-orange-500"
                    />
                  }
                  iconBg="bg-orange-50"
                  label="CAGR"
                  value={`${results.cagr}%`}
                />

                <SummaryStat
                  icon={
                    <CalendarDays
                      size={14}
                      className="text-purple-600"
                    />
                  }
                  iconBg="bg-purple-50"
                  label="Break Even"
                  value={`Year ${results.breakEvenYear}`}
                />

              </div>

              <div className="mt-3 bg-[#f5f7fd] rounded-xl px-3 py-2">

                <p className="text-[10px] text-gray-500">
                  Total Invested
                </p>

                <h4 className="text-[18px] font-black text-[#081c4b] mt-1">

                  {formatCurrency(
                    results.totalInvested
                  )}

                </h4>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RECOMMENDATION */}
      <div className="px-3 mt-3">

        <div className="bg-green-50 border border-green-100 rounded-[16px] p-4">

          <h3 className="text-[13px] font-bold text-green-800">
            Investment Insight
          </h3>

          <p className="text-[11px] text-green-700 mt-1 leading-5">

            Property value is projected to grow to{" "}

            <span className="font-bold">

              {formatCurrency(
                results.exitValue
              )}

            </span>

            {" "}with an estimated ROI of{" "}

            <span className="font-bold">

              {results.roi}%

            </span>

            {" "}over{" "}
            {inputs.years} years.

          </p>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={
            PROPERTY_INVESTMENT_INSIGHTS
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

    if (format === "years") {
      return `${value} Years`;
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
import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  TrendingUp,
  CalendarDays,
  BarChart3,
  BadgeCheck,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { FINANCIAL_COMPARISON_INSIGHTS } from "./FinancialComparisonInsightsData";

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */

const calculateEMI = (
  P,
  annualRate,
  years
) => {

  const r =
    annualRate / 12 / 100;

  const n = years * 12;

  if (r === 0)
    return P / n;

  return (
    (P *
      r *
      Math.pow(
        1 + r,
        n
      )) /
    (Math.pow(
      1 + r,
      n
    ) -
      1)
  );
};

const formatCurrency = (
  v
) =>
  `₹${Math.round(v).toLocaleString(
    "en-IN"
  )}`;

/* -------------------------------------------------
   COMPONENT
------------------------------------------------- */

export default function FinancialComparisonCalculator() {

  const [common, setCommon] =
    useState({
      loanTenure: 20,
      interestRate: 8.5,
      downPaymentRate: 20,
    });

  const [rtmPrice, setRtmPrice] =
    useState(5000000);

  const [ucPrice, setUcPrice] =
    useState(4500000);

  const [
    constructionTimeline,
    setConstructionTimeline,
  ] = useState(24);

  const [monthlyRent, setMonthlyRent] =
    useState(15000);

  const [
    rentIncreaseRate,
    setRentIncreaseRate,
  ] = useState(5);

  const [
    disbursements,
    setDisbursements,
  ] = useState([
    {
      month: 0,
      percent: 20,
    },
    {
      month: 6,
      percent: 30,
    },
    {
      month: 12,
      percent: 30,
    },
    {
      month: 18,
      percent: 20,
    },
  ]);

  /* LIVE CALCULATION */

  const downPayment =
    (rtmPrice *
      common.downPaymentRate) /
    100;

  const loanAmount =
    rtmPrice - downPayment;

  const emi =
    calculateEMI(
      loanAmount,
      common.interestRate,
      common.loanTenure
    );

  const totalPaid =
    emi *
    common.loanTenure *
    12;

  const totalInterest =
    totalPaid - loanAmount;

  const totalPercent =
    disbursements.reduce(
      (sum, d) =>
        sum + d.percent,
      0
    );

  /* CHART */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(
      common.interestRate /
        20,
      1
    );

  const dash =
    progress * circumference;

  /* DISBURSEMENTS */

  const updateDisbursement = (
    index,
    field,
    value
  ) => {

    const updated = [
      ...disbursements,
    ];

    updated[index][field] =
      Number(value);

    setDisbursements(
      updated
    );
  };

  const removeDisbursement = (
    index
  ) => {

    setDisbursements(
      disbursements.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  const addDisbursement =
    () => {

      setDisbursements([
        ...disbursements,
        {
          month: 0,
          percent: 0,
        },
      ]);
    };

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[68%]">

            <p className="text-[10px] opacity-90 font-medium">
              Estimated EMI
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[28px] leading-none font-black tracking-[-1px]">

                {formatCurrency(
                  emi
                )}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {common.interestRate}%
                Interest
              </span>

              <span>•</span>

              <span>
                {
                  common.loanTenure
                }Y Tenure
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

      {/* COMMON INPUTS */}
      <div className="px-3 mt-3 space-y-2">

        <InputField
          label="Loan Tenure"
          value={
            common.loanTenure
          }
          onChange={(v) =>
            setCommon({
              ...common,
              loanTenure: v,
            })
          }
          min={1}
          max={30}
          step={1}
          format="years"
        />

        <InputField
          label="Interest Rate"
          value={
            common.interestRate
          }
          onChange={(v) =>
            setCommon({
              ...common,
              interestRate: v,
            })
          }
          min={1}
          max={20}
          step={0.1}
          format="percent"
        />

        <InputField
          label="Down Payment"
          value={
            common.downPaymentRate
          }
          onChange={(v) =>
            setCommon({
              ...common,
              downPaymentRate: v,
            })
          }
          min={5}
          max={80}
          step={1}
          format="percent"
        />

      </div>

      {/* PROPERTY INPUTS */}
      <div className="px-3 mt-3 space-y-2">

        <InputField
          label="RTM Property Price"
          value={rtmPrice}
          onChange={
            setRtmPrice
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <InputField
          label="UC Property Price"
          value={ucPrice}
          onChange={
            setUcPrice
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <SelectField
          label="Construction Period"
          value={
            constructionTimeline
          }
          onChange={
            setConstructionTimeline
          }
          options={[
            12,
            24,
            36,
            48,
            60,
          ]}
        />

        <InputField
          label="Monthly Rent"
          value={monthlyRent}
          onChange={
            setMonthlyRent
          }
          min={1000}
          max={500000}
          step={500}
          format="currency"
        />

        <InputField
          label="Rent Increase"
          value={
            rentIncreaseRate
          }
          onChange={
            setRentIncreaseRate
          }
          min={0}
          max={20}
          step={0.5}
          format="percent"
        />

      </div>

      {/* DISBURSEMENTS */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] p-3 border border-[#edf1f7] shadow-sm">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-[14px] font-bold text-[#081c4b]">
              Disbursement Phases
            </h3>

            <div
              className={`
                px-2 py-1 rounded-full
                text-[10px] font-semibold
                ${
                  totalPercent ===
                  100
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }
              `}
            >

              {totalPercent}%

            </div>

          </div>

          <div className="space-y-3">

            {disbursements.map(
              (d, i) => (

                <div
                  key={i}
                  className="bg-[#f5f7fd] rounded-xl p-3"
                >

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-[11px] font-semibold text-[#081c4b]">
                      Phase {i + 1}
                    </span>

                    <button
                      onClick={() =>
                        removeDisbursement(
                          i
                        )
                      }
                      className="text-red-500 text-[12px] font-bold"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    <InputField
                      label="Month"
                      value={
                        d.month
                      }
                      onChange={(
                        v
                      ) =>
                        updateDisbursement(
                          i,
                          "month",
                          v
                        )
                      }
                      min={0}
                      max={60}
                      step={1}
                      format="month"
                    />

                    <InputField
                      label="Percent"
                      value={
                        d.percent
                      }
                      onChange={(
                        v
                      ) =>
                        updateDisbursement(
                          i,
                          "percent",
                          v
                        )
                      }
                      min={0}
                      max={100}
                      step={1}
                      format="percent"
                    />

                  </div>

                </div>

              )
            )}

          </div>

          <button
            onClick={
              addDisbursement
            }
            className="
              mt-3 w-full h-[42px]
              rounded-xl border
              border-dashed
              border-[#cfd8ea]
              text-[12px]
              font-semibold
              text-[#081c4b]
            "
          >
            + Add Phase
          </button>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-[15px] font-bold text-[#081c4b]">
              Financial Overview
            </h3>

            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">

              <BadgeCheck size={12} />

              Ready

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
                  Rate
                </span>

                <h4 className="text-[15px] font-black text-[#081c4b] leading-tight mt-1">

                  {
                    common.interestRate
                  }%

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
                  label="Loan"
                  value={formatCurrency(
                    loanAmount
                  )}
                />

                <SummaryStat
                  icon={
                    <TrendingUp
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="EMI"
                  value={formatCurrency(
                    emi
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
                  label="Interest"
                  value={formatCurrency(
                    totalInterest
                  )}
                />

                <SummaryStat
                  icon={
                    <CalendarDays
                      size={14}
                      className="text-purple-600"
                    />
                  }
                  iconBg="bg-purple-50"
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

      {/* RECOMMENDATION */}
      <div className="px-3 mt-3">

        <div className="bg-green-50 border border-green-100 rounded-[16px] p-4">

          <h3 className="text-[13px] font-bold text-green-800">
            Comparison Insight
          </h3>

          <p className="text-[11px] text-green-700 mt-1 leading-5">

            Under-construction
            properties may provide
            lower entry pricing,
            while ready-to-move
            homes reduce rent and
            construction delay risk.

          </p>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={
            FINANCIAL_COMPARISON_INSIGHTS
          }
        />

      </div>

    </section>
  );
}

/* -------------------------------------------------
   INPUT FIELD
------------------------------------------------- */

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

    if (format === "month") {
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

/* -------------------------------------------------
   SELECT FIELD
------------------------------------------------- */

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
          onChange(
            Number(
              e.target.value
            )
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

        {options.map((o) => (

          <option
            key={o}
            value={o}
          >
            {o} Months
          </option>

        ))}

      </select>

    </div>
  );
}

/* -------------------------------------------------
   SUMMARY STAT
------------------------------------------------- */

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
import React, { useState, useEffect } from "react";

import {
  Pencil,
  Home,
  WalletCards,
  TrendingUp,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { RENT_VS_BUY_INSIGHTS } from "./RentVsBuyInsightsData";

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

const formatCurrency = (value) => {
  return `₹${Math.round(value).toLocaleString(
    "en-IN"
  )}`;
};

const calculateEMI = (
  loanAmount,
  annualRate,
  years
) => {

  const monthlyRate =
    annualRate / 12 / 100;

  const months = years * 12;

  if (monthlyRate === 0)
    return loanAmount / months;

  return (
    (loanAmount *
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      )) /
    (Math.pow(
      1 + monthlyRate,
      months
    ) -
      1)
  );
};

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function RentVsBuyCalculator() {

  /* BUYING */

  const [buyingDetails, setBuyingDetails] =
    useState({
      propertyPrice: 10000000,
      downPaymentPercent: 40,
      loanInterestRate: 6.9,
      loanTenure: 26,
    });

  /* RENTING */

  const [rentingDetails, setRentingDetails] =
    useState({
      currentMonthlyRent: 15000,
    });

  /* ECONOMIC */

  const [economicFactors, setEconomicFactors] =
    useState({
      propertyAppreciation: 6,
      annualRentIncrease: 7,
      investmentReturnRate: 12,
    });

  /* ANALYSIS */

  const [analysisPeriod, setAnalysisPeriod] =
    useState(15);

  /* RESULTS */

  const [results, setResults] =
    useState({
      wealthIfBuying: 0,
      wealthIfRenting: 0,
      breakEvenPoint: "Year 0",
      finalPropertyValue: 0,
      projectedEMI: 0,
    });

  /* CALCULATIONS */

  useEffect(() => {

    const {
      propertyPrice,
      downPaymentPercent,
      loanInterestRate,
      loanTenure,
    } = buyingDetails;

    const {
      currentMonthlyRent,
    } = rentingDetails;

    const {
      propertyAppreciation,
      annualRentIncrease,
      investmentReturnRate,
    } = economicFactors;

    const loanAmount =
      propertyPrice *
      (1 -
        downPaymentPercent /
          100);

    const emi =
      calculateEMI(
        loanAmount,
        loanInterestRate,
        loanTenure
      );

    let propertyValue =
      propertyPrice;

    let buyingWealth = 0;

    let rentingWealth = 0;

    let monthlyRent =
      currentMonthlyRent;

    for (
      let year = 1;
      year <= analysisPeriod;
      year++
    ) {

      propertyValue *=
        1 +
        propertyAppreciation /
          100;

      monthlyRent *=
        1 +
        annualRentIncrease /
          100;

      const investedDownPayment =
        propertyPrice *
        (downPaymentPercent /
          100) *
        Math.pow(
          1 +
            investmentReturnRate /
              100,
          year
        );

      buyingWealth =
        propertyValue -
        emi *
          12 *
          year;

      rentingWealth =
        investedDownPayment -
        monthlyRent *
          12 *
          year;
    }

    let breakEven =
      "> 15 Years";

    for (
      let year = 1;
      year <= analysisPeriod;
      year++
    ) {

      const futureProperty =
        propertyPrice *
        Math.pow(
          1 +
            propertyAppreciation /
              100,
          year
        );

      const investedAmount =
        propertyPrice *
        (downPaymentPercent /
          100) *
        Math.pow(
          1 +
            investmentReturnRate /
              100,
          year
        );

      if (
        futureProperty >
        investedAmount
      ) {

        breakEven = `Year ${year}`;

        break;
      }
    }

    setResults({
      wealthIfBuying:
        buyingWealth,

      wealthIfRenting:
        rentingWealth,

      breakEvenPoint:
        breakEven,

      finalPropertyValue:
        propertyValue,

      projectedEMI:
        emi,
    });

  }, [
    buyingDetails,
    rentingDetails,
    economicFactors,
    analysisPeriod,
  ]);

  /* RESULT */

  const recommendation =
    results.wealthIfBuying >
    results.wealthIfRenting
      ? "BUY"
      : "RENT";

  /* CHART */

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    Math.min(
      Math.abs(
        results.wealthIfBuying
      ) /
        10000000,
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
              Recommended Option
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[34px] leading-none font-black tracking-[-1px]">

                {recommendation}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {results.breakEvenPoint}
              </span>

              <span>•</span>

              <span>
                {analysisPeriod}Y Analysis
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
          label="Property Price"
          value={
            buyingDetails.propertyPrice
          }
          onChange={(v) =>
            setBuyingDetails({
              ...buyingDetails,
              propertyPrice: v,
            })
          }
          min={1000000}
          max={50000000}
          step={100000}
          format="currency"
        />

        <InputField
          label="Down Payment"
          value={
            buyingDetails.downPaymentPercent
          }
          onChange={(v) =>
            setBuyingDetails({
              ...buyingDetails,
              downPaymentPercent: v,
            })
          }
          min={10}
          max={50}
          step={1}
          format="percent"
        />

        <InputField
          label="Loan Interest Rate"
          value={
            buyingDetails.loanInterestRate
          }
          onChange={(v) =>
            setBuyingDetails({
              ...buyingDetails,
              loanInterestRate: v,
            })
          }
          min={6}
          max={12}
          step={0.1}
          format="percent"
        />

        <InputField
          label="Loan Tenure"
          value={
            buyingDetails.loanTenure
          }
          onChange={(v) =>
            setBuyingDetails({
              ...buyingDetails,
              loanTenure: v,
            })
          }
          min={5}
          max={30}
          step={1}
          format="years"
        />

        <InputField
          label="Monthly Rent"
          value={
            rentingDetails.currentMonthlyRent
          }
          onChange={(v) =>
            setRentingDetails({
              currentMonthlyRent: v,
            })
          }
          min={5000}
          max={100000}
          step={1000}
          format="currency"
        />

        <InputField
          label="Property Appreciation"
          value={
            economicFactors.propertyAppreciation
          }
          onChange={(v) =>
            setEconomicFactors({
              ...economicFactors,
              propertyAppreciation: v,
            })
          }
          min={0}
          max={15}
          step={0.5}
          format="percent"
        />

        <InputField
          label="Rent Increase"
          value={
            economicFactors.annualRentIncrease
          }
          onChange={(v) =>
            setEconomicFactors({
              ...economicFactors,
              annualRentIncrease: v,
            })
          }
          min={0}
          max={15}
          step={0.5}
          format="percent"
        />

        <InputField
          label="Investment Return"
          value={
            economicFactors.investmentReturnRate
          }
          onChange={(v) =>
            setEconomicFactors({
              ...economicFactors,
              investmentReturnRate: v,
            })
          }
          min={5}
          max={20}
          step={0.5}
          format="percent"
        />

        <InputField
          label="Analysis Period"
          value={analysisPeriod}
          onChange={
            setAnalysisPeriod
          }
          min={5}
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
              Wealth Comparison
            </h3>

            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">

              <BadgeCheck size={12} />

              {recommendation}

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
                  Better
                </span>

                <h4 className="text-[16px] font-black text-[#081c4b] mt-1">

                  {recommendation}

                </h4>

              </div>

            </div>

            {/* STATS */}
            <div className="flex-1 min-w-0">

              <div className="grid grid-cols-2 gap-2">

                <SummaryStat
                  icon={
                    <Home
                      size={14}
                      className="text-blue-600"
                    />
                  }
                  iconBg="bg-blue-50"
                  label="Buying"
                  value={formatCurrency(
                    results.wealthIfBuying
                  )}
                />

                <SummaryStat
                  icon={
                    <WalletCards
                      size={14}
                      className="text-green-600"
                    />
                  }
                  iconBg="bg-green-50"
                  label="Renting"
                  value={formatCurrency(
                    results.wealthIfRenting
                  )}
                />

                <SummaryStat
                  icon={
                    <TrendingUp
                      size={14}
                      className="text-orange-500"
                    />
                  }
                  iconBg="bg-orange-50"
                  label="Property"
                  value={formatCurrency(
                    results.finalPropertyValue
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
                  label="Break Even"
                  value={
                    results.breakEvenPoint
                  }
                />

              </div>

              <div className="mt-3 bg-[#f5f7fd] rounded-xl px-3 py-2">

                <p className="text-[10px] text-gray-500">
                  Projected EMI
                </p>

                <h4 className="text-[18px] font-black text-[#081c4b] mt-1">

                  {formatCurrency(
                    results.projectedEMI
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
            Smart Recommendation
          </h3>

          <p className="text-[11px] text-green-700 mt-1 leading-5">

            {recommendation ===
            "BUY"
              ? "Buying creates better long-term wealth based on current projections."
              : "Renting and investing surplus funds may provide stronger financial flexibility."}

          </p>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={
            RENT_VS_BUY_INSIGHTS
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
import React, { useState } from "react";

import {
  Pencil,
  WalletCards,
  TrendingUp,
  BarChart3,
  BadgeCheck,
} from "lucide-react";

import InsightsLayout from "@/Components/Common/InsightsLayout";

import { STAMP_DUTY_INSIGHTS } from "./StampDutyInsightsData";

/* ---------------------------------------------
   STATES
--------------------------------------------- */

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function StampDutyCalculator() {

  const [method, setMethod] =
    useState("percentage");

  const [propertyValue, setPropertyValue] =
    useState(5000000);

  const [state, setState] =
    useState("");

  const [propertyType, setPropertyType] =
    useState("");

  const [buyerCategory, setBuyerCategory] =
    useState("");

  const [stampDutyRate, setStampDutyRate] =
    useState(6);

  const [registrationFee, setRegistrationFee] =
    useState("30000");

  const [otherCharges, setOtherCharges] =
    useState(0);

  /* ---------------------------------------------
     CALCULATION
  --------------------------------------------- */

  const stampDuty =
    method === "percentage"
      ? (propertyValue *
          stampDutyRate) /
        100
      : propertyValue * 0.05;

  const regFee =
    registrationFee
      .toString()
      .includes("%")
      ? (propertyValue *
          parseFloat(
            registrationFee
          )) /
        100
      : Number(
          registrationFee
        );

  const total =
    stampDuty +
    regFee +
    Number(otherCharges);

  const format = (v) =>
    `₹${Math.round(v).toLocaleString(
      "en-IN"
    )}`;

  /* ---------------------------------------------
     DONUT
  --------------------------------------------- */

  const radius = 72;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    total > 0
      ? stampDuty / total
      : 0;

  const dash =
    progress *
    circumference;

  return (
    <section className="bg-[#f5f7fd] min-h-screen pb-24 max-w-[430px] mx-auto">

      {/* HERO */}
      <div className="px-3 pt-3">

        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-4 py-3 text-white h-[106px]">

          <div className="relative z-10 max-w-[68%]">

            <p className="text-[10px] opacity-90 font-medium">
              Estimated Charges
            </p>

            <div className="flex items-end gap-1 mt-1">

              <h2 className="text-[28px] leading-none font-black tracking-[-1px]">

                {format(total)}

              </h2>

            </div>

            <div className="flex items-center gap-2 mt-2 text-[9px] opacity-95">

              <span>
                {stampDutyRate}% Duty
              </span>

              <span>•</span>

              <span>
                {method ===
                "percentage"
                  ? "Percentage"
                  : "Slab"}
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
          label="Property Value"
          value={propertyValue}
          onChange={
            setPropertyValue
          }
          min={100000}
          max={100000000}
          step={50000}
          format="currency"
        />

        <SelectField
          label="State / UT"
          value={state}
          onChange={setState}
          options={STATES}
        />

        <SelectField
          label="Property Type"
          value={propertyType}
          onChange={
            setPropertyType
          }
          options={[
            "Resale",
            "New (Under Construction)",
            "Land",
          ]}
        />

        <SelectField
          label="Buyer Category"
          value={buyerCategory}
          onChange={
            setBuyerCategory
          }
          options={[
            "Individual",
            "Female Buyer",
            "First-time Homebuyer",
            "Joint Buyers",
          ]}
        />

      </div>

      {/* METHOD */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[14px] p-2 border border-[#edf1f7] shadow-sm">

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() =>
                setMethod(
                  "percentage"
                )
              }
              className={`
                h-[42px]
                rounded-full
                text-[12px]
                font-semibold
                transition-all
                ${
                  method ===
                  "percentage"
                    ? "bg-[#001B5E] text-white"
                    : "bg-[#f5f7fd] text-[#081c4b]"
                }
              `}
            >
              Percentage
            </button>

            <button
              onClick={() =>
                setMethod("slab")
              }
              className={`
                h-[42px]
                rounded-full
                text-[12px]
                font-semibold
                transition-all
                ${
                  method ===
                  "slab"
                    ? "bg-[#001B5E] text-white"
                    : "bg-[#f5f7fd] text-[#081c4b]"
                }
              `}
            >
              Slab Based
            </button>

          </div>

        </div>

      </div>

      {/* EXTRA INPUTS */}
      <div className="px-3 mt-3 space-y-2">

        <InputField
          label="Stamp Duty Rate"
          value={
            stampDutyRate
          }
          onChange={
            setStampDutyRate
          }
          min={1}
          max={20}
          step={0.1}
          format="percent"
          disabled={
            method === "slab"
          }
        />

        <TextField
          label="Registration Fee"
          value={
            registrationFee
          }
          onChange={
            setRegistrationFee
          }
        />

        <InputField
          label="Other Charges"
          value={otherCharges}
          onChange={
            setOtherCharges
          }
          min={0}
          max={1000000}
          step={1000}
          format="currency"
        />

      </div>

      {/* SUMMARY */}
      <div className="px-3 mt-3">

        <div className="bg-white rounded-[16px] px-3 py-[12px] border border-[#edf1f7] shadow-sm">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-[15px] font-bold text-[#081c4b]">
              Cost Breakdown
            </h3>

            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-semibold">

              <BadgeCheck size={12} />

              Calculated

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
                  Total Cost
                </span>

                <h4 className="text-[14px] font-black text-[#081c4b] leading-tight mt-1">

                  {format(total)}

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
                  label="Stamp Duty"
                  value={format(
                    stampDuty
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
                  label="Registration"
                  value={format(
                    regFee
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
                  label="Other"
                  value={format(
                    otherCharges
                  )}
                />

                <SummaryStat
                  icon={
                    <BadgeCheck
                      size={14}
                      className="text-purple-600"
                    />
                  }
                  iconBg="bg-purple-50"
                  label="Total"
                  value={format(
                    total
                  )}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* INFO */}
      <div className="px-3 mt-3">

        <div className="bg-green-50 border border-green-100 rounded-[16px] p-4">

          <h3 className="text-[13px] font-bold text-green-800">
            Important Note
          </h3>

          <p className="text-[11px] text-green-700 mt-1 leading-5">

            Stamp duty rates vary
            by state, buyer
            category, and property
            type. Actual charges may
            differ based on local
            regulations.

          </p>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-3">

        <InsightsLayout
          title=""
          sections={
            STAMP_DUTY_INSIGHTS
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
  disabled = false,
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
                disabled={disabled}
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

        {!editing &&
          !disabled && (

            <button
              onClick={() => {
                setEditing(
                  true
                );

                setTempValue(
                  value
                );
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

      {!disabled && (

        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) =>
            onChange(
              Number(
                e.target.value
              )
            )
          }
          className="w-full mt-3 accent-blue-600"
        />

      )}

    </div>
  );
}

/* ---------------------------------------------
   TEXT FIELD
--------------------------------------------- */

function TextField({
  label,
  value,
  onChange,
}) {
  return (
    <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

      <p className="text-[11px] text-gray-500 mb-2">
        {label}
      </p>

      <input
        value={value}
        onChange={(e) =>
          onChange(
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
        "
      />

    </div>
  );
}

/* ---------------------------------------------
   SELECT FIELD
--------------------------------------------- */

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

        <option value="">
          Select
        </option>

        {options.map((o) => (

          <option
            key={o}
            value={o}
          >
            {o}
          </option>

        ))}

      </select>

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
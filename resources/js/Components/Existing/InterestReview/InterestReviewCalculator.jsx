import React, { useState, useEffect } from 'react';
import {
    Scale,
    Calendar,
    Info,
    Wrench,
    Lock
} from "lucide-react";
import api from '../../../api';
import { useAuth } from "@/Context/AuthContext";
import { router } from "@inertiajs/react";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";
export default function InterestReviewCalculator() {


    const { isProUser } = useAuth();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    const [data, setData] = useState({
        loan: 5000000,
        emi: 45000,
        paid: 12,
        tenure: 15,
    });

    const [results, setResults] = useState({
        totalEMIPaid: 540000,
        interestComponent: 344847,
        principalComponent: 195153,
        interestPercentage: 63.86,
        annualROI: 7.02
    });


    useEffect(() => {
        setIsCheckingAccess(false);

        const handleSubscriptionUpdate = () => {

        };

        window.addEventListener("subscriptionUpdated", handleSubscriptionUpdate);

        return () => {
            window.removeEventListener("subscriptionUpdated", handleSubscriptionUpdate);
        };
    }, []);


    useEffect(() => {
        if (isProUser) {
            calculateResults();
        }
    }, [data, isProUser]);

    const calculateResults = () => {
        const totalEMIPaid = data.emi * data.paid;

        const monthlyRate = 0.0702 / 12;
        const interest = data.loan * monthlyRate * data.paid;
        const principal = totalEMIPaid - interest;

        setResults({
            totalEMIPaid: Math.round(totalEMIPaid),
            interestComponent: Math.round(interest),
            principalComponent: Math.round(principal),
            interestPercentage: Math.round((interest / totalEMIPaid) * 10000) / 100,
            annualROI: 7.02
        });
    };

    const format = (v) =>
        `₹ ${Number(v).toLocaleString("en-IN")}`;

    const getStatusBadge = (percentage) => {
        if (percentage > 70) return { text: "HIGH INTEREST SHARE", color: "bg-red-400" };
        if (percentage > 50) return { text: "MODERATE INTEREST SHARE", color: "bg-orange-400" };
        return { text: "LOW INTEREST SHARE", color: "bg-green-400" };
    };

    const getInterestShareColor = (percentage) => {
        if (percentage > 70) return "bg-red-100 text-red-700 border-red-200";
        if (percentage > 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-green-100 text-green-700 border-green-200";
    };

    const statusBadge = getStatusBadge(results.interestPercentage);

    return (
        <div className="space-y-6">

            {/* Upgrade Banner for non-pro users */}
            {!isProUser && !isCheckingAccess && (
                <ProUpgradeBanner

                />
            )}

            {/* CARD */}
            <div className="bg-white rounded-2xl p-5 shadow border">

                {/* HEADER */}
                <div className="flex items-center gap-2 mb-4">
                    <Scale size={18} className="text-gray-700" />
                    <h2 className="text-lg font-semibold">
                        Yearly Interest & Rate Audit
                    </h2>
                </div>

                {/* STATUS BADGE */}
                <div className={`${statusBadge.color} text-white text-sm px-4 py-2 rounded-full inline-flex items-center gap-2 mb-5`}>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    {!isProUser && !isCheckingAccess ? "UPGRADE TO VIEW" : statusBadge.text}
                </div>

            {/* LOAN */}
<EditableRangeField
  label="Loan Outstanding"
  value={data.loan}
  onChange={(val) =>
    setData((prev) => ({
      ...prev,
      loan: val,
    }))
  }
  min={100000}
  max={10000000}
  step={1000}
  format="currency"
/>

{/* EMI + PAID */}
<div className="grid grid-cols-1 gap-3 mb-4 mt-4">

  <EditableRangeField
    label="EMI Amount"
    value={data.emi}
    onChange={(val) =>
      setData((prev) => ({
        ...prev,
        emi: val,
      }))
    }
    min={1000}
    max={500000}
    step={100}
    format="currency"
  />

  <EditableRangeField
    label="EMIs Paid"
    value={data.paid}
    onChange={(val) =>
      setData((prev) => ({
        ...prev,
        paid: val,
      }))
    }
    min={1}
    max={360}
    step={1}
    format="number"
  />

</div>

{/* TENURE */}
<div className="mb-4">

  <div className="flex justify-between items-center mb-2">

    <label className="text-xs text-gray-500 uppercase">
      Tenure (Years)
    </label>

    <span
      className={`text-xs px-2 py-1 rounded ${
        !isProUser && !isCheckingAccess
          ? "bg-gray-100 text-gray-500 filter blur-[3px]"
          : getInterestShareColor(
              results.interestPercentage
            )
      }`}
    >
      {results.interestPercentage}%
      INTEREST SHARE
    </span>

  </div>

  <EditableRangeField
    label="Loan Tenure"
    value={data.tenure}
    onChange={(val) =>
      setData((prev) => ({
        ...prev,
        tenure: val,
      }))
    }
    min={1}
    max={30}
    step={1}
    format="year"
    icon={
      <Calendar
        size={16}
        className="text-gray-500"
      />
    }
  />

</div>

                {/* NOTE */}
                <div className="border rounded-xl p-4 bg-gray-50 flex gap-3">
                    <Info size={18} className="text-blue-500 mt-1" />

                    <div>
                        <h4 className="font-semibold text-sm">
                            COMPLIANCE NOTE
                        </h4>
                        <p className="text-sm text-gray-600">
                            All calculations are based on standard amortization schedules as per RBI Master Circular.
                        </p>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser
                        ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    disabled={!isProUser}
                >
                    <Wrench size={16} />
                    {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Interest Audit'}
                </button>

            </div>

            {/* RESULT CARDS */}
            <div className="space-y-4">

                {/* INTEREST COMPONENT */}
                <div className="bg-red-100 border rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold">
                            INTEREST COMPONENT
                        </p>
                        <p className="text-xs text-red-500">
                            BANK'S EARNINGS
                        </p>
                    </div>

                    <span className={`font-bold text-lg ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {format(results.interestComponent)}
                    </span>
                </div>

                {/* INTEREST SHARE */}
                <div className={`border rounded-xl p-4 flex justify-between items-center ${getInterestShareColor(results.interestPercentage)}`}>
                    <div>
                        <p className="text-sm font-semibold">
                            INTEREST SHARE
                        </p>
                        <p className="text-xs">
                            {results.interestPercentage > 70 ? 'High Interest Burden' :
                                results.interestPercentage > 50 ? 'Moderate Interest Burden' :
                                    'Low Interest Burden'}
                        </p>
                    </div>

                    <span className={`font-bold text-lg ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {results.interestPercentage}%
                    </span>
                </div>

                {/* TOTAL EMI */}
                <div className="bg-[#1f2a3c] text-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-orange-300">
                            INTEREST COST IMPACT
                        </p>
                        <p className="text-sm font-semibold">
                            TOTAL EMI PAID
                        </p>
                    </div>

                    <span className={`font-bold text-xl ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {format(results.totalEMIPaid)}
                    </span>
                </div>

            </div>

        </div>
    );
}
function EditableRangeField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = "number",
  icon = null,
}) {
  const [editing, setEditing] =
    useState(false);

  const [tempValue, setTempValue] =
    useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const displayValue = () => {
    if (format === "currency") {
      return `₹${Number(value).toLocaleString(
        "en-IN"
      )}`;
    }

    if (format === "percent") {
      return `${value}%`;
    }

    if (format === "year") {
      return `${value} Years`;
    }

    return value;
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
            <div className="flex items-center gap-2 mt-2">

              {icon}

              <h3 className="text-[16px] leading-tight font-black text-[#081c4b] break-words">
                {displayValue()}
              </h3>

            </div>
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
            ✎
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
        className="
          w-full
          mt-3
          accent-blue-600
        "
      />

      <div className="flex justify-between text-[10px] text-gray-400 mt-1">

        <span>{min}</span>

        <span>{max}</span>

      </div>

    </div>
  );
}
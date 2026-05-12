import React, { useState, useMemo, useEffect } from 'react';
import { 
  Timer, 
  BrainCircuit, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon,
  Lock
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";

const JourneyCompletionAudit = () => {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [data, setData] = useState({
    sanctionedTenure: 269,
    pendingInstallments: 206,
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleSanctionedTenureChange = (val) => {
    if (!isProUser) return;
    const newValue = Math.max(0, Math.min(600, val));
    setData(prev => {
      let newData = { ...prev, sanctionedTenure: newValue };
      if (prev.pendingInstallments > newValue) {
        newData.pendingInstallments = newValue;
      }
      return newData;
    });
  };

  const handlePendingInstallmentsChange = (val) => {
    if (!isProUser) return;
    const newValue = Math.max(0, Math.min(600, val));
    setData(prev => {
      let newData = { ...prev, pendingInstallments: newValue };
      if (prev.sanctionedTenure < newValue) {
        newData.sanctionedTenure = newValue;
      }
      return newData;
    });
  };

  const calculations = useMemo(() => {
    const sanctionedYears = (data.sanctionedTenure / 12).toFixed(2);
    const pendingYears = (data.pendingInstallments / 12).toFixed(2);
    const completedMonths = data.sanctionedTenure - data.pendingInstallments;
    const completedYears = (completedMonths / 12).toFixed(2);
    
    const freedomIndex = data.sanctionedTenure > 0 
      ? ((completedMonths / data.sanctionedTenure) * 100).toFixed(2) 
      : 0;
    
    const timeServedYears = Math.floor(completedMonths / 12);
    const timeServedMonths = completedMonths % 12;
    
    return {
      sanctionedYears,
      pendingYears,
      completedMonths,
      completedYears,
      freedomIndex,
      timeServedYears,
      timeServedMonths,
      remainingYears: pendingYears,
      totalYears: (data.sanctionedTenure / 12).toFixed(2)
    };
  }, [data.sanctionedTenure, data.pendingInstallments]);

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  const UpgradeBanner = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lock size={20} className="text-indigo-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-bold text-indigo-900 mb-1">Unlock Full Journey Audit</h4>
          <p className="text-[13px] text-indigo-800 mb-3">
            Pro users get access to complete tenure analysis, interactive calculators, and personalized recommendations.
          </p>
          <button 
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("openProModal"));
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Upgrade Banner for Non-Pro Users */}
      {!isProUser && !isCheckingAccess && <UpgradeBanner />}

      {/* Main Calculator Card */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Timer size={18} className="text-gray-700" />
          <h2 className="text-lg font-semibold">Tenure Audit & Lifecycle Tracking</h2>
        </div>

        {/* Input Fields */}
    <div className="grid grid-cols-1 gap-4 mb-5">

  <EditableRangeField
    label="Sanctioned Tenure (Months)"
    value={data.sanctionedTenure}
    onChange={handleSanctionedTenureChange}
    min={0}
    max={600}
    step={1}
    format="year"
    icon={
      <ClockIcon
        size={16}
        className="text-gray-500"
      />
    }
  />

  <EditableRangeField
    label="Pending Installments"
    value={data.pendingInstallments}
    onChange={handlePendingInstallmentsChange}
    min={0}
    max={600}
    step={1}
    format="year"
    icon={
      <CalendarIcon
        size={16}
        className="text-gray-500"
      />
    }
  />

</div>

        {/* Audit Button */}
        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            isProUser 
              ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Compliance Audit'}
        </button>
      </div>

      {/* Result Cards */}
      <div className="space-y-4">
        {/* Freedom Index Card */}
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm font-semibold mb-2">FREEDOM INDEX</p>
          <span className={`font-bold text-2xl ${blurClass}`}>
            {calculations.freedomIndex}%
          </span>
          <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-1000" 
              style={{ 
                width: `${isProUser ? Math.min(parseFloat(calculations.freedomIndex), 100) : 0}%` 
              }}
            />
          </div>
          {isProUser && (
            <p className="text-xs text-gray-500 mt-2">
              {parseFloat(calculations.freedomIndex) < 25 && 'Early stage - Focus on principal payments'}
              {parseFloat(calculations.freedomIndex) >= 25 && parseFloat(calculations.freedomIndex) < 50 && 'Mid journey - Consider refinancing'}
              {parseFloat(calculations.freedomIndex) >= 50 && parseFloat(calculations.freedomIndex) < 75 && 'Good progress - Maintain momentum'}
              {parseFloat(calculations.freedomIndex) >= 75 && 'Almost there - Final stretch!'}
            </p>
          )}
        </div>

        {/* Time Served vs Remaining */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500">TIME SERVED</p>
            <span className={`font-bold text-lg block mt-1 ${blurClass}`}>
              {calculations.timeServedYears} Yrs, {calculations.timeServedMonths} Mos
            </span>
          </div>
          <div className="border rounded-xl p-4 bg-[#1f2a3c] text-white">
            <p className="text-xs font-semibold text-gray-400">REMAINING</p>
            <span className={`font-bold text-lg block mt-1 ${blurClass}`}>
              {calculations.remainingYears} Years
            </span>
          </div>
        </div>

        {/* Tenure Comparison */}
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Tenure Comparison</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sanctioned:</span>
              <span className={`text-sm font-medium ${blurClass}`}>
                {calculations.sanctionedYears} Years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining:</span>
              <span className={`text-sm font-medium ${blurClass}`}>
                {calculations.remainingYears} Years
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm text-gray-600">Difference:</span>
              <span className={`text-sm font-medium ${blurClass}`}>
                {Math.abs(data.sanctionedTenure - data.pendingInstallments)} months {
                  data.sanctionedTenure - data.pendingInstallments < 0 ? 'ahead' : 'behind'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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
    if (format === "year") {
      return `${value} Months`;
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
          accent-indigo-600
        "
      />

      <div className="flex justify-between text-[10px] text-gray-400 mt-1">

        <span>{min}</span>

        <span>{max}</span>

      </div>

    </div>
  );
}

export default JourneyCompletionAudit;
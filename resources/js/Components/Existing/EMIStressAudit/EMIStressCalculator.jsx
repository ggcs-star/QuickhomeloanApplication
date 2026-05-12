import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  BrainCircuit,
  AlertCircle
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function EMIStressCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    monthlySalary: 120000,
    householdExpenses: 40000,
    totalEMIs: 55000
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setFormData(prev => ({ ...prev, [field]: parseInt(value, 10) || 0 }));
  };

  // Auto-calculate metrics using useMemo
  const calculations = useMemo(() => {
    const { monthlySalary, householdExpenses, totalEMIs } = formData;
    
    const monthlySurplus = monthlySalary - householdExpenses - totalEMIs;
    const foirPercentage = monthlySalary > 0 ? (totalEMIs / monthlySalary) * 100 : 0;
    const livingBurden = monthlySalary > 0 ? (householdExpenses / monthlySalary) * 100 : 0;
    const surplusRatio = monthlySalary > 0 ? (monthlySurplus / monthlySalary) * 100 : 0;
    
    let auditScore = 100;
    if (foirPercentage > 40) auditScore -= (foirPercentage - 40) * 1.5;
    if (foirPercentage > 50) auditScore -= (foirPercentage - 50) * 2;
    if (surplusRatio < 20) auditScore -= (20 - surplusRatio) * 1.2;
    if (surplusRatio < 10) auditScore -= (10 - surplusRatio) * 2;
    auditScore = Math.max(0, Math.min(100, auditScore));
    
    let riskStatus = 'High Stress';
    if (foirPercentage < 40) riskStatus = 'Optimal Capacity';
    else if (foirPercentage < 55) riskStatus = 'Moderate Stress';

    return {
      monthlySurplus,
      foirPercentage: parseFloat(foirPercentage.toFixed(1)),
      livingBurden: parseFloat(livingBurden.toFixed(1)),
      auditScore: Math.round(auditScore),
      riskStatus,
      surplusRatio: parseFloat(surplusRatio.toFixed(1))
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getRiskStatusColor = (foir) => {
    if (foir < 40) return 'bg-green-600';
    if (foir < 55) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* INPUT CARD */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-gray-700" />
            <h2 className="text-lg font-semibold">Financial Capacity Audit</h2>
          </div>
          <div className={`px-3 py-1 rounded-md flex items-center gap-2 text-white ${
            isProUser ? getRiskStatusColor(calculations.foirPercentage) : 'bg-gray-500'
          }`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {!isProUser ? 'Pro Required' : calculations.riskStatus}
            </span>
          </div>
        </div>

  <div className="space-y-4 mb-5">

  <EditableRangeField
    label="Monthly Net Salary"
    value={formData.monthlySalary}
    onChange={(val) =>
      handleInputChange(
        "monthlySalary",
        val
      )
    }
    min={30000}
    max={500000}
    step={1000}
    format="currency"
  />

  <EditableRangeField
    label="Household Expenses"
    value={formData.householdExpenses}
    onChange={(val) =>
      handleInputChange(
        "householdExpenses",
        val
      )
    }
    min={5000}
    max={96000}
    step={500}
    format="currency"
  />

  <EditableRangeField
    label="Total EMIs"
    value={formData.totalEMIs}
    onChange={(val) =>
      handleInputChange(
        "totalEMIs",
        val
      )
    }
    min={0}
    max={120000}
    step={500}
    format="currency"
  />

</div>

        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Financial Audit'}
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        {/* Compliance Meter */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-800">Compliance Meter</span>
            <span className={`font-bold text-lg ${isProUser ? (calculations.foirPercentage < 40 ? 'text-green-600' : calculations.foirPercentage < 55 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-500'} ${blurClass}`}>
              {calculations.foirPercentage}%
            </span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden flex border">
            <div className="bg-green-500 h-full border-r border-white/20 transition-all" style={{ width: '40%' }}></div>
            <div className="bg-yellow-500 h-full border-r border-white/20 transition-all" style={{ width: '15%' }}></div>
            <div className="bg-red-500 h-full flex-1 transition-all"></div>
            {isProUser && (
              <div className="absolute top-0 bottom-0 w-1 bg-black shadow-md transition-all duration-1000" 
                style={{ left: `calc(${Math.min(calculations.foirPercentage, 100)}% - 2px)` }}></div>
            )}
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mt-2">
            <span>Safe (&lt;40%)</span>
            <span className="text-yellow-600">Warning (40-55%)</span>
            <span>Overload (&gt;55%)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Surplus</p>
            <span className={`font-bold text-lg block ${blurClass}`}>{formatCurrency(calculations.monthlySurplus)}</span>
            <p className="text-[10px] text-green-600 font-semibold mt-1 uppercase">{isProUser ? `${calculations.surplusRatio}% of income` : 'Pro feature'}</p>
          </div>
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Living Burden</p>
            <span className={`font-bold text-lg block ${blurClass}`}>{calculations.livingBurden}%</span>
            <p className="text-[10px] text-blue-600 font-semibold mt-1 uppercase">Survival Cost Ratio</p>
          </div>
        </div>

        {/* Audit Score Box */}
        <div className={`p-5 rounded-xl text-white flex justify-between items-center ${isProUser ? (calculations.auditScore < 50 ? 'bg-red-600' : calculations.auditScore < 70 ? 'bg-yellow-600' : 'bg-green-700') : 'bg-gray-600'}`}>
          <div>
            <p className="text-xs font-bold uppercase mb-1 opacity-80">Financial Health Score</p>
            <span className={`font-bold text-3xl block ${blurClass}`}>
              {calculations.auditScore}/100
            </span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-center">
            <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Risk Status</p>
            <span className="font-semibold text-sm">{!isProUser ? 'Pro Required' : calculations.riskStatus}</span>
          </div>
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
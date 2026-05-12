import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function PrepaymentCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    prepaymentAmount: 500000,
    loanOutstanding: 5000000
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  // Auto-calculate metrics using useMemo
  const calculations = useMemo(() => {
    const percentage = formData.loanOutstanding > 0 
      ? formData.prepaymentAmount / formData.loanOutstanding 
      : 0;
      
    return {
      interestSaved: Math.round(percentage * 1850000), // Simulated logic
      tenureGain: Math.round(percentage * 82),         // Simulated logic
      interestRate: 8.75
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
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
            <h2 className="text-lg font-semibold">Prepayment Savings Simulator</h2>
          </div>
          <div className={`px-3 py-1 rounded-md flex items-center gap-2 text-white ${
            isProUser ? (calculations.interestSaved > 1000000 ? 'bg-green-600' : calculations.interestSaved > 500000 ? 'bg-yellow-600' : 'bg-blue-600') : 'bg-gray-500'
          }`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {!isProUser ? 'Pro Required' : (calculations.interestSaved > 1000000 ? 'HIGH' : calculations.interestSaved > 500000 ? 'MODERATE' : 'POTENTIAL') + ' SAVINGS'}
            </span>
          </div>
        </div>

    <div className="space-y-4 mb-5">

  <EditableRangeField
    label="Prepayment Amount"
    value={formData.prepaymentAmount}
    onChange={(val) =>
      handleInputChange(
        "prepaymentAmount",
        val
      )
    }
    min={50000}
    max={5000000}
    step={10000}
    format="currency"
  />

  <EditableRangeField
    label="Loan Outstanding"
    value={formData.loanOutstanding}
    onChange={(val) =>
      handleInputChange(
        "loanOutstanding",
        val
      )
    }
    min={100000}
    max={50000000}
    step={10000}
    format="currency"
  />

  <div>
    <label className="text-xs text-gray-500 uppercase block mb-1">
      Interest Rate
    </label>

    <div
      className={`
        border rounded-xl px-4 py-3
        font-semibold bg-gray-50
        flex items-center gap-2
        ${blurClass}
      `}
    >
      <span className="text-gray-500">
        %
      </span>

      {calculations.interestRate} ROI
    </div>
  </div>

</div>

        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Prepayment Audit'}
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${isProUser ? (calculations.interestSaved > 1000000 ? 'bg-green-50 border-green-200' : calculations.interestSaved > 500000 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200') : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Interest Saved</p>
            <span className={`font-bold text-lg ${isProUser ? (calculations.interestSaved > 1000000 ? 'text-green-600' : calculations.interestSaved > 500000 ? 'text-yellow-600' : 'text-blue-600') : 'text-gray-500'} ${blurClass}`}>
              {formatCurrency(calculations.interestSaved)}
            </span>
            <p className="text-[10px] text-gray-500 font-semibold mt-1 italic">
              {isProUser ? 'Reduction in total liability' : 'Pro feature'}
            </p>
          </div>
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tenure Gain</p>
            <span className={`font-bold text-lg block ${blurClass}`}>{calculations.tenureGain} Months</span>
            <p className="text-[10px] text-green-600 font-semibold mt-1 uppercase">Freedom acceleration</p>
          </div>
        </div>

        {/* Rights Information */}
   

        {/* Recovery Action */}
        
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
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  AlertCircle, 
  Percent, 
  Receipt,
  ArrowRight
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function HiddenCostsCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    bounceCharges: 1250,
    bounceEvents: 3,
    penalInterest: 450,
    gstOnPenalties: 306
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  // Auto-calculate metrics using useMemo
  const calculations = useMemo(() => {
    const totalNonEMICost = formData.bounceCharges + formData.penalInterest + formData.gstOnPenalties;
    const recoverableAmount = totalNonEMICost * 0.40; // 40% recoverable assumption

    return {
      totalNonEMICost,
      recoverableAmount,
      penaltyRate: 2.5,
      gstRate: 18
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getBounceSeverity = (events) => {
    if (events >= 3) return 'High Risk';
    if (events >= 2) return 'Medium Risk';
    return 'Low Risk';
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* INPUT CARD */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-700" />
            <h2 className="text-lg font-semibold">Penalty Detection & Recovery Audit</h2>
          </div>
          <div className={`px-3 py-1 rounded-md flex items-center gap-2 ${
            isProUser ? (formData.bounceEvents >= 3 ? 'bg-red-600' : formData.bounceEvents >= 2 ? 'bg-yellow-600' : 'bg-green-600') : 'bg-gray-500'
          } text-white`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {!isProUser ? 'Pro Required' : getBounceSeverity(formData.bounceEvents)}
            </span>
          </div>
        </div>

     <div className="space-y-4 mb-5">

  <EditableRangeField
    label="Bounce Charges"
    value={formData.bounceCharges}
    onChange={(val) =>
      handleInputChange(
        "bounceCharges",
        val
      )
    }
    min={0}
    max={10000}
    step={50}
    format="currency"
  />

  <EditableRangeField
    label="Bounce Events"
    value={formData.bounceEvents}
    onChange={(val) =>
      handleInputChange(
        "bounceEvents",
        val
      )
    }
    min={0}
    max={20}
    step={1}
    format="number"
  />

  <EditableRangeField
    label="Penal Interest"
    value={formData.penalInterest}
    onChange={(val) =>
      handleInputChange(
        "penalInterest",
        val
      )
    }
    min={0}
    max={10000}
    step={10}
    format="currency"
    icon={
      <Percent
        size={16}
        className="text-gray-400"
      />
    }
  />

  <EditableRangeField
    label="GST on Penalties"
    value={formData.gstOnPenalties}
    onChange={(val) =>
      handleInputChange(
        "gstOnPenalties",
        val
      )
    }
    min={0}
    max={5000}
    step={10}
    format="currency"
    icon={
      <Receipt
        size={16}
        className="text-gray-400"
      />
    }
  />

</div>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Recoverable Amount</p>
            <span className={`font-bold text-lg ${blurClass}`}>{formatCurrency(calculations.recoverableAmount)}</span>
            <p className="text-[10px] text-green-600 font-semibold mt-1 uppercase">Approx 40% of Penalties</p>
          </div>
          
          <div className={`border p-4 rounded-xl ${isProUser ? (formData.bounceEvents >= 3 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200') : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Bounce Risk Level</p>
            <span className={`font-bold text-lg ${isProUser ? (formData.bounceEvents >= 3 ? 'text-red-600' : 'text-green-600') : 'text-gray-500'} ${blurClass}`}>
              {getBounceSeverity(formData.bounceEvents)}
            </span>
            <p className="text-[10px] text-gray-500 font-semibold mt-1 italic">
              {isProUser ? `${formData.bounceEvents} events detected` : 'Pro feature'}
            </p>
          </div>
        </div>

        {/* Impact Box */}
        <div className={`p-5 rounded-xl text-white ${isProUser ? (calculations.totalNonEMICost > 1000 ? 'bg-[#1f2a3c]' : 'bg-green-700') : 'bg-gray-600'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isProUser ? (calculations.totalNonEMICost > 1000 ? 'text-red-400' : 'text-green-300') : 'text-gray-300'}`}>
            Total Hidden Costs
          </p>
          <span className={`font-bold text-2xl block mb-3 ${blurClass}`}>
            {formatCurrency(calculations.totalNonEMICost)}
          </span>
          <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-gray-300">Recovery Potential</span>
            <span className={`font-bold ${blurClass}`}>{formatCurrency(Math.abs(calculations.recoverableAmount))}</span>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-white p-4 rounded-xl border flex items-start gap-3">
          <AlertCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase text-gray-800">Recovery Rights</p>
            <p className="text-sm text-gray-600 mt-1">
              {isProUser 
                ? (formData.bounceEvents >= 2 ? `You have ${formData.bounceEvents} bounce events. Banks often waive charges for technical issues. Contact customer care immediately.` : 'Your hidden costs are minimal. Maintain timely payments to avoid penalties.') 
                : 'Upgrade to Pro to analyze your recovery rights and get personalized recommendations.'}
            </p>
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
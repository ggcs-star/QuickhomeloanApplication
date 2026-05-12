import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  BrainCircuit, 
  MapPin, 
  Shield, 
  CircleAlert, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function BenchmarkTransmissionCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    principalBalance: 5000000,
    currentROI: 9.25,
    remainingYears: 15,
    cibilScore: 800,
    location: 'Mumbai, Maharashtra'
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'location' ? value : (parseFloat(value) || 0)
    }));
  };

  // Auto-calculate metrics using useMemo
  const calculations = useMemo(() => {
    const { principalBalance, currentROI, remainingYears, cibilScore } = formData;
    
    let marketBenchmark = 9.00;
    if (cibilScore >= 800) marketBenchmark = 7.25;
    else if (cibilScore >= 750) marketBenchmark = 7.75;
    else if (cibilScore >= 700) marketBenchmark = 8.25;

    const transmissionGap = marketBenchmark - currentROI;
    
    const currentAnnualInterest = principalBalance * (currentROI / 100);
    const benchmarkAnnualInterest = principalBalance * (marketBenchmark / 100);
    const annualInterestLoss = benchmarkAnnualInterest - currentAnnualInterest;
    const lifetimeLoss = annualInterestLoss * remainingYears;

    return {
      marketBenchmark: parseFloat(marketBenchmark.toFixed(2)),
      transmissionGap: parseFloat(transmissionGap.toFixed(2)),
      annualInterestLoss: Math.round(annualInterestLoss),
      lifetimeLoss: Math.round(lifetimeLoss)
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getCibilRating = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 750) return 'Good';
    if (score >= 700) return 'Fair';
    return 'Poor';
  };

  const getCibilRatingColor = (score) => {
    if (score >= 800) return 'text-green-600 bg-green-50';
    if (score >= 750) return 'text-blue-600 bg-blue-50';
    if (score >= 700) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* INPUT CARD */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={18} className="text-gray-700" />
          <h2 className="text-lg font-semibold">Spread Audit & Market Benchmarking</h2>
        </div>

   <div className="space-y-4 mb-5">

  <EditableRangeField
    label="Principal Balance"
    value={formData.principalBalance}
    onChange={(val) =>
      handleInputChange(
        "principalBalance",
        val
      )
    }
    min={100000}
    max={50000000}
    step={1000}
    format="currency"
  />

  <EditableRangeField
    label="Current ROI"
    value={formData.currentROI}
    onChange={(val) =>
      handleInputChange(
        "currentROI",
        val
      )
    }
    min={1}
    max={20}
    step={0.05}
    format="percent"
  />

  <EditableRangeField
    label="Remaining Years"
    value={formData.remainingYears}
    onChange={(val) =>
      handleInputChange(
        "remainingYears",
        val
      )
    }
    min={1}
    max={40}
    step={1}
    format="year"
  />

  <EditableRangeField
    label="CIBIL Score"
    value={formData.cibilScore}
    onChange={(val) =>
      handleInputChange(
        "cibilScore",
        val
      )
    }
    min={300}
    max={900}
    step={1}
    format="number"
    icon={
      <Shield
        size={16}
        className="text-gray-400"
      />
    }
  />

</div>

        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Compliance Audit'}
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Market Benchmark</p>
            <span className={`font-bold text-lg ${blurClass}`}>{calculations.marketBenchmark}%</span>
            <p className="text-[10px] text-green-600 font-semibold mt-1 uppercase">Best for {getCibilRating(formData.cibilScore)}</p>
          </div>
          
          <div className={`border p-4 rounded-xl ${isProUser ? (calculations.transmissionGap < 0 ? 'bg-red-50' : 'bg-green-50') : 'bg-gray-50'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Transmission Gap</p>
            <span className={`font-bold text-lg ${isProUser ? (calculations.transmissionGap < 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-500'} ${blurClass}`}>
              {calculations.transmissionGap}%
            </span>
            <p className="text-[10px] text-gray-500 font-semibold mt-1 italic">
              {isProUser ? (calculations.transmissionGap < 0 ? 'Higher than market' : 'Better than market') : 'Pro feature'}
            </p>
          </div>
        </div>

        {/* Impact Box */}
        <div className={`p-5 rounded-xl text-white ${isProUser ? (calculations.annualInterestLoss > 0 ? 'bg-[#1f2a3c]' : 'bg-green-700') : 'bg-gray-600'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isProUser ? (calculations.annualInterestLoss > 0 ? 'text-red-400' : 'text-green-300') : 'text-gray-300'}`}>
            {isProUser ? (calculations.annualInterestLoss > 0 ? 'Annual Interest Loss' : 'Annual Interest Gain') : 'Annual Impact'}
          </p>
          <span className={`font-bold text-2xl block mb-3 ${blurClass}`}>
            {formatCurrency(Math.abs(calculations.annualInterestLoss))}
          </span>
          <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-gray-300">Lifetime Impact</span>
            <span className={`font-bold ${blurClass}`}>{formatCurrency(Math.abs(calculations.lifetimeLoss))}</span>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-white p-4 rounded-xl border flex items-start gap-3">
          <CircleAlert className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase text-gray-800">Transmission Right</p>
            <p className="text-sm text-gray-600 mt-1">
              {isProUser 
                ? (calculations.transmissionGap < -1 ? `Your rate is ${Math.abs(calculations.transmissionGap)}% higher than the market benchmark. Banks must reset their EBLR at least once every 3 months.` : 'Your rate is optimal compared to the market benchmark.') 
                : 'Upgrade to Pro to analyze your transmission gap and identify potential interest savings.'}
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
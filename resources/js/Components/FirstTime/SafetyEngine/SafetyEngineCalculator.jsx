import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

// Reusable Card Component for Light Theme UI
const Card = ({ children, title, className = "" }) => (
  <div className={`bg-transparent border-0 rounded-xl overflow-hidden shadow-none ${className}`}>
    {title && (
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</h3>
      </div>
    )}
    <div className="p-5">
      {children}
    </div>
  </div>
);

export default function SafetyEngineCalculator() {
  // PRO LOGIC & AUTH
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // MAIN STATE
  const [loanData, setLoanData] = useState({
    monthlyIncome: 120000,
    existingEmis: 25000,
    city: 'Metro',
    interestRate: 8.5,
    tenureYears: 20,
    loanAmount: 5000000
  });

  // Remove checking access loader state since useAuth handles it globally
  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  // HELPER FUNCTIONS 
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const calculateEmi = (p, annualRate, years) => {
    if (!p || !annualRate || !years) return 0;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const calculatePrincipal = (emi, annualRate, years) => {
    if (!emi || !annualRate || !years || emi <= 0) return 0;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    return Math.round((emi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
  };

  const getBankLimitPercentage = (income) => {
    if (income < 50000) return 0.50;
    if (income < 100000) return 0.60;
    return 0.65;
  };

  const getSafeLimitPercentage = (income, city) => {
    let base = getBankLimitPercentage(income) - 0.15; // 15% safety buffer
    if (city === 'Metro') base -= 0.05; // 5% extra cost of living penalty
    return Math.max(0.30, base); 
  };

  // CALCULATIONS
  const safePercentage = getSafeLimitPercentage(loanData.monthlyIncome, loanData.city);
  const stretchPercentage = getBankLimitPercentage(loanData.monthlyIncome);
  
  const safeLimitPercent = Math.round(safePercentage * 100);
  const bankMaxLimitPercent = Math.round(stretchPercentage * 100);

  const safeEMICap = loanData.monthlyIncome * safePercentage;
  const stretchEMICap = loanData.monthlyIncome * stretchPercentage;

  const availableSafeEMI = Math.max(0, safeEMICap - loanData.existingEmis);
  const availableStretchEMI = Math.max(0, stretchEMICap - loanData.existingEmis);

  const idealLoanAmount = calculatePrincipal(availableSafeEMI, loanData.interestRate, loanData.tenureYears);
  const bankMaxLoanAmount = calculatePrincipal(availableStretchEMI, loanData.interestRate, loanData.tenureYears);

  const currentBurden = loanData.monthlyIncome > 0 ? (loanData.existingEmis / loanData.monthlyIncome) * 100 : 0;
  const proposedEmi = calculateEmi(loanData.loanAmount, loanData.interestRate, loanData.tenureYears);
  const totalBurden = loanData.monthlyIncome > 0 ? ((loanData.existingEmis + proposedEmi) / loanData.monthlyIncome) * 100 : 0;

  const status = useMemo(() => {
    if (totalBurden <= safeLimitPercent) return { label: 'SAFE', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (totalBurden <= bankMaxLimitPercent) return { label: 'WATCH', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'DANGER', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  }, [totalBurden, safeLimitPercent, bankMaxLimitPercent]);

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      
      {!isProUser && !isCheckingAccess && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lock className="text-blue-600 w-5 h-5" />
            <span className="text-blue-900 text-sm font-medium">Upgrade to Pro to unlock real-time Safety Engine calculations.</span>
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            onClick={() => window.dispatchEvent(new CustomEvent("openProModal"))}
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={28} />
            Loan Safety Engine
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Preventing financial over-leverage through income-to-debt analysis.</p>
        </div>
        <div className={`px-4 py-2 rounded-md border ${status.bg} ${status.border} w-fit`}>
          <span className={`text-sm font-bold uppercase tracking-widest ${status.color}`}>
            {!isProUser && !isCheckingAccess ? 'LOCKED' : `${status.label} ZONE`}
          </span>
        </div>
      </div>

     
{/* INPUT SECTION */}
<div className="space-y-3">

  {/* YOUR FINANCIALS */}
  <Card title="Your Financials">

    <div className="space-y-3">

      <EditableRangeField
        label="Monthly In-Hand Income"
        value={loanData.monthlyIncome}
        onChange={(val) =>
          setLoanData({
            ...loanData,
            monthlyIncome: val,
          })
        }
        min={10000}
        max={1000000}
        step={5000}
        format="currency"
      />

      <EditableRangeField
        label="Existing Monthly EMIs"
        value={loanData.existingEmis}
        onChange={(val) =>
          setLoanData({
            ...loanData,
            existingEmis: val,
          })
        }
        min={0}
        max={500000}
        step={1000}
        format="currency"
      />

      {/* CITY */}
      <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

        <p className="text-[11px] text-gray-500">
          City Type
        </p>

        <select
          value={loanData.city}
          onChange={(e) =>
            setLoanData({
              ...loanData,
              city: e.target.value,
            })
          }
          className="
            w-full
            mt-2
            bg-white
            border border-[#d9e2f2]
            rounded-xl
            px-3
            h-9
            text-[14px]
            font-semibold
            text-[#081c4b]
            outline-none
            focus:border-blue-500
          "
        >
          <option value="Metro">
            Metro / Tier 1
          </option>

          <option value="Non-Metro">
            Non-Metro / Tier 2+
          </option>

        </select>

      </div>

    </div>

  </Card>

  {/* LOAN PARAMETERS */}
  <Card title="Loan Parameters">

    <div className="space-y-3">

      <EditableRangeField
        label="Proposed Loan Amount"
        value={loanData.loanAmount}
        onChange={(val) =>
          setLoanData({
            ...loanData,
            loanAmount: val,
          })
        }
        min={100000}
        max={10000000}
        step={100000}
        format="currency"
      />

      <EditableRangeField
        label="Interest Rate"
        value={loanData.interestRate}
        onChange={(val) =>
          setLoanData({
            ...loanData,
            interestRate: val,
          })
        }
        min={1}
        max={15}
        step={0.1}
        format="percent"
      />

      <EditableRangeField
        label="Loan Tenure"
        value={loanData.tenureYears}
        onChange={(val) =>
          setLoanData({
            ...loanData,
            tenureYears: val,
          })
        }
        min={1}
        max={30}
        step={1}
        format="year"
      />

    </div>

  </Card>

</div>

      {/* RESULTS DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldCheck size={100} className="text-green-600" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-[10px] text-green-700 uppercase font-bold tracking-widest">Ideal & Safe Loan ({safeLimitPercent}%)</div>
              <CheckCircle2 size={16} className="text-green-600" />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold text-gray-900 relative z-10 ${blurClass}`}>
              {formatCurrency(idealLoanAmount)}
            </div>
            <div className="text-[11px] font-semibold text-gray-600 mt-2 uppercase relative z-10">Maximum stress-free loan amount</div>
            <p className="text-[11px] text-gray-500 mt-1 relative z-10">Leaves enough room for lifestyle, investments, and life's surprises.</p>
          </div>

          <div className="p-5 bg-red-50 border border-red-200 rounded-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <AlertTriangle size={100} className="text-red-600" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-[10px] text-red-700 uppercase font-bold tracking-widest">Bank Max Zone ({bankMaxLimitPercent}%)</div>
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold text-gray-900 relative z-10 ${blurClass}`}>
              {formatCurrency(bankMaxLoanAmount)}
            </div>
            <div className="text-[11px] font-semibold text-gray-600 mt-2 uppercase relative z-10">Maximum bank approval for your salary</div>
            <p className="text-[11px] text-gray-500 mt-1 relative z-10">Banks assume survival on basics. Expect high lifestyle sacrifice here.</p>
          </div>
        </div>
<Card title="Visual Safety Audit">

  <div className="space-y-4">

    {/* TOP BURDEN CARD */}
    <div className="bg-[#f8faff] rounded-[14px] p-3 border border-[#edf1f7]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            Total Debt Burden
          </p>

          <h3 className={`text-[28px] leading-none font-black mt-2 ${status.color} ${blurClass}`}>
            {totalBurden.toFixed(1)}%
          </h3>

          <p className={`text-[11px] text-gray-500 mt-2 ${blurClass}`}>
            Current Burden: {currentBurden.toFixed(1)}%
          </p>

        </div>

        <div
          className={`
            px-3 py-1.5
            rounded-full
            text-[10px]
            font-bold
            uppercase
            tracking-widest
            ${status.bg}
            ${status.color}
          `}
        >
          {status.label}
        </div>

      </div>

    </div>

    {/* PROGRESS BAR */}
    <div className="bg-white rounded-[14px] p-3 border border-[#edf1f7]">

      <div className="flex justify-between items-center mb-3">

        <p className="text-[11px] font-semibold text-[#081c4b]">
          Debt Safety Meter
        </p>

        <p className="text-[10px] text-gray-500">
          Salary Tier {bankMaxLimitPercent}%
        </p>

      </div>

      <div className="relative pt-5">

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">

          <div
            className="bg-green-500 h-full"
            style={{
              width: `${safeLimitPercent}%`,
            }}
          />

          <div
            className="bg-yellow-400 h-full"
            style={{
              width: `${bankMaxLimitPercent - safeLimitPercent}%`,
            }}
          />

          <div className="bg-red-500 h-full flex-1" />

        </div>

        {isProUser && (
          <div
            className="absolute top-0 z-10"
            style={{
              left: `${Math.min(95, totalBurden)}%`,
            }}
          >

            <div className="w-[2px] h-8 bg-black mx-auto" />

            <div className="bg-black text-white text-[9px] px-2 py-1 rounded-full whitespace-nowrap -translate-x-1/2">
              YOU
            </div>

          </div>
        )}

      </div>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-3 gap-2">

      {/* SAFE */}
      <div className="bg-[#f8faff] rounded-[14px] p-2.5 border border-[#edf1f7]">

        <div className="flex items-center gap-1.5">

          <div className="w-2 h-2 rounded-full bg-green-500" />

          <span className="text-[9px] text-gray-500 uppercase font-bold">
            Safe
          </span>

        </div>

        <h4 className={`text-[13px] font-black text-[#081c4b] mt-2 ${blurClass}`}>
          {formatCurrency(safeEMICap)}
        </h4>

        <p className="text-[9px] text-gray-400 mt-1">
          {safeLimitPercent}% limit
        </p>

      </div>

      {/* CEILING */}
      <div className="bg-[#f8faff] rounded-[14px] p-2.5 border border-[#edf1f7]">

        <div className="flex items-center gap-1.5">

          <div className="w-2 h-2 rounded-full bg-yellow-400" />

          <span className="text-[9px] text-gray-500 uppercase font-bold">
            Max
          </span>

        </div>

        <h4 className={`text-[13px] font-black text-[#081c4b] mt-2 ${blurClass}`}>
          {formatCurrency(stretchEMICap)}
        </h4>

        <p className="text-[9px] text-gray-400 mt-1">
          {bankMaxLimitPercent}% limit
        </p>

      </div>

      {/* DANGER */}
      <div className="bg-[#f8faff] rounded-[14px] p-2.5 border border-[#edf1f7]">

        <div className="flex items-center gap-1.5">

          <div className="w-2 h-2 rounded-full bg-red-500" />

          <span className="text-[9px] text-gray-500 uppercase font-bold">
            Risk
          </span>

        </div>

        <h4 className={`text-[13px] font-black text-red-600 mt-2 ${blurClass}`}>
          {">"} {bankMaxLimitPercent}%
        </h4>

        <p className="text-[9px] text-gray-400 mt-1">
          Danger Zone
        </p>

      </div>

    </div>

  </div>

</Card>
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
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] =
    useState(value);

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
        className="w-full mt-3 accent-blue-600"
      />

      <div className="flex justify-between text-[10px] text-gray-400 mt-1">

        <span>{min}</span>

        <span>{max}</span>

      </div>

    </div>
  );
};

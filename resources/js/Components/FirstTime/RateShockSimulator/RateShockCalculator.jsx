import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Activity, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell as ReCell } from 'recharts';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

// Reusable Card Component for Light Theme
const Card = ({ children, title, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${className}`}>
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

export default function RateShockCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [loanData, setLoanData] = useState({
    lendingInstitution: 'HDFC Bank',
    loanAmount: 5000000,
    interestRate: 8.5,
    remainingMonths: 240,
    benchmarkLinked: 'Repo Rate',
    tenureYears: 20 // Added for EMI calculation
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  // Helper Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace('₹', '₹ ');
  };

  const calculateEmi = (p, annualRate, years) => {
    if (!p || !annualRate || !years) return 0;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const calculateTenure = (principal, annualRate, emi) => {
    const monthlyRate = annualRate / 12 / 100;
    if (emi <= principal * monthlyRate) return Infinity; // EMI doesn't cover interest
    return Math.ceil(Math.log(emi / (emi - principal * monthlyRate)) / Math.log(1 + monthlyRate));
  };

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setLoanData(prev => ({ 
      ...prev, 
      [field]: field === 'lendingInstitution' || field === 'benchmarkLinked' ? value : (parseFloat(value) || 0) 
    }));
  };

  // Calculations
  const currentEmi = useMemo(() => calculateEmi(loanData.loanAmount, loanData.interestRate, loanData.tenureYears), [loanData]);
  const baseMonths = loanData.remainingMonths || (loanData.tenureYears * 12);
  
  const matrixData = useMemo(() => {
    const scenarios = [
      { label: '-0.50% Cut', delta: -0.5 },
      { label: 'Current Base', delta: 0 },
      { label: '+0.50% Hike', delta: 0.5 },
      { label: '+1.00% Hike', delta: 1.0 },
    ];

    return scenarios.map(s => {
      const effectiveRate = loanData.interestRate + s.delta;
      const monthlyRate = effectiveRate / 12 / 100;
      
      if (currentEmi <= loanData.loanAmount * monthlyRate) {
        return { ...s, effectiveRate, timelineMonths: Infinity, adjustment: Infinity, costDelta: Infinity };
      }

      const timelineMonths = calculateTenure(loanData.loanAmount, effectiveRate, currentEmi);
      const adjustment = timelineMonths - baseMonths;
      const totalCost = currentEmi * timelineMonths;
      const baseCost = currentEmi * baseMonths;
      const costDelta = totalCost - baseCost;

      return { ...s, effectiveRate, timelineMonths, adjustment, costDelta };
    });
  }, [loanData, currentEmi, baseMonths]);

  const sensitivityScore = useMemo(() => {
    const hike1Percent = matrixData[3];
    if (hike1Percent.adjustment === Infinity) return "100";
    const tenureIncrease = hike1Percent.adjustment;
    const score = Math.min(100, (tenureIncrease / 12) * 15);
    return score.toFixed(0);
  }, [matrixData]);

  const riskLevel = useMemo(() => {
    const score = Number(sensitivityScore);
    if (score > 70) return { label: 'HIGH RISK', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    if (score > 30) return { label: 'MODERATE RISK', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'LOW RISK', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  }, [sensitivityScore]);

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
            <Zap className="text-yellow-500" size={28} />
            Rate Shock Simulator
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Preparing for floating rate reality. Simulating interest rate volatility.</p>
        </div>
        <div className={`px-4 py-2 rounded-md border ${riskLevel.bg} ${riskLevel.border} text-left`}>
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Exposure Rating</div>
          <div className={`text-lg font-bold ${riskLevel.color} ${blurClass}`}>
            {!isProUser && !isCheckingAccess ? 'LOCKED' : riskLevel.label}
          </div>
        </div>
      </div>

    {/* INPUT SECTION */}
<div className="space-y-3">

  <Card title="Loan Config">

    <div className="space-y-3">

      {/* BANK */}
      <div className="bg-white rounded-[14px] px-3 py-[10px] shadow-sm border border-[#edf1f7]">

        <p className="text-[11px] text-gray-500">
          Lending Institution
        </p>

        <input
          type="text"
          value={loanData.lendingInstitution}
          onChange={(e) =>
            handleInputChange(
              "lendingInstitution",
              e.target.value
            )
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
          "
        />

      </div>

      <EditableRangeField
        label="Current Principal"
        value={loanData.loanAmount}
        onChange={(val) =>
          handleInputChange(
            "loanAmount",
            val
          )
        }
        min={100000}
        max={10000000}
        step={100000}
        format="currency"
      />

      <EditableRangeField
        label="Annual Rate"
        value={loanData.interestRate}
        onChange={(val) =>
          handleInputChange(
            "interestRate",
            val
          )
        }
        min={1}
        max={15}
        step={0.1}
        format="percent"
      />

      <EditableRangeField
        label="Remaining Months"
        value={loanData.remainingMonths}
        onChange={(val) =>
          handleInputChange(
            "remainingMonths",
            val
          )
        }
        min={12}
        max={360}
        step={12}
        format="month"
      />

    </div>

  </Card>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-center">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Effective Installment</div>
          <div className={`text-4xl font-bold text-gray-900 ${blurClass}`}>{formatCurrency(currentEmi)}</div>
          <div className="text-[10px] text-gray-400 uppercase mt-2">Calculated based on current config</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl flex items-center gap-4 ${isProUser ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div>
              <div className="text-[9px] text-red-600 uppercase font-bold tracking-widest">+0.50% Hike Delta</div>
              <div className={`text-xl font-bold text-gray-900 ${blurClass}`}>
                {isProUser ? (matrixData[2].adjustment === Infinity ? '∞' : `+${matrixData[2].adjustment}`) : 'XX'} Months
              </div>
              <div className="text-[9px] text-gray-500 uppercase">Single Transmission Step</div>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-center gap-4 ${isProUser ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div>
              <div className="text-[9px] text-green-600 uppercase font-bold tracking-widest">-0.50% Cut Delta</div>
              <div className={`text-xl font-bold text-gray-900 ${blurClass}`}>
                {isProUser ? (matrixData[0].adjustment === Infinity ? '—' : `${matrixData[0].adjustment}`) : 'XX'} Months
              </div>
              <div className="text-[9px] text-gray-500 uppercase">Debt Freedom Fast-track</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-500">
          <Activity size={24} />
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Volatility Exposure Matrix</div>
          <div className="text-2xl font-bold text-gray-900">Logic: Tenure Variable</div>
          <div className="text-[10px] text-gray-500 uppercase mt-1">Market realistic simulation</div>
        </div>
      </div>

      <Card title="Volatility Exposure Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Event</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Effective Rate</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Timeline</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Adjustment</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold text-right">Lifetime Cost Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {matrixData.map((row, i) => (
                <tr key={i} className={`group hover:bg-gray-50 transition-colors ${i === 1 ? 'bg-blue-50/50' : ''}`}>
                  <td className="py-4 px-4">
                    <div className={`text-xs font-bold ${row.delta < 0 ? 'text-green-600' : row.delta > 0 ? 'text-red-600' : 'text-gray-900'} ${blurClass}`}>
                      {row.label}
                    </div>
                  </td>
                  <td className={`py-4 px-4 text-sm font-semibold text-gray-600 ${blurClass}`}>{row.effectiveRate.toFixed(2)}%</td>
                  <td className={`py-4 px-4 text-sm font-semibold text-gray-600 ${blurClass}`}>
                    {row.timelineMonths === Infinity ? 'Infinite' : `${row.timelineMonths} Mo`}
                  </td>
                  <td className="py-4 px-4">
                    <div className={`text-xs font-bold ${row.adjustment < 0 ? 'text-green-600' : row.adjustment > 0 ? 'text-red-600' : 'text-gray-500'} ${blurClass}`}>
                      {row.adjustment === 0 ? '—' : row.adjustment === Infinity ? 'Critical' : `${row.adjustment > 0 ? '+' : ''}${row.adjustment} Months`}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`text-sm font-bold ${row.costDelta < 0 ? 'text-green-600' : row.costDelta > 0 ? 'text-red-600' : 'text-gray-500'} ${blurClass}`}>
                      {row.costDelta === 0 ? '—' : row.costDelta === Infinity ? 'Uncapped' : `${row.costDelta > 0 ? '+' : ''}${formatCurrency(row.costDelta)}`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Total Interest Volatility">
          <div className={`h-48 ${blurClass}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matrixData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#6b7280" fontSize={10} />
                <YAxis hide />
                <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Cost Δ']} />
                <Bar dataKey="costDelta">
                  {matrixData.map((entry, index) => (
                    <ReCell key={`cell-${index}`} fill={entry.delta < 0 ? '#22c55e' : entry.delta > 0 ? '#ef4444' : '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase text-gray-500 font-bold">
            <span className="text-green-600">Savings</span>
            <span className="text-red-600">Risk Loss</span>
          </div>
        </Card>

        <Card title="Institutional Processing Logic">
          <p className="text-sm text-gray-600 leading-relaxed h-full flex flex-col justify-center">
            Most banks default to keeping your monthly EMI static. Rate hikes are absorbed by extending your timeline. While easier on monthly cash flow, it exponentially increases total interest cost, potentially adding years to your debt.
          </p>
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

    if (format === "month") {
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

    </div>
  );
}
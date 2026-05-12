import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Trash2, Plus, Flame } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts';
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

export default function TenureTrapCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [loanData, setLoanData] = useState({
    loanAmount: 5000000,
    interestRate: 8.5,
    tenureYears: 20
  });

  const [tenureOptions, setTenureOptions] = useState([5, 10, 15, 20, 25, 30]);
  const [newYear, setNewYear] = useState('');

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
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setLoanData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const addYear = () => {
    if (!isProUser) return;
    const year = parseInt(newYear);
    if (!isNaN(year) && year > 0 && !tenureOptions.includes(year)) {
      setTenureOptions([...tenureOptions, year].sort((a, b) => a - b));
      setNewYear('');
    }
  };

  const removeYear = (year) => {
    if (!isProUser) return;
    setTenureOptions(tenureOptions.filter(y => y !== year));
  };

  // Calculations
  const comparisonData = useMemo(() => {
    return [...tenureOptions].sort((a, b) => a - b).map(tenure => {
      const emi = calculateEmi(loanData.loanAmount, loanData.interestRate, tenure);
      const totalPaid = emi * tenure * 12;
      const interestPaid = totalPaid - loanData.loanAmount;
      const isTrap = interestPaid > loanData.loanAmount;
      
      return {
        tenure: `${tenure} Years`,
        tenureVal: tenure,
        emi: Math.round(emi),
        totalPaid: Math.round(totalPaid),
        interestPaid: Math.round(interestPaid),
        principal: loanData.loanAmount,
        isTrap,
        interestRatio: totalPaid > 0 ? (interestPaid / loanData.loanAmount) * 100 : 0
      };
    });
  }, [loanData.loanAmount, loanData.interestRate, tenureOptions]);

  const incrementalData = useMemo(() => {
    const sorted = [...comparisonData].sort((a, b) => a.tenureVal - b.tenureVal);
    const result = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      const extraInterest = next.interestPaid - current.interestPaid;
      const extraYears = next.tenureVal - current.tenureVal;
      const emiReduction = current.emi - next.emi;
      const wasteRatio = emiReduction > 0 ? (extraInterest / emiReduction).toFixed(1) : '0';

      result.push({
        label: `${current.tenureVal}yr → ${next.tenureVal}yr`,
        extraInterest,
        extraYears,
        wasteRatio
      });
    }
    return result;
  }, [comparisonData]);

  const currentTrap = comparisonData.find(d => d.tenureVal === loanData.tenureYears);
  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
            <Timer className="text-red-600" size={28} />
            Tenure Trap Detector
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Exposing the high cost of long-tenure loans. The "EMI Illusion" exposed.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Interest Overhead</div>
          <div className={`text-xl font-bold ${currentTrap?.isTrap ? 'text-red-600' : 'text-green-600'} ${blurClass}`}>
            {currentTrap?.interestRatio.toFixed(0)}%
          </div>
        </div>
      </div>

    {/* INPUT SECTION */}
<div className="space-y-3">

  <Card title="Loan Details">

    <div className="space-y-3">

      <EditableRangeField
        label="Loan Amount"
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
        label="Annual Interest Rate"
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
        label="Selected Tenure"
        value={loanData.tenureYears}
        onChange={(val) =>
          handleInputChange(
            "tenureYears",
            val
          )
        }
        min={1}
        max={30}
        step={1}
        format="year"
      />

    </div>

  </Card>

  {/* TENURE OPTIONS */}
  <Card title="Tenure Options">

    <div className="space-y-4">

      <div className="flex flex-wrap gap-2">

        {tenureOptions.map((year) => (

          <div
            key={year}
            className={`
              flex items-center gap-1
              px-3 py-2
              rounded-xl
              border
              text-[12px]
              font-semibold
              ${
                loanData.tenureYears === year
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-[#f8faff] border-[#edf1f7] text-gray-700"
              }
            `}
          >

            <button
              onClick={() =>
                setLoanData({
                  ...loanData,
                  tenureYears: year,
                })
              }
            >
              {year} Yrs
            </button>

            <button
              onClick={() =>
                removeYear(year)
              }
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={12} />
            </button>

          </div>

        ))}

      </div>

      <div className="flex gap-2">

        <input
          type="number"
          placeholder="Add year"
          value={newYear}
          onChange={(e) =>
            setNewYear(e.target.value)
          }
          className="
            flex-1
            h-10
            rounded-xl
            border border-[#d9e2f2]
            px-3
            text-sm
            font-semibold
            outline-none
          "
        />

        <button
          onClick={addYear}
          className="
            h-10 px-4
            rounded-xl
            bg-[#001B5E]
            text-white
            text-sm
            font-semibold
            flex items-center gap-1
          "
        >
          <Plus size={14} />
          Add
        </button>

      </div>

    </div>

  </Card>

</div>

      {/* TABLES SECTION */}
      <Card title="Table 1: Cost Comparison">
        <div className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-widest">
          Principal: {formatCurrency(loanData.loanAmount)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Tenure</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">EMI</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Total Paid</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Interest Paid</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold text-center">Trap Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparisonData.map((row) => (
                <tr 
                  key={row.tenure} 
                  className={`group transition-colors ${isProUser ? 'cursor-pointer hover:bg-blue-50/50' : ''} ${row.tenureVal === loanData.tenureYears ? 'bg-blue-50/30' : ''}`}
                  onClick={() => { if(isProUser) setLoanData({...loanData, tenureYears: row.tenureVal}) }}
                >
                  <td className="py-4 px-4">
                    <div className={`text-xs font-bold text-gray-900 ${blurClass}`}>{row.tenure}</div>
                  </td>
                  <td className={`py-4 px-4 text-sm font-semibold text-gray-700 ${blurClass}`}>{formatCurrency(row.emi)}</td>
                  <td className={`py-4 px-4 text-sm font-semibold text-gray-700 ${blurClass}`}>{formatCurrency(row.totalPaid)}</td>
                  <td className="py-4 px-4">
                    <div className={`text-sm font-bold ${row.isTrap ? 'text-red-600' : 'text-green-600'} ${blurClass}`}>
                      {formatCurrency(row.interestPaid)}
                    </div>
                    <div className={`text-[9px] text-gray-500 uppercase font-semibold mt-0.5 ${blurClass}`}>
                      {row.interestRatio.toFixed(0)}% of Principal
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.isTrap ? (
                      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-md text-[9px] text-red-600 font-bold uppercase tracking-widest ${blurClass}`}>
                        <Flame size={10} /> Trap
                      </div>
                    ) : (
                      <span className={`text-gray-400 font-bold ${blurClass}`}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title='Table 2: The Price of "Lower EMI"'>
        <div className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-widest">
          Every jump in tenure adds a massive silent cost.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Tenure Increase</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Extra Interest Burden</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Extra Years</th>
                <th className="py-3 px-4 text-[10px] uppercase text-gray-500 font-bold">Waste Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incrementalData.map((row, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`text-xs font-bold text-gray-900 ${blurClass}`}>{row.label}</div>
                  </td>
                  <td className={`py-4 px-4 text-sm font-bold text-red-600 ${blurClass}`}>+{formatCurrency(row.extraInterest)}</td>
                  <td className={`py-4 px-4 text-sm font-semibold text-gray-700 ${blurClass}`}>+{row.extraYears} Years</td>
                  <td className="py-4 px-4">
                    <div className={`text-sm font-bold text-yellow-600 ${blurClass}`}>{row.wasteRatio}x</div>
                    <div className={`text-[9px] text-gray-500 uppercase font-semibold mt-0.5 ${blurClass}`}>Interest per ₹1 EMI saved</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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

  // SYNC VALUE
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
    <div
      className="
        bg-white
        rounded-[18px]
        px-4
        py-4
        shadow-sm
        border border-[#edf1f7]
      "
    >

      {/* TOP */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          <p className="text-[11px] text-gray-500 font-medium">
            {label}
          </p>

          {!editing ? (
            <h3 className="text-[20px] leading-tight font-black text-[#081c4b] mt-2 break-words">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveValue();
                  }
                }}
                className="
                  h-11
                  flex-1
                  rounded-2xl
                  border border-[#d9e2f2]
                  px-4
                  text-[15px]
                  font-bold
                  outline-none
                  focus:border-[#001B5E]
                "
              />

              <button
                onClick={saveValue}
                className="
                  h-11
                  px-4
                  rounded-2xl
                  bg-[#001B5E]
                  text-white
                  text-[13px]
                  font-bold
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
              w-10 h-10
              rounded-2xl
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

      {/* RANGE */}
      <div className="mt-4">

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
            accent-[#001B5E]
          "
        />

        <div className="flex justify-between text-[10px] text-gray-400 mt-2">

          <span>
            {format === "currency"
              ? "₹1L"
              : format === "percent"
              ? "1%"
              : "1Y"}
          </span>

          <span>
            {format === "currency"
              ? "₹1Cr"
              : format === "percent"
              ? "15%"
              : "30Y"}
          </span>

        </div>

      </div>

    </div>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

// Reusable Card Component for Light Theme UI
const Card = ({ children, title, className = "" }) => (
  <div className={`bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-sm ${className}`}>
    {title && (
      <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{title}</h3>
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

  // MAIN STATE
  const [loanData, setLoanData] = useState({
    monthlyIncome: 120000,
    existingEmis: 25000,
    city: 'Metro',
    interestRate: 8.5,
    tenureYears: 20,
    loanAmount: 5000000
  });



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
    if (totalBurden <= safeLimitPercent) return { label: 'SAFE', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
    if (totalBurden <= bankMaxLimitPercent) return { label: 'WATCH', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'DANGER', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
  }, [totalBurden, safeLimitPercent, bankMaxLimitPercent]);

  const blurClass = !isProUser ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">

      {!isProUser && <ProUpgradeBanner />}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-300 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-green-600" size={24} />
            Loan Safety Engine
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">Preventing financial over-leverage through income-to-debt analysis.</p>
        </div>
        <div className={`px-4 py-2 rounded-md border ${status.bg} ${status.border} w-fit`}>
          <span className={`text-xs font-bold uppercase tracking-widest ${status.color}`}>
            {!isProUser  ? 'PRO REQUIRED' : `${status.label} ZONE`}
          </span>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Your Financials">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Monthly In-Hand Income (₹)</label>
              {isProUser ? (
                <input
                  type="number"
                  value={loanData.monthlyIncome}
                  onChange={(e) => setLoanData({ ...loanData, monthlyIncome: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  120000
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Existing Monthly EMIs (₹)</label>
              {isProUser ? (
                <input
                  type="number"
                  value={loanData.existingEmis}
                  onChange={(e) => setLoanData({ ...loanData, existingEmis: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  25000
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">City Type</label>
              {isProUser ? (
                <select
                  value={loanData.city}
                  onChange={(e) => setLoanData({ ...loanData, city: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                >
                  <option value="Metro">Metro / Tier 1</option>
                  <option value="Non-Metro">Non-Metro / Tier 2+</option>
                </select>
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  Metro / Tier 1
                </div>
              )}
              <p className="text-[10px] text-neutral-500 mt-1 italic leading-tight">
                {loanData.city === 'Metro' ? 'Higher living costs. Safety buffer adjusted (-5%).' : 'Standard living costs. No safety buffer penalty.'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Loan Parameters">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Proposed Loan Amount (₹)</label>
              {isProUser ? (
                <input
                  type="number" step="100000"
                  value={loanData.loanAmount}
                  onChange={(e) => setLoanData({ ...loanData, loanAmount: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  5000000
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Interest Rate (%)</label>
              {isProUser ? (
                <input
                  type="number" step="0.1"
                  value={loanData.interestRate}
                  onChange={(e) => setLoanData({ ...loanData, interestRate: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  8.5
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">Tenure (Years)</label>
              {isProUser ? (
                <input
                  type="number"
                  value={loanData.tenureYears}
                  onChange={(e) => setLoanData({ ...loanData, tenureYears: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 focus:border-neutral-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-900 ${blurClass}`}>
                  20
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card title="Tier-Based Rules">
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-md border border-neutral-200">
              <span className="text-[11px] uppercase text-neutral-500 font-semibold tracking-wider">Safe Base Rule:</span>
              <span className={`text-sm font-bold text-green-600 ${blurClass}`}>{safeLimitPercent}%</span>
            </div>
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-md border border-neutral-200">
              <span className="text-[11px] uppercase text-neutral-500 font-semibold tracking-wider">Bank Max Limit:</span>
              <span className={`text-sm font-bold text-red-600 ${blurClass}`}>{bankMaxLimitPercent}%</span>
            </div>
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-[11px] text-neutral-500 leading-relaxed italic">
                Targets are calculated dynamically based on your income bracket and city living costs.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* RESULTS DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <ShieldCheck size={100} className="text-green-700" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-[10px] text-green-700 uppercase font-bold tracking-widest">Ideal & Safe Loan ({safeLimitPercent}%)</div>
              <CheckCircle2 size={16} className="text-green-600" />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold text-neutral-900 relative z-10 ${blurClass}`}>
              {formatCurrency(idealLoanAmount)}
            </div>
            <div className="text-[11px] font-semibold text-neutral-500 mt-2 uppercase relative z-10">Maximum stress-free loan amount</div>
            <p className="text-[11px] text-neutral-500 mt-1 relative z-10">Leaves enough room for lifestyle, investments, and life's surprises.</p>
          </div>

          <div className="p-5 bg-red-50 border border-red-200 rounded-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <AlertTriangle size={100} className="text-red-700" />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-[10px] text-red-700 uppercase font-bold tracking-widest">Bank Max Zone ({bankMaxLimitPercent}%)</div>
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className={`text-2xl sm:text-3xl font-bold text-neutral-900 relative z-10 ${blurClass}`}>
              {formatCurrency(bankMaxLoanAmount)}
            </div>
            <div className="text-[11px] font-semibold text-neutral-500 mt-2 uppercase relative z-10">Maximum bank approval for your salary</div>
            <p className="text-[11px] text-neutral-500 mt-1 relative z-10">Banks assume survival on basics. Expect high lifestyle sacrifice here.</p>
          </div>
        </div>

        <Card title="Visual Safety Audit">
          <div className="space-y-8 mt-2">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs font-bold text-neutral-900 uppercase tracking-tight">Debt Comparison: Salary Tier {bankMaxLimitPercent}% Bracket</div>
                <div className={`text-[12px] text-neutral-500 font-medium mt-1 ${blurClass}`}>Current Burden: {currentBurden.toFixed(1)}%</div>
              </div>
              <div className={`text-3xl font-bold ${status.color} ${blurClass}`}>{totalBurden.toFixed(1)}%</div>
            </div>

            <div className="relative pt-6 pb-2">
              <div className="h-4 bg-neutral-200 rounded-full overflow-hidden flex border border-neutral-300">
                <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${safeLimitPercent}%` }} />
                <div className="bg-yellow-500 h-full transition-all duration-1000" style={{ width: `${bankMaxLimitPercent - safeLimitPercent}%` }} />
                <div className="bg-red-500 h-full flex-1" />
              </div>

              {/* Marker for total burden */}
              {isProUser && (
                <div
                  className="absolute top-2 w-0.5 h-12 bg-black z-10 transition-all duration-1000 shadow-md"
                  style={{ left: `${Math.min(100, totalBurden)}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white whitespace-nowrap bg-black px-2 py-1 rounded shadow">
                    YOU: {formatCurrency(proposedEmi + loanData.existingEmis)}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <span className={`text-[10px] text-neutral-500 uppercase font-bold tracking-wider ${blurClass}`}>Safe ({safeLimitPercent}%)</span>
                </div>
                <div className={`text-base font-bold text-neutral-900 ${blurClass}`}>{formatCurrency(safeEMICap)}</div>
                <p className="text-[10px] text-neutral-500">The tier-adjusted limit for a high-quality lifestyle.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                  <span className={`text-[10px] text-neutral-500 uppercase font-bold tracking-wider ${blurClass}`}>Ceiling ({bankMaxLimitPercent}%)</span>
                </div>
                <div className={`text-base font-bold text-neutral-900 ${blurClass}`}>{formatCurrency(stretchEMICap)}</div>
                <p className="text-[10px] text-neutral-500">The technical limit of what you can borrow by law.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Danger Zone</span>
                </div>
                <div className={`text-base font-bold text-red-600 ${blurClass}`}>{">"} {bankMaxLimitPercent}%</div>
                <p className="text-[10px] text-neutral-500">Financial insolvency risks are highest beyond this point.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
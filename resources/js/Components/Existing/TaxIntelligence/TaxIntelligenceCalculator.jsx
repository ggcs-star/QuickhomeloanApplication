import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  BrainCircuit, 
  CircleAlert, 
  Landmark,
  ArrowRight
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function TaxIntelligenceCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    section24: 200000,
    section80C: 84200
  });

  const SECTION_24_MAX = 200000;
  const SECTION_80C_MAX = 150000;

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    const numValue = parseFloat(value) || 0;
    
    if (field === 'section24') {
      setFormData(prev => ({ ...prev, [field]: Math.min(numValue, SECTION_24_MAX) }));
    } else if (field === 'section80C') {
      setFormData(prev => ({ ...prev, [field]: Math.min(numValue, SECTION_80C_MAX) }));
    }
  };

  // Auto-calculate metrics using useMemo
  const calculations = useMemo(() => {
    const section24Percentage = (formData.section24 / SECTION_24_MAX) * 100;
    const section80CPercentage = (formData.section80C / SECTION_80C_MAX) * 100;
    
    const safeClaimMin = Math.max(150000, formData.section24 * 0.75);
    const safeClaimMax = Math.min(200000, formData.section24);

    return {
      section24Percentage,
      section80CPercentage,
      safeClaimRangeMin: Math.round(safeClaimMin / 1000) * 1000,
      safeClaimRangeMax: Math.round(safeClaimMax / 1000) * 1000,
      expectedInterest: 242000 // Placeholder for projection
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";
  const totalDeduction = formData.section24 + formData.section80C;

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* INPUT CARD */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-gray-700" />
            <h2 className="text-lg font-semibold">Benefit Utilization Audit</h2>
          </div>
          <div className={`px-3 py-1 rounded-md flex items-center gap-2 text-white ${
            isProUser ? (calculations.section24Percentage >= 80 ? 'bg-green-600' : calculations.section24Percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600') : 'bg-gray-500'
          }`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {!isProUser ? 'Pro Required' : (calculations.section24Percentage >= 80 ? 'HIGH' : calculations.section24Percentage >= 50 ? 'MODERATE' : 'LOW') + ' UTILIZATION'}
            </span>
          </div>
        </div>

        <div className="space-y-5 mb-5">
          {/* Section 24(b) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-500 uppercase">Section 24(b) - Interest</label>
              <span className={`text-base font-semibold ${blurClass}`}>{formatCurrency(formData.section24)}</span>
            </div>
            {isProUser ? (
              <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                <span className="text-gray-500 font-semibold mr-2">₹</span>
                <input 
                  type="number" value={formData.section24}
                  onChange={(e) => handleInputChange('section24', e.target.value)}
                  className="w-full font-semibold bg-transparent outline-none" 
                  min="0" max={SECTION_24_MAX} step="1000"
                />
              </div>
            ) : (
              <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold ${blurClass}`}>₹ 2,00,000</div>
            )}
            {isProUser && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${calculations.section24Percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mt-1">
                  <span>₹0</span>
                  <span>{formatCurrency(SECTION_24_MAX)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 80C */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-500 uppercase">Section 80C - Principal</label>
              <span className={`text-base font-semibold ${blurClass}`}>{formatCurrency(formData.section80C)}</span>
            </div>
            {isProUser ? (
              <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                <span className="text-gray-500 font-semibold mr-2">₹</span>
                <input 
                  type="number" value={formData.section80C}
                  onChange={(e) => handleInputChange('section80C', e.target.value)}
                  className="w-full font-semibold bg-transparent outline-none" 
                  min="0" max={SECTION_80C_MAX} step="1000"
                />
              </div>
            ) : (
              <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold ${blurClass}`}>₹ 84,200</div>
            )}
            {isProUser && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${calculations.section80CPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mt-1">
                  <span>₹0</span>
                  <span>{formatCurrency(SECTION_80C_MAX)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Compliance Tip */}
          <div className="bg-gray-50 p-4 rounded-xl border flex items-start gap-3">
            <CircleAlert className="text-blue-500 shrink-0 mt-0.5 w-4 h-4" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-gray-800">Compliance Tip</p>
              <p className="text-xs text-gray-600 leading-relaxed font-regular">
                If the house is self-occupied, interest deduction is capped at ₹2 Lakhs. If rented out, the entire interest can be offset against rental income.
              </p>
            </div>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Tax Audit'}
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${isProUser ? (calculations.section24Percentage >= 80 ? 'bg-green-50 border-green-200' : calculations.section24Percentage >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200') : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Sec 24(b) Utilization</p>
            <span className={`font-bold text-lg ${isProUser ? (calculations.section24Percentage >= 80 ? 'text-green-600' : calculations.section24Percentage >= 50 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-500'} ${blurClass}`}>
              {calculations.section24Percentage.toFixed(1)}%
            </span>
            <p className="text-[10px] text-gray-500 font-semibold mt-1 italic">
              {isProUser ? (calculations.section24Percentage >= 80 ? 'Max benefit claimed' : 'Room for optimization') : 'Pro feature'}
            </p>
          </div>
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Potential Deduction</p>
            <span className={`font-bold text-lg block ${blurClass}`}>{formatCurrency(totalDeduction)}</span>
            <p className="text-[10px] text-green-600 font-semibold mt-1 uppercase">Combined tax benefit</p>
          </div>
        </div>

        {/* Impact Box */}
        <div className={`p-5 rounded-xl text-white flex flex-col justify-between ${isProUser ? (totalDeduction > 300000 ? 'bg-green-700' : totalDeduction > 200000 ? 'bg-[#1f2a3c]' : 'bg-gray-700') : 'bg-gray-600'}`}>
          <div className="mb-4">
            <p className={`text-xs font-bold uppercase mb-1 opacity-80`}>Tax Benefit Impact</p>
            <span className={`font-bold text-3xl block ${blurClass}`}>
              {formatCurrency(totalDeduction)}
            </span>
            <p className="text-xs mt-2 italic opacity-90">
              {isProUser ? (calculations.section24Percentage >= 80 ? 'You are maximizing your Section 24(b) benefits.' : 'Consider optimizing your interest certificate for higher benefits.') : 'Upgrade to see optimization tips'}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-gray-300">Safe Claim Range</span>
            <span className={`font-bold ${blurClass}`}>{formatCurrency(calculations.safeClaimRangeMin)} - {formatCurrency(calculations.safeClaimRangeMax)}</span>
          </div>
        </div>

        {/* Provisional Projection */}
        <div className="bg-white p-4 rounded-xl border flex items-start gap-4">
          <Landmark className="text-blue-500 shrink-0 w-6 h-6 mt-1" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-gray-800 mb-3">Provisional Projection</p>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold">Expected Interest</p>
                <p className={`font-bold text-sm ${blurClass}`}>{formatCurrency(calculations.expectedInterest)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">80C Utilization</p>
                <p className={`font-bold text-sm text-yellow-600 ${blurClass}`}>{calculations.section80CPercentage.toFixed(1)}%</p>
              </div>
            </div>
            <button className={`text-[11px] font-bold uppercase flex items-center gap-1 ${isProUser ? 'text-black hover:underline' : 'text-gray-400 cursor-not-allowed'}`} disabled={!isProUser}>
              Generate Provisional Certificate <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
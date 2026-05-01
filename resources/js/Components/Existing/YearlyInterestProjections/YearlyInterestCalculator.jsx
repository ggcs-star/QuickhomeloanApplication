import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  BrainCircuit, 
  Calendar as CalendarIcon,
  CircleAlert,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function YearlyInterestCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [formData, setFormData] = useState({
    loanOutstanding: 5000000,
    emiAmount: 45000,
    emisPaid: 12,
    tenureYears: 15
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
    const totalEMIPaid = formData.emiAmount * formData.emisPaid;
    const monthlyRate = 0.0702 / 12; // Static for demonstration, replace with actual logic if needed
    const interest = formData.loanOutstanding * monthlyRate * formData.emisPaid;
    const principal = totalEMIPaid - interest;
    const interestPercentage = totalEMIPaid > 0 ? (interest / totalEMIPaid) * 100 : 0;

    return {
      totalEMIPaid,
      interestComponent: Math.round(interest),
      principalComponent: Math.round(principal),
      interestPercentage: parseFloat(interestPercentage.toFixed(2)),
      annualROI: 7.02
    };
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getInterestLevelColor = (percentage) => {
    if (percentage < 50) return 'text-green-600 bg-green-50';
    if (percentage < 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
            <h2 className="text-lg font-semibold">Yearly Interest & Rate Audit</h2>
          </div>
          <div className={`px-3 py-1 rounded-md flex items-center gap-2 text-white ${
            isProUser ? (calculations.interestPercentage < 50 ? 'bg-green-600' : calculations.interestPercentage < 70 ? 'bg-yellow-600' : 'bg-red-600') : 'bg-gray-500'
          }`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {!isProUser ? 'Pro Required' : (calculations.interestPercentage < 50 ? 'Low' : calculations.interestPercentage < 70 ? 'Moderate' : 'High') + ' Interest'}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          {/* Loan Outstanding */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Loan Outstanding</label>
            {isProUser ? (
              <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                <span className="text-gray-500 font-semibold mr-2">₹</span>
                <input 
                  type="number" 
                  value={formData.loanOutstanding}
                  onChange={(e) => handleInputChange('loanOutstanding', e.target.value)}
                  className="w-full font-semibold bg-transparent outline-none" 
                />
              </div>
            ) : (
              <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold ${blurClass}`}>₹ 50,00,000</div>
            )}
          </div>

          {/* EMI & Paid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">EMI Amount</label>
              {isProUser ? (
                <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                  <span className="text-gray-500 font-semibold mr-2">₹</span>
                  <input 
                    type="number" 
                    value={formData.emiAmount}
                    onChange={(e) => handleInputChange('emiAmount', e.target.value)}
                    className="w-full font-semibold bg-transparent outline-none" 
                  />
                </div>
              ) : (
                <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold flex items-center gap-2 ${blurClass}`}>₹ 45,000</div>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">EMIs Paid</label>
              {isProUser ? (
                <div className="mt-1 border rounded-xl px-4 py-3 flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.emisPaid}
                    onChange={(e) => handleInputChange('emisPaid', e.target.value)}
                    className="w-full font-semibold bg-transparent outline-none" 
                  />
                </div>
              ) : (
                <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold flex items-center gap-2 ${blurClass}`}>12</div>
              )}
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-500 uppercase">Tenure (Years)</label>
              {isProUser && (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getInterestLevelColor(calculations.interestPercentage)}`}>
                  {calculations.interestPercentage}% Interest Share
                </span>
              )}
            </div>
            {isProUser ? (
              <div className="mt-1 border rounded-xl px-4 py-3 flex items-center gap-2">
                <CalendarIcon size={16} className="text-gray-400" />
                <input 
                  type="number" 
                  value={formData.tenureYears}
                  onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                  className="w-full font-semibold bg-transparent outline-none" 
                />
              </div>
            ) : (
              <div className={`mt-1 border rounded-xl px-4 py-3 font-semibold flex items-center gap-2 ${blurClass}`}>
                <CalendarIcon size={16} className="text-gray-400" /> 15
              </div>
            )}
          </div>

          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-xl border flex items-start gap-3">
            <CircleAlert className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase text-gray-800">Compliance Note</p>
              <p className="text-[11px] text-gray-600 mt-1">All calculations are based on standard amortization schedules as per RBI Master Circular on Fair Lending Practices.</p>
            </div>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!isProUser}
        >
          <BrainCircuit size={16} />
          {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Interest Audit'}
        </button>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border p-4 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Interest Component</p>
            <span className={`font-bold text-lg ${blurClass}`}>{formatCurrency(calculations.interestComponent)}</span>
            <p className="text-[10px] text-red-600 font-semibold mt-1 uppercase">Bank's Earnings</p>
          </div>
          
          <div className={`border p-4 rounded-xl ${isProUser ? (calculations.interestPercentage > 65 ? 'bg-red-50 border-red-200' : calculations.interestPercentage > 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200') : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Interest Share</p>
            <span className={`font-bold text-lg ${isProUser ? (calculations.interestPercentage > 65 ? 'text-red-600' : calculations.interestPercentage > 50 ? 'text-yellow-600' : 'text-green-600') : 'text-gray-500'} ${blurClass}`}>
              {calculations.interestPercentage}%
            </span>
            <p className="text-[10px] text-gray-500 font-semibold mt-1 italic">
              {isProUser ? (calculations.interestPercentage > 65 ? 'High interest burden' : 'Moderate interest burden') : 'Pro feature'}
            </p>
          </div>
        </div>

        {/* Impact Box */}
        <div className={`p-5 rounded-xl text-white flex flex-col justify-between ${isProUser ? (calculations.interestPercentage > 65 ? 'bg-[#1f2a3c]' : 'bg-green-700') : 'bg-gray-600'}`}>
          <div className="mb-4">
            <p className={`text-xs font-bold uppercase mb-1 opacity-80`}>Interest Cost Impact</p>
            <span className={`font-bold text-2xl block ${blurClass}`}>
              {calculations.interestPercentage}% Interest Share
            </span>
            <p className="text-xs mt-2 italic opacity-90">
              {isProUser ? `You're paying ₹${Math.round(calculations.interestComponent/calculations.totalEMIPaid*1000)/10} per ₹100 of EMI to the bank.` : 'Upgrade to see detailed impact'}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-gray-300">Total EMI Paid</span>
            <span className={`font-bold ${blurClass}`}>{formatCurrency(calculations.totalEMIPaid)}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white p-4 rounded-xl border flex items-start gap-4">
          <PieChart className="text-blue-500 shrink-0 w-6 h-6 mt-1" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-gray-800 mb-3">Detailed Breakdown</p>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold">Annual ROI</p>
                <p className={`font-bold text-sm ${blurClass}`}>{calculations.annualROI}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Principal Paid</p>
                <p className={`font-bold text-sm text-green-600 ${blurClass}`}>{formatCurrency(calculations.principalComponent)}</p>
              </div>
            </div>
            <button className={`text-[11px] font-bold uppercase flex items-center gap-1 ${isProUser ? 'text-black hover:underline' : 'text-gray-400 cursor-not-allowed'}`} disabled={!isProUser}>
              View Amortization Schedule <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
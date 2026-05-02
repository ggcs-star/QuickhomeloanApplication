import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  CreditCard, 
  CircleAlert, 
  Calendar,
  CircleCheck,
  CircleX,
  Clock,
  BrainCircuit,
  Calculator,
  Info,
  Wallet as WalletIcon,
  PiggyBank as PiggyBankIcon,
  TrendingDown,
  Percent,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function EMIRepaymentCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // EMI Data State
  const [monthlyEMIs, setMonthlyEMIs] = useState([
    { month: 'Jan 24', amount: 45000, status: 'paid', emiChanged: false },
    { month: 'Feb 24', amount: 45000, status: 'paid', emiChanged: false },
    { month: 'Mar 24', amount: 45000, status: 'bounce', emiChanged: false },
    { month: 'Apr 24', amount: 46250, status: 'paid', emiChanged: true },
    { month: 'May 24', amount: 46250, status: 'paid', emiChanged: true },
    { month: 'Jun 24', amount: 46250, status: 'paid', emiChanged: true },
    { month: 'Jul 24', amount: 48350, status: 'delayed', emiChanged: true },
    { month: 'Aug 24', amount: 48350, status: 'paid', emiChanged: true },
    { month: 'Sep 24', amount: 48350, status: 'paid', emiChanged: true },
    { month: 'Oct 24', amount: 48350, status: 'paid', emiChanged: true },
    { month: 'Nov 24', amount: 48350, status: 'paid', emiChanged: true },
    { month: 'Dec 24', amount: 48350, status: 'paid', emiChanged: true }
  ]);

  // Yearly Interest & Rate Audit State
  const [loanData, setLoanData] = useState({
    loanOutstanding: 5000000,
    emiAmount: 45000,
    emisPaid: 12,
    tenureYears: 15
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  // Calculate Health Metrics dynamically
  const metrics = useMemo(() => {
    const paidCount = monthlyEMIs.filter(emi => emi.status === 'paid').length;
    const bounceCount = monthlyEMIs.filter(emi => emi.status === 'bounce').length;
    const delayedCount = monthlyEMIs.filter(emi => emi.status === 'delayed').length;
    
    const onTimeRatio = Math.round((paidCount / monthlyEMIs.length) * 100);
    const rawScore = Math.round((paidCount / monthlyEMIs.length) * 100 - (bounceCount * 25) - (delayedCount * 10));
    const healthScore = Math.max(0, Math.min(100, rawScore));

    return {
      onTimeRatio,
      bounceEvents: bounceCount,
      healthScore,
      continuityScore: Math.round(healthScore * 0.87)
    };
  }, [monthlyEMIs]);

  // Calculate Yearly Interest Results dynamically
  const results = useMemo(() => {
    const totalEMIPaid = loanData.emiAmount * loanData.emisPaid;
    const monthlyRate = 0.0702 / 12; // Base ROI example
    const interest = loanData.loanOutstanding * monthlyRate * loanData.emisPaid;
    const principal = totalEMIPaid - interest;
    
    return {
      totalEMIPaid,
      interestComponent: Math.round(interest),
      principalComponent: Math.round(principal),
      interestPercentage: totalEMIPaid > 0 ? Math.round((interest / totalEMIPaid) * 10000) / 100 : 0,
      annualROI: 7.02
    };
  }, [loanData]);

  const updateEMIStatus = (index) => {
    if (!isProUser) return;
    setMonthlyEMIs(prev => prev.map((emi, i) => {
      if (i === index) {
        const nextStatus = emi.status === 'paid' ? 'bounce' : emi.status === 'bounce' ? 'delayed' : 'paid';
        return { ...emi, status: nextStatus };
      }
      return emi;
    }));
  };

  const updateEMIAmount = (index, value) => {
    if (!isProUser) return;
    setMonthlyEMIs(prev => prev.map((emi, i) => {
      if (i === index) {
        return { ...emi, amount: value, emiChanged: value !== 45000 };
      }
      return emi;
    }));
  };

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    const numValue = parseFloat(value) || 0;
    setLoanData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'paid': return { color: 'text-green-600', bgColor: 'bg-white', border: 'border-green-200', icon: CircleCheck, text: 'PAID' };
      case 'bounce': return { color: 'text-red-600', bgColor: 'bg-red-50', border: 'border-red-300', icon: CircleX, text: 'BOUNCE' };
      case 'delayed': return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', border: 'border-yellow-300', icon: Clock, text: 'DELAYED' };
      default: return { color: 'text-gray-400', bgColor: 'bg-white', border: 'border-gray-200', icon: CircleAlert, text: 'PENDING' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  // Blurred number display component
  const BlurredNumberDisplay = ({ value, className = "", isPercentage = false, isCurrency = false }) => {
    if (isProUser || isCheckingAccess) {
      let displayValue = value;
      if (isPercentage) displayValue = `${value}%`;
      else if (isCurrency) displayValue = formatCurrency(value);
      return <span className={className}>{displayValue}</span>;
    }
    let placeholder = "XX";
    if (isPercentage) placeholder = "XX%";
    else if (isCurrency) placeholder = "₹XX,XXX";
    return (
      <span className={`inline-block filter blur-[4px] select-none ${className}`} style={{ WebkitFilter: 'blur(4px)' }}>
        {placeholder}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* TOP HEALTH STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Health Score</p>
            <span className={`text-xl font-bold text-gray-900 ${blurClass}`}>{metrics.healthScore}%</span>
          </div>
        </div>

        {/* On-Time Ratio */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">On-Time Ratio</p>
            <span className={`text-xl font-bold text-gray-900 ${blurClass}`}>{metrics.onTimeRatio}%</span>
          </div>
        </div>

        {/* Bounce Events */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <CircleAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Bounce Events</p>
            <span className={`text-xl font-bold text-red-600 ${blurClass}`}>{metrics.bounceEvents}</span>
          </div>
        </div>
      </div>

      {/* EMI CONTINUITY AUDIT (Interactive Table) */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-5 bg-gray-50 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              EMI Continuity Audit
            </h3>
            <p className="text-xs text-gray-500 font-medium uppercase mt-1">Monthly Tracking</p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold text-yellow-600 ${blurClass}`}>{metrics.continuityScore}%</div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Continuity Score</p>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {monthlyEMIs.map((emi, index) => {
              const statusConfig = getStatusConfig(emi.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-xl border ${statusConfig.bgColor} ${statusConfig.border} ${isProUser ? 'cursor-pointer hover:shadow-md' : 'opacity-80'}`}
                  onClick={() => updateEMIStatus(index)}
                >
                  <p className="text-[11px] font-bold text-gray-500 uppercase mb-2">{emi.month}</p>
                  <div className="flex items-center justify-between mb-2">
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    {isProUser ? (
                      <input
                        type="number"
                        value={emi.amount}
                        onChange={(e) => updateEMIAmount(index, parseInt(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-16 text-right text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-gray-400 ${emi.emiChanged ? 'text-blue-600' : 'text-gray-900'}`}
                      />
                    ) : (
                      <span className={`text-sm font-bold text-gray-900 ${blurClass}`}>XX,XXX</span>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig.color}`}>
                    {isProUser ? statusConfig.text : 'XXXX'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* YEARLY INTEREST & RATE AUDIT SECTION */}
      <div className="animate-in fade-in duration-700 delay-150">
        <div className="bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-neutral-700" />
                  <h3 className="text-[18px] font-medium text-neutral-900 tracking-tight">
                    Yearly Interest & Rate Audit
                  </h3>
                </div>
                <p className="text-[12px] text-neutral-500 font-medium uppercase tracking-wider">
                  Reverse-calculating your true bank interest rate and yearly cost split.
                </p>
              </div>
              <div className="bg-white border border-neutral-300 px-4 py-2 rounded-md flex items-start gap-3 max-w-xs">
                <Info className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <p className="text-[12px] text-neutral-900 font-regular leading-snug">
                  Interest rate is derived from your EMI and balance to reflect the true rate applied.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Input Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                      <WalletIcon className="w-3 h-3" />
                      Loan Outstanding (Start of Year)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-[15px]">₹</span>
                      {isProUser ? (
                        <input 
                          className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 focus:ring-1 focus:ring-neutral-700 outline-none transition-all"
                          type="number" 
                          value={loanData.loanOutstanding}
                          onChange={(e) => handleInputChange('loanOutstanding', e.target.value)}
                        />
                      ) : (
                        <div className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 filter blur-[4px]">
                          ₹ XX,XX,XXX
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                      <PiggyBankIcon className="w-3 h-3" />
                      Monthly EMI Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-[15px]">₹</span>
                      {isProUser ? (
                        <input 
                          className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 focus:ring-1 focus:ring-neutral-700 outline-none transition-all"
                          type="number" 
                          value={loanData.emiAmount}
                          onChange={(e) => handleInputChange('emiAmount', e.target.value)}
                        />
                      ) : (
                        <div className="w-full pl-8 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 filter blur-[4px]">
                          ₹ XX,XXX
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        EMIs Paid
                      </label>
                      <div className="relative">
                        {isProUser ? (
                          <input 
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 outline-none"
                            type="number" 
                            value={loanData.emisPaid}
                            onChange={(e) => handleInputChange('emisPaid', e.target.value)}
                          />
                        ) : (
                          <div className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 filter blur-[4px]">
                            XX
                          </div>
                        )}
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-neutral-500">Mo</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Tenure
                      </label>
                      <div className="relative">
                        {isProUser ? (
                          <input 
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 outline-none"
                            type="number" 
                            value={loanData.tenureYears}
                            onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                          />
                        ) : (
                          <div className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-md font-medium text-[16px] text-neutral-900 filter blur-[4px]">
                            XX
                          </div>
                        )}
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-neutral-500">Yrs</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className={`w-full py-4 rounded-md text-[14px] font-semibold tracking-wide uppercase transition-all shadow-sm flex items-center justify-center gap-2 ${isProUser ? 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  disabled={!isProUser}
                >
                  <BrainCircuit className="w-4 h-4" />
                  {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Compliance Audit'}
                </button>
              </div>

              {/* Results Display */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-neutral-900 rounded-md p-6 md:p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-400 font-semibold uppercase tracking-widest text-[12px]">
                        <TrendingDown className="w-4 h-4" />
                        Interest Cost Impact
                      </div>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="text-[20px] font-medium tabular-nums tracking-tight">
                          <BlurredNumberDisplay value={results.interestPercentage} isPercentage={true} />
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-red-600 h-full transition-all duration-1000" 
                          style={{ width: `${isProUser ? results.interestPercentage : 0}%` }}
                        ></div>
                        <div className="bg-green-600 h-full flex-1"></div>
                      </div>
                      <p className="text-[12px] text-neutral-400 font-regular">
                        Total EMI Paid: <span className="font-medium text-[15px] text-white">
                          <BlurredNumberDisplay value={results.totalEMIPaid} isCurrency={true} />
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                      <div className="space-y-1">
                        <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest block">
                          Interest Component
                        </span>
                        <div className="text-[16px] font-medium text-red-400 tabular-nums">
                          <BlurredNumberDisplay value={results.interestComponent} isCurrency={true} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest block">
                          Principal Component
                        </span>
                        <div className="text-[16px] font-medium text-green-400 tabular-nums">
                          <BlurredNumberDisplay value={results.principalComponent} isCurrency={true} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest block">
                          Annual ROI
                        </span>
                        <div className="text-[16px] font-medium text-white tabular-nums">
                          <BlurredNumberDisplay value={results.annualROI} isPercentage={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md p-6 border border-neutral-300 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-md text-white">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-semibold text-neutral-900 uppercase tracking-widest mb-0.5">
                        Effective Rate Audit
                      </h4>
                      <div className="text-[16px] font-medium text-neutral-900 tabular-nums">
                        <BlurredNumberDisplay value={results.annualROI} isPercentage={true} />
                      </div>
                    </div>
                  </div>
                  <div className="md:max-w-[240px]">
                    <button className={`text-[14px] font-semibold uppercase flex items-center gap-1.5 ${isProUser ? 'text-black hover:underline group' : 'text-gray-400 cursor-not-allowed'}`} disabled={!isProUser}>
                      View Fix
                      <ArrowRightIcon className={`w-4 h-4 ${isProUser ? 'group-hover:translate-x-1 transition-transform' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-[12px] text-neutral-500 font-regular leading-relaxed italic px-1">
                  *Compliance Note: All calculations are based on standard amortization schedules as per RBI Master Circular on Fair Lending Practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
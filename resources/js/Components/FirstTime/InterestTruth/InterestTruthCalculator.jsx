import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Info, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
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

export default function InterestTruthCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [loanData, setLoanData] = useState({
    loanAmount: 5000000,
    tenureYears: 20,
    interestRate: 8.5
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
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const generateAmortizationSchedule = (p, annualRate, years) => {
    if (!p || !annualRate || !years) return [];
    let balance = p;
    const r = annualRate / 12 / 100;
    const emi = calculateEmi(p, annualRate, years);
    const schedule = [];
    for (let i = 1; i <= years * 12; i++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance -= principal;
      schedule.push({ month: i, principal, interest, balance: Math.max(0, balance) });
    }
    return schedule;
  };

  const handleInputChange = (field, value) => {
    if (!isProUser) return;
    setLoanData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  // Calculations
  const emi = useMemo(() => calculateEmi(loanData.loanAmount, loanData.interestRate, loanData.tenureYears), [loanData]);
  const schedule = useMemo(() => generateAmortizationSchedule(loanData.loanAmount, loanData.interestRate, loanData.tenureYears), [loanData]);
  
  const totalPayment = emi * loanData.tenureYears * 12;
  const totalInterest = totalPayment - loanData.loanAmount;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  
  const first10YearsInterest = useMemo(() => {
    return schedule.slice(0, 120).reduce((sum, entry) => sum + entry.interest, 0);
  }, [schedule]);

  const yearlyData = useMemo(() => {
    const data = [];
    for (let i = 0; i < loanData.tenureYears; i++) {
      const yearSchedule = schedule.slice(i * 12, (i + 1) * 12);
      if (yearSchedule.length > 0) {
        data.push({
          year: i + 1,
          principal: yearSchedule.reduce((sum, e) => sum + e.principal, 0),
          interest: yearSchedule.reduce((sum, e) => sum + e.interest, 0),
          balance: yearSchedule[yearSchedule.length - 1].balance
        });
      }
    }
    return data;
  }, [schedule, loanData.tenureYears]);

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
            <Flame className="text-red-500" size={28} />
            Interest Truth Engine
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Breaking the EMI illusion. Visualizing the true cost of borrowing.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Total Interest Burn</div>
          <div className={`text-xl font-bold text-red-600 ${blurClass}`}>{formatCurrency(totalInterest)}</div>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Input Parameters" className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Loan Amount (Principal) (₹)</label>
              {isProUser ? (
                <input 
                  type="number" step="100000"
                  value={loanData.loanAmount} 
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 focus:border-blue-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ${blurClass}`}>5000000</div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Tenure (Years)</label>
              {isProUser ? (
                <input 
                  type="number" 
                  value={loanData.tenureYears} 
                  onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 focus:border-blue-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ${blurClass}`}>20</div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Annual Interest Rate (%)</label>
              {isProUser ? (
                <input 
                  type="number" step="0.1"
                  value={loanData.interestRate} 
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 focus:border-blue-500 outline-none transition-colors"
                />
              ) : (
                <div className={`w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ${blurClass}`}>8.5</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
        <Info className="text-red-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-gray-700 leading-relaxed italic">
          Note: Marketing usually hides the total cost within "Low Monthly EMI". This engine calculates the cold, hard truth of the full payment cycle.
        </p>
      </div>

      {/* ANALYSIS OUTPUT */}
      <Card title="Analysis Output">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-bold">Monthly EMI</div>
            <div className={`text-xl font-bold text-gray-900 ${blurClass}`}>{formatCurrency(emi)}</div>
            <div className="text-[10px] text-gray-500 uppercase">Paid over {loanData.tenureYears * 12} cycles</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-bold">Lifetime Interest Paid</div>
            <div className={`text-xl font-bold text-red-600 ${blurClass}`}>{formatCurrency(totalInterest)}</div>
            <div className="text-[10px] text-red-500 uppercase">Pure profit for bank</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-bold">Total Amount Paid</div>
            <div className={`text-xl font-bold text-gray-900 ${blurClass}`}>{formatCurrency(totalPayment)}</div>
            <div className="text-[10px] text-gray-500 uppercase">Principal + Interest</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-bold">Interest to Principal</div>
            <div className={`text-xl font-bold text-yellow-600 ${blurClass}`}>{(totalInterest / loanData.loanAmount).toFixed(2)} / 1.0</div>
            <div className="text-[10px] text-yellow-600 uppercase">{(totalInterest / loanData.loanAmount * 100).toFixed(1)}% extra cost</div>
          </div>
        </div>
      </Card>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Principal vs Interest Ratio" className="md:col-span-1">
          <div className={`h-48 ${blurClass}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Principal', value: loanData.loanAmount },
                    { name: 'Interest', value: totalInterest }
                  ]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"
                >
                  <Cell fill="#22c55e" /> {/* green-500 */}
                  <Cell fill="#ef4444" /> {/* red-500 */}
                </Pie>
                <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <span className="text-gray-600 font-semibold">Principal</span>
              </div>
              <span className={`text-gray-900 font-bold ${blurClass}`}>{((loanData.loanAmount / totalPayment) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-gray-600 font-semibold">Interest</span>
              </div>
              <span className={`text-red-600 font-bold ${blurClass}`}>{interestRatio.toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        <Card title="Payment Composition Over Time" className="md:col-span-2">
          <div className={`h-48 ${blurClass}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => `Yr ${tick}`} />
                <YAxis hide />
                <RechartsTooltip formatter={(value) => [formatCurrency(value), '']} />
                <Area type="monotone" dataKey="interest" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Interest Paid" />
                <Area type="monotone" dataKey="principal" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Principal Paid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase text-gray-500 font-bold">
            <span>Year 1 (Mostly Interest)</span>
            <span>Year {loanData.tenureYears} (Mostly Principal)</span>
          </div>
        </Card>
      </div>

    </div>
  );
}
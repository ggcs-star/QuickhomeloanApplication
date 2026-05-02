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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-1">
          <Card title="Loan Details">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Loan Amount (₹)</label>
                {isProUser ? (
                  <input 
                    type="number" step="100000"
                    value={loanData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className={`w-full bg-gray-50 border border-gray-200 rounded-md p-2 text-sm font-semibold text-gray-900 ${blurClass}`}>5000000</div>
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Annual Interest Rate (%)</label>
                {isProUser ? (
                  <input 
                    type="number" step="0.1"
                    value={loanData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm font-semibold text-gray-900 outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className={`w-full bg-gray-50 border border-gray-200 rounded-md p-2 text-sm font-semibold text-gray-900 ${blurClass}`}>8.5</div>
                )}
              </div>
            </div>
          </Card>

          <Card title="Tenure Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold">Compare Years</label>
                <div className="flex flex-wrap gap-2">
                  {tenureOptions.map(year => (
                    <div key={year} className={`flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[11px] font-semibold text-gray-700 ${blurClass}`}>
                      <span>{year} Yrs</span>
                      <button onClick={() => removeYear(year)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input 
                    type="number" placeholder="Add year..." value={newYear}
                    onChange={(e) => setNewYear(e.target.value)} disabled={!isProUser}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-md p-1.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500"
                  />
                  <button 
                    onClick={addYear} disabled={!isProUser}
                    className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CHART SECTION */}
        <Card title="Lifetime Interest vs. Loan Principal" className="md:col-span-2">
          <div className={`h-80 ${blurClass}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="tenureVal" label={{ value: 'Tenure (Years)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#6b7280' }} stroke="#9ca3af" fontSize={10} />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} stroke="#9ca3af" fontSize={10} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', fontSize: '11px', color: '#374151', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value, name) => [formatCurrency(value), name === 'principal' ? 'Principal Amount' : 'Total Interest Burden']}
                />
                <Bar dataKey="principal" stackId="a" fill="#e5e7eb" radius={[0, 0, 0, 0]} />
                <Bar dataKey="interestPaid" stackId="a" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isTrap ? '#ef4444' : entry.tenureVal === loanData.tenureYears ? '#eab308' : '#22c55e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-gray-500 mt-4 italic text-center">
            Notice how the interest bar (green/red) overtakes the principal (gray) as the years increase.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#e5e7eb] rounded-sm" /> <span>Principal Amount</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#22c55e] rounded-sm" /> <span>Safe Interest</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#eab308] rounded-sm" /> <span>Current Selection</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#ef4444] rounded-sm" /> <span>Trap Zone</span></div>
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
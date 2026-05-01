import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  CalendarCheck, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function RateTrackerCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  const [bankSpread, setBankSpread] = useState(2.25);
  const [currentBenchmark, setCurrentBenchmark] = useState('EBLR (Repo)');
  const [currentRate, setCurrentRate] = useState(9.10);
  
  const [rateHistory, setRateHistory] = useState([
    { id: 1, date: 'Oct 12, 2023', type: 'Repo Rate Hike', oldRate: 8.50, newRate: 8.75, impact: 'EMI +₹1,250', impactType: 'emi', color: 'red', icon: 'trending-up' },
    { id: 2, date: 'Feb 15, 2024', type: 'Reset Review', oldRate: 8.75, newRate: 8.75, impact: 'Tenure +3 Months', impactType: 'tenure', color: 'orange', icon: 'clock' },
    { id: 3, date: 'Jun 20, 2024', type: 'Spread Adjustment', oldRate: 8.75, newRate: 9.10, impact: 'EMI +₹2,100', impactType: 'emi', color: 'red', icon: 'trending-up' }
  ]);

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  const totalImpact = rateHistory.reduce((sum, event) => {
    if (event.impactType === 'emi') {
      const amount = parseInt(event.impact.match(/\d+/)[0]) || 0;
      return sum + amount;
    }
    return sum;
  }, 0);

  const calculateAverageSpread = () => {
    const spreads = rateHistory.map(e => e.newRate - (e.oldRate || e.newRate));
    const validSpreads = spreads.filter(s => !isNaN(s) && s !== 0);
    if (validSpreads.length === 0) return 0;
    return (validSpreads.reduce((a, b) => a + b, 0) / validSpreads.length).toFixed(2);
  };

  const getColorClasses = (color) => {
    switch(color) {
      case 'red': return 'bg-red-50 text-red-600';
      case 'orange': return 'bg-orange-50 text-orange-600';
      case 'green': return 'bg-green-50 text-green-600';
      default: return 'bg-neutral-50 text-neutral-700';
    }
  };

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* STATS SUMMARY */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-300 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-2">
            <div className="text-xs text-neutral-500 mb-1 uppercase font-semibold">Current Rate</div>
            <div className={`text-xl font-bold text-neutral-900 ${blurClass}`}>{currentRate}%</div>
          </div>
          <div className="text-center p-2 border-l border-r border-gray-100">
            <div className="text-xs text-neutral-500 mb-1 uppercase font-semibold">Spread Avg</div>
            <div className={`text-xl font-bold text-neutral-900 ${blurClass}`}>{calculateAverageSpread()}%</div>
          </div>
          <div className="text-center p-2">
            <div className="text-xs text-neutral-500 mb-1 uppercase font-semibold">Total Impact</div>
            <div className={`text-xl font-bold text-blue-600 ${blurClass}`}>₹{totalImpact}</div>
          </div>
        </div>
      </div>

      {/* CONTROLS (Spread & Benchmark) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank Spread */}
        <div className="bg-white px-5 py-4 rounded-xl border border-neutral-300 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 rounded-md">
              <Activity className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <span className="text-[12px] text-neutral-500 uppercase font-bold tracking-widest block">Bank Spread</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-base font-semibold text-neutral-900 ${blurClass}`}>{bankSpread}% (Fixed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Benchmark */}
        <div className="bg-white px-5 py-4 rounded-xl border border-neutral-300 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 rounded-md">
              <CalendarCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <span className="text-[12px] text-neutral-500 uppercase font-bold tracking-widest block">Active Bench</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-base font-semibold text-neutral-900 ${blurClass}`}>{currentBenchmark}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RATE HISTORY LIST */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            Interest Change History
          </h2>
        </div>

        <div className="space-y-4">
          {rateHistory.map((event) => (
            <div key={event.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center gap-4 ${isProUser ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
              
              <div className={`p-3 rounded-lg shrink-0 w-12 h-12 flex items-center justify-center ${getColorClasses(event.color)}`}>
                {event.icon === 'trending-up' ? <TrendingUp className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-neutral-900">{event.date}</span>
                  <span className="text-[10px] bg-white border px-2 py-0.5 rounded uppercase font-bold text-neutral-500 tracking-wider">
                    {event.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {event.oldRate !== event.newRate && (
                    <>
                      <span className={`text-sm text-neutral-400 line-through ${blurClass}`}>{event.oldRate}%</span>
                      <span className="text-neutral-400">→</span>
                    </>
                  )}
                  <span className={`text-base font-bold text-neutral-900 ${blurClass}`}>{event.newRate}% ROI</span>
                </div>
              </div>
              
              <div className="text-left md:text-right bg-white p-3 border rounded-lg md:bg-transparent md:border-0 md:p-0">
                <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Pass-through Impact</span>
                <span className={`text-sm font-bold ${event.impactType === 'emi' ? 'text-blue-600' : 'text-orange-600'} ${blurClass}`}>
                  {event.impact}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
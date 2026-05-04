import React, { useState } from 'react';
import {
    Activity,
    CalendarCheck,
    TrendingUp,
    Clock,
    ShieldCheck,
    CircleQuestionMark,
    ArrowRight,
    Zap,
    Headphones,
    Volume2,
    Video,
    Target,
    CirclePlay,
    ChevronRight,
    TrendingUp as TrendUpIcon,
    Clock as ClockIcon,
    Lock,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext"; // ✅ Using AuthContext

const RateChangeTracker = () => {
    const { isProUser } = useAuth(); // ✅ Get pro status directly from context

    const [bankSpread, setBankSpread] = useState(2.25);
    const [currentBenchmark, setCurrentBenchmark] = useState('EBLR (Repo)');
    const [rateHistory, setRateHistory] = useState([
        {
            id: 1,
            date: 'Oct 12, 2023',
            type: 'Repo Rate Hike',
            oldRate: 8.50,
            newRate: 8.75,
            impact: 'EMI +₹1,250',
            impactType: 'emi',
            color: 'red',
            icon: 'trending-up'
        },
        {
            id: 2,
            date: 'Feb 15, 2024',
            type: 'Reset Review',
            oldRate: 8.75,
            newRate: 8.75,
            impact: 'Tenure +3 Months',
            impactType: 'tenure',
            color: 'orange',
            icon: 'clock'
        },
        {
            id: 3,
            date: 'Jun 20, 2024',
            type: 'Spread Adjustment',
            oldRate: 8.75,
            newRate: 9.10,
            impact: 'EMI +₹2,100',
            impactType: 'emi',
            color: 'red',
            icon: 'trending-up'
        }
    ]);

    const [complianceStatus, setComplianceStatus] = useState({
        resetResponse: 'Compliant',
        spreadVolatility: 'Moderate'
    });

    const [currentRate, setCurrentRate] = useState(9.10);

    // Calculate total impact
    const totalImpact = rateHistory.reduce((sum, event) => {
        if (event.impactType === 'emi') {
            const amount = parseInt(event.impact.match(/\d+/)[0]) || 0;
            return sum + amount;
        }
        return sum;
    }, 0);

    // Calculate rate changes count
    const rateChangesCount = rateHistory.filter(event => event.oldRate !== event.newRate).length;

    // Calculate average spread
    const calculateAverageSpread = () => {
        const spreads = rateHistory.map(event => event.newRate - (event.oldRate || event.newRate));
        const validSpreads = spreads.filter(s => !isNaN(s) && s !== 0);
        if (validSpreads.length === 0) return 0;
        const average = validSpreads.reduce((a, b) => a + b, 0) / validSpreads.length;
        return average.toFixed(2);
    };

    const handleAddRateChange = () => {
        if (!isProUser) {
            window.dispatchEvent(new CustomEvent("openProModal"));
            return;
        }

        const newDate = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const newEvent = {
            id: rateHistory.length + 1,
            date: newDate,
            type: 'Manual Update',
            oldRate: currentRate,
            newRate: currentRate + 0.25,
            impact: 'EMI +₹1,500',
            impactType: 'emi',
            color: 'red',
            icon: 'trending-up'
        };

        setRateHistory([newEvent, ...rateHistory]);
        setCurrentRate(currentRate + 0.25);
    };

    const handleUpdateSpread = () => {
        if (!isProUser) {
            window.dispatchEvent(new CustomEvent("openProModal"));
            return;
        }

        const newSpread = parseFloat((bankSpread + 0.1).toFixed(2));
        setBankSpread(newSpread);

        // Add a spread adjustment event
        const newDate = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const newEvent = {
            id: rateHistory.length + 1,
            date: newDate,
            type: 'Spread Adjustment',
            oldRate: currentRate,
            newRate: currentRate + 0.1,
            impact: 'EMI +₹850',
            impactType: 'emi',
            color: 'red',
            icon: 'trending-up'
        };

        setRateHistory([newEvent, ...rateHistory]);
        setCurrentRate(currentRate + 0.1);
    };

    const handleBenchmarkChange = () => {
        if (!isProUser) {
            window.dispatchEvent(new CustomEvent("openProModal"));
            return;
        }
        setCurrentBenchmark(prev => prev === 'EBLR (Repo)' ? 'MCLR' : 'EBLR (Repo)');
    };

    const handleComplianceCheck = () => {
        if (!isProUser) {
            window.dispatchEvent(new CustomEvent("openProModal"));
            return;
        }

        const now = new Date();
        const lastEventDate = new Date(rateHistory[0].date);
        const daysSinceLastChange = Math.floor((now - lastEventDate) / (1000 * 60 * 60 * 24));

        const newStatus = {
            resetResponse: daysSinceLastChange <= 90 ? 'Compliant' : 'Non-Compliant',
            spreadVolatility: bankSpread > 2.5 ? 'High' : bankSpread > 2.0 ? 'Moderate' : 'Low'
        };

        setComplianceStatus(newStatus);

        alert(`Compliance Audit Complete!\n\nReset Response: ${newStatus.resetResponse}\nSpread Volatility: ${newStatus.spreadVolatility}\nDays since last change: ${daysSinceLastChange}\nCurrent Spread: ${bankSpread}%`);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('₹', '₹ ');
    };

    // Blurred number display component
    const BlurredNumberDisplay = ({ value, className = "", isPercentage = false, isCurrency = false }) => {
        if (isProUser) {
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

    const audioTopics = [
        { title: 'The 90-Day Reset Mandate', description: 'Understanding the legal reset window for EBLR-linked loans.', duration: '04:12' },
        { title: 'Spread Stickiness Audit', description: 'How to identify if your bank is delaying Repo Rate cut transmission.', duration: '05:45' },
        { title: 'Tenure Ballooning Defense', description: 'Strategic response to silent tenure extensions during rate spikes.', duration: '06:20' },
        { title: 'MCLR to EBLR Conversion Legal', description: 'The legal process to shift to a more transparent benchmark.', duration: '07:15' },
        { title: 'Step-up EMI Buffer Math', description: 'Calculating the ideal EMI increase to absorb 1% volatility.', duration: '04:50' },
    ];

    const videoTopics = [
        { title: 'Visualizing Rate Shock', duration: '03:30', views: '12,405' },
        { title: 'Interest Leakage Heatmap', duration: '05:10', views: '8,920' },
        { title: 'Negative Amortization Alert', duration: '04:20', views: '15,100' },
        { title: 'Benchmark Accuracy Masterclass', duration: '08:45', views: '5,670' },
        { title: 'Escape Velocity Strategy', duration: '06:15', views: '22,300' },
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'red': return 'bg-red-50 border-red-100 text-red-600';
            case 'orange': return 'bg-orange-50 border-orange-100 text-orange-600';
            case 'green': return 'bg-green-50 border-green-100 text-green-600';
            default: return 'bg-neutral-50 border-neutral-200 text-neutral-700';
        }
    };

    const SmallClockIcon = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 6v6l4 2"></path>
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
    );

    // Upgrade banner component
    const UpgradeBanner = () => (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-indigo-200 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-indigo-900 mb-1">Unlock Full Rate Tracking</h4>
                    <p className="text-[12px] sm:text-[13px] text-indigo-800 mb-3 sm:mb-0">
                        Pro users get access to complete rate history, compliance audits, and advanced tracking features.
                    </p>
                </div>
                <button
                    className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition flex-shrink-0"
                    onClick={() => window.dispatchEvent(new CustomEvent("openProModal"))}
                >
                    Upgrade to Pro
                </button>
            </div>
        </div>
    );

    // Pro status indicator
    const ProStatusIndicator = () => (
        <div className={`border px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 shadow-sm w-full sm:w-auto ${isProUser ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
            }`}>
            <Activity size={16} className={isProUser ? "text-green-700" : "text-gray-500"} />
            <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isProUser ? "text-green-700" : "text-gray-600"
                }`}>
                {isProUser ? "Pro Plan Active" : "Pro Plan Required"}
            </span>
        </div>
    );

    return (
        <main className="flex-1 overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 pb-24 pt-3 sm:pt-6 px-4 sm:px-6 lg:px-8">

                {/* ================= TOP NAVIGATION & HEADER ================= */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-200/80 active:bg-gray-300 transition-colors text-gray-800 shrink-0"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">
                                Rate Change Tracker
                            </h1>
                            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1 hidden sm:block">
                                Monitoring interest volatility and benchmark transparency.
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <ProStatusIndicator />
                    </div>
                    <p className="text-[12px] text-gray-500 mt-1 sm:hidden px-1">
                        Monitoring interest volatility and benchmark transparency.
                    </p>
                </div>

                {/* Show upgrade banner for non-pro users */}
                {!isProUser && <UpgradeBanner />}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Left Column - Rate History */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-gray-200 sm:border-none pb-3 sm:pb-0">
                            <h3 className="text-[16px] sm:text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                                <TrendUpIcon className="w-5 h-5 text-neutral-700" />
                                Interest Change History
                            </h3>
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                                <span className="text-[10px] sm:text-[12px] font-bold text-neutral-500 uppercase tracking-widest bg-white sm:bg-transparent px-2 sm:px-0 py-1 sm:py-0 rounded border sm:border-none border-gray-200">
                                    Last {rateHistory.length} Events
                                </span>
                                <div className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                                    {rateChangesCount} rate changes •
                                    <span className="text-black ml-1"><BlurredNumberDisplay value={totalImpact} isCurrency={true} /> total impact</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {rateHistory.map((event) => (
                                <div
                                    key={event.id}
                                    className={`bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 ${isProUser ? 'group hover:border-neutral-400 transition-all' : 'opacity-80'}`}
                                >
                                    <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-none border-gray-100 pb-3 sm:pb-0">
                                        <div className={`p-3 rounded-lg shrink-0 border ${getColorClasses(event.color)}`}>
                                            {event.icon === 'trending-up' ? (
                                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                            ) : (
                                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                            )}
                                        </div>
                                        <div className="sm:hidden flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[13px] font-bold text-neutral-900">{event.date}</span>
                                            </div>
                                            <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded uppercase font-bold text-neutral-600 tracking-tighter inline-block">
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-row items-center justify-between gap-4">
                                        <div className="hidden sm:block">
                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                <span className="text-[14px] sm:text-[15px] font-bold text-neutral-900">{event.date}</span>
                                                <span className="text-[10px] sm:text-[11px] bg-neutral-100 px-2 py-0.5 rounded uppercase font-bold text-neutral-600 tracking-tighter border border-neutral-200">
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                {event.oldRate !== event.newRate && (
                                                    <>
                                                        <span className="text-neutral-400 line-through text-[13px] sm:text-[14px] font-medium">
                                                            <BlurredNumberDisplay value={event.oldRate} isPercentage={true} />
                                                        </span>
                                                        <span className="text-neutral-300 text-xs">→</span>
                                                    </>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[15px] sm:text-[16px] font-bold text-neutral-900 tabular-nums">
                                                        <BlurredNumberDisplay value={event.newRate} isPercentage={true} />
                                                    </span>
                                                    <span className="text-[11px] sm:text-[12px] font-bold text-neutral-500">ROI</span>
                                                </div>
                                                {event.oldRate !== event.newRate && (
                                                    <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded ${event.newRate > event.oldRate ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                        }`}>
                                                        {event.newRate > event.oldRate ? '↑' : '↓'}
                                                        <BlurredNumberDisplay value={Math.abs(event.newRate - event.oldRate)} isPercentage={true} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mobile Rate Display */}
                                        <div className="sm:hidden flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                {event.oldRate !== event.newRate && (
                                                    <span className="text-neutral-400 line-through text-[12px] font-medium">
                                                        <BlurredNumberDisplay value={event.oldRate} isPercentage={true} />
                                                    </span>
                                                )}
                                                <span className="text-[15px] font-bold text-neutral-900 tabular-nums">
                                                    <BlurredNumberDisplay value={event.newRate} isPercentage={true} />
                                                </span>
                                            </div>
                                            {event.oldRate !== event.newRate && (
                                                <span className={`text-[10px] font-bold ${event.newRate > event.oldRate ? 'text-red-600' : 'text-green-600'}`}>
                                                    {event.newRate > event.oldRate ? '↑' : '↓'} <BlurredNumberDisplay value={Math.abs(event.newRate - event.oldRate)} isPercentage={true} />
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-right border-l border-gray-100 sm:border-none pl-4 sm:pl-0">
                                            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-bold uppercase block mb-0.5 sm:mb-1">
                                                Pass-through
                                            </span>
                                            <span className={`text-[14px] sm:text-[16px] font-bold tracking-tight tabular-nums ${event.impactType === 'emi' ? 'text-blue-600' : 'text-yellow-600'
                                                }`}>
                                                {isProUser ? event.impact : (
                                                    <span className="filter blur-[3px]">₹XX,XXX</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                            <div className="grid grid-cols-3 divide-x divide-gray-100">
                                <div className="text-center p-2 sm:p-3">
                                    <div className="text-[11px] sm:text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Current Rate</div>
                                    <div className="text-[16px] sm:text-lg font-bold text-neutral-900 tabular-nums">
                                        <BlurredNumberDisplay value={currentRate} isPercentage={true} />
                                    </div>
                                </div>
                                <div className="text-center p-2 sm:p-3">
                                    <div className="text-[11px] sm:text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Spread Avg</div>
                                    <div className="text-[16px] sm:text-lg font-bold text-neutral-900 tabular-nums">
                                        <BlurredNumberDisplay value={calculateAverageSpread()} isPercentage={true} />
                                    </div>
                                </div>
                                <div className="text-center p-2 sm:p-3">
                                    <div className="text-[11px] sm:text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Total Impact</div>
                                    <div className="text-[16px] sm:text-lg font-bold text-black tabular-nums">
                                        <BlurredNumberDisplay value={totalImpact} isCurrency={true} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200 border-dashed p-6 sm:p-8 rounded-xl flex flex-col items-center justify-center text-center">
                            <ClockIcon className="mb-3 text-neutral-400 w-6 h-6 sm:w-8 sm:h-8" />
                            <span className="text-[13px] sm:text-[14px] font-medium text-neutral-600 max-w-sm">Older history archives are available in full statement import</span>
                            {isProUser ? (
                                <button
                                    onClick={handleAddRateChange}
                                    className="mt-4 text-black text-[13px] sm:text-sm font-bold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    + Add Rate Change Event
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent("openProModal"))}
                                    className="mt-4 bg-indigo-600 text-white text-[12px] sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                                >
                                    <Lock size={14} />
                                    Upgrade to Add Events
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-0">

                        {/* Bank Spread Card */}
                        <div className="bg-white px-4 sm:px-5 py-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-50 rounded-lg shrink-0 border border-gray-100">
                                    <Activity className="w-5 h-5 text-neutral-700" />
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center sm:block">
                                        <span className="text-[11px] sm:text-[12px] text-neutral-500 uppercase font-bold tracking-widest block mb-0.5">
                                            Bank Spread
                                        </span>
                                        {/* Mobile button */}
                                        <div className="sm:hidden">
                                            {isProUser ? (
                                                <button onClick={handleUpdateSpread} className="text-[11px] font-bold bg-gray-100 px-2 py-1 rounded text-black">Update</button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100"><Lock size={10} className="inline mr-1" />Pro</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] sm:text-[16px] font-bold text-neutral-900 tabular-nums">
                                            <BlurredNumberDisplay value={bankSpread} isPercentage={true} /> <span className="text-gray-400 text-sm font-medium ml-1">(Fixed)</span>
                                        </span>
                                        {/* Desktop button */}
                                        <div className="hidden sm:block">
                                            {isProUser ? (
                                                <button onClick={handleUpdateSpread} className="text-[11px] font-bold bg-gray-100 px-2 py-1 rounded text-black hover:bg-gray-200 transition">Update</button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100 ml-1"><Lock size={10} className="inline mr-1 -mt-0.5" />Pro feature</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Bench Card */}
                        <div className="bg-white px-4 sm:px-5 py-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg shrink-0 border border-green-100">
                                    <CalendarCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center sm:block">
                                        <span className="text-[11px] sm:text-[12px] text-neutral-500 uppercase font-bold tracking-widest block mb-0.5">
                                            Active Bench
                                        </span>
                                        {/* Mobile button */}
                                        <div className="sm:hidden">
                                            {isProUser ? (
                                                <button onClick={handleBenchmarkChange} className="text-[11px] font-bold bg-gray-100 px-2 py-1 rounded text-black">Switch</button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100"><Lock size={10} className="inline mr-1" />Pro</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] sm:text-[16px] font-bold text-neutral-900">
                                            {isProUser ? currentBenchmark : (
                                                <span className="filter blur-[3px] inline-block select-none">XXXXXXX</span>
                                            )}
                                        </span>
                                        {/* Desktop button */}
                                        <div className="hidden sm:block">
                                            {isProUser ? (
                                                <button onClick={handleBenchmarkChange} className="text-[11px] font-bold bg-gray-100 px-2 py-1 rounded text-black hover:bg-gray-200 transition ml-1">Switch</button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100 ml-1"><Lock size={10} className="inline mr-1 -mt-0.5" />Pro feature</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transparency Audit */}
                        <div className={`p-5 sm:p-6 rounded-xl text-white shadow-md relative overflow-hidden ${isProUser ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-600'}`}>
                            <div className="relative z-10">
                                <h3 className="text-[15px] sm:text-[16px] font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    Transparency Audit
                                </h3>
                                <p className="text-[12px] sm:text-[13px] opacity-90 leading-relaxed mb-6 font-medium">
                                    Banks must notify you of rate changes and their impact on EMI/Tenure. Any delayed pass-through of rate cuts is a <strong className="text-white">Regulatory Violation</strong>.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[12px] bg-white/10 p-3 rounded-lg border border-white/10 gap-1.5 sm:gap-0">
                                        <span className="font-medium text-neutral-300">Reset Response Time</span>
                                        <span className={`font-bold uppercase tracking-wider ${isProUser ? (
                                                complianceStatus.resetResponse === 'Compliant' ? 'text-green-400' : 'text-red-400'
                                            ) : 'text-yellow-400 flex items-center gap-1'
                                            }`}>
                                            {!isProUser && <Lock size={10} />}
                                            {isProUser ? complianceStatus.resetResponse : 'Pro Required'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[12px] bg-white/10 p-3 rounded-lg border border-white/10 gap-1.5 sm:gap-0">
                                        <span className="font-medium text-neutral-300">Spread Volatility</span>
                                        <span className={`font-bold uppercase tracking-wider ${isProUser ? (
                                                complianceStatus.spreadVolatility === 'Low' ? 'text-green-400' :
                                                    complianceStatus.spreadVolatility === 'Moderate' ? 'text-yellow-400' : 'text-red-400'
                                            ) : 'text-yellow-400 flex items-center gap-1'
                                            }`}>
                                            {!isProUser && <Lock size={10} />}
                                            {isProUser ? complianceStatus.spreadVolatility : 'Pro Required'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                                <TrendingUp className="w-48 h-48 sm:w-56 sm:h-56" />
                            </div>
                        </div>

                        {/* Strategic Tip */}
                        <div className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-sm border-l-4 border-l-black">
                            <h4 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <CircleQuestionMark className="w-5 h-5 text-black" />
                                Strategic Tip
                            </h4>
                            <p className="text-[13px] sm:text-[14px] text-neutral-600 leading-relaxed font-medium">
                                Whenever a rate increases, banks often extend tenure instead of increasing EMI. Check if your tenure is exceeding 30 years—this can exponentially increase your interest cost.
                            </p>
                            <div className="mt-5 text-[12px] sm:text-[13px] text-neutral-600 font-medium space-y-2">
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                    <span>Current spread: <BlurredNumberDisplay value={bankSpread} isPercentage={true} className="font-bold text-black" /></span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span>Benchmark: {isProUser ? <span className="font-bold text-black">{currentBenchmark}</span> : (
                                        <span className="filter blur-[3px] inline-block font-bold">XXXXXXX</span>
                                    )}</span>
                                </div>
                            </div>
                            <button className={`mt-5 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest flex items-center gap-1 transition-transform bg-gray-100 px-3 py-1.5 rounded-lg ${isProUser ? 'text-black hover:bg-gray-200 active:scale-95' : 'text-gray-400 cursor-not-allowed'}`} disabled={!isProUser}>
                                Read ROI Guide <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Compliance Lock */}
                        <div className={`p-5 sm:p-6 rounded-xl text-white shadow-md border ${isProUser ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-600 border-neutral-500'}`}>
                            <h3 className="text-[15px] sm:text-[16px] font-bold mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-white" />
                                Compliance Lock
                            </h3>
                            <p className="text-[12px] sm:text-[13px] opacity-80 mb-5 font-medium leading-relaxed">
                                Verify if your bank applied the latest Repo Rate cut to your loan account.
                            </p>
                            <button
                                onClick={handleComplianceCheck}
                                className={`w-full py-3 rounded-lg text-[13px] font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-2 ${isProUser ? 'bg-white text-black hover:bg-gray-100 active:scale-[0.98]' : 'bg-gray-500 text-gray-300 cursor-not-allowed border border-gray-400'}`}
                                disabled={!isProUser}
                            >
                                {!isProUser ? <><Lock size={14} /> Upgrade to Audit</> : 'Complete Compliance'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RateChangeTracker;
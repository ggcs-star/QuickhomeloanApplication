import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, Activity, CreditCard, CircleAlert, Calendar,
    Calculator, Wallet, PiggyBank, Clock, SquareCheckBig,
    Headphones, Video, Volume2, CirclePlay, Target, ArrowRight,
    ChevronRight, Download, Info, CircleCheck, CircleX,
    Percent, TrendingDown, Zap, CheckCircle, ArrowRight as ArrowRightIcon,
    Download as DownloadIcon, Info as InfoIcon, BrainCircuit,
    Scale, MapPin, Shield, Landmark, ShieldAlert, CircleQuestionMark,
    ChevronRight as ChevronRightIcon, Headphones as HeadphonesIcon,
    Video as VideoIcon, Target as TargetIcon, Clock as ClockIcon,
    Wallet as WalletIcon, PiggyBank as PiggyBankIcon, Flame, ChartColumn, TrendingUp, Lock,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext"; // ✅ Using AuthContext

const EMIRepaymentHealth = () => {
    const { isProUser } = useAuth(); // ✅ Get pro status directly from context

    const [healthScore, setHealthScore] = useState(75);
    const [onTimeRatio, setOnTimeRatio] = useState(83);
    const [bounceEvents, setBounceEvents] = useState(1);

    // Monthly EMI data
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

    // Calculator state
    const [loanData, setLoanData] = useState({
        loanOutstanding: 5000000,
        emiAmount: 45000,
        emisPaid: 12,
        tenureYears: 15
    });

    const [results, setResults] = useState({
        totalEMIPaid: 540000,
        interestComponent: 344847,
        principalComponent: 195153,
        interestPercentage: 63.86,
        annualROI: 7.02
    });

    // Health metrics
    const [healthMetrics, setHealthMetrics] = useState({
        healthScore: 75,
        continuityScore: 65,
        transmissionGap: -1.5
    });

    // Update health metrics when monthly data changes
    useEffect(() => {
        if (isProUser) {
            calculateHealthMetrics();
        }
    }, [monthlyEMIs, isProUser]);

    const calculateHealthMetrics = () => {
        const paidCount = monthlyEMIs.filter(emi => emi.status === 'paid').length;
        const bounceCount = monthlyEMIs.filter(emi => emi.status === 'bounce').length;
        const delayedCount = monthlyEMIs.filter(emi => emi.status === 'delayed').length;

        const newOnTimeRatio = Math.round((paidCount / monthlyEMIs.length) * 100);
        const newHealthScore = Math.round((paidCount / monthlyEMIs.length) * 100 - (bounceCount * 25) - (delayedCount * 10));

        setOnTimeRatio(newOnTimeRatio);
        setBounceEvents(bounceCount);
        const score = Math.max(0, Math.min(100, newHealthScore));
        setHealthScore(score);

        // Update health metrics object
        setHealthMetrics(prev => ({
            ...prev,
            healthScore: score,
            continuityScore: Math.round(score * 0.87)
        }));
    };

    const updateEMIStatus = (monthIndex, newStatus) => {
        if (!isProUser) return;
        const updatedEMIs = [...monthlyEMIs];
        updatedEMIs[monthIndex] = {
            ...updatedEMIs[monthIndex],
            status: newStatus
        };
        setMonthlyEMIs(updatedEMIs);
    };

    const updateEMIAmount = (monthIndex, newAmount) => {
        if (!isProUser) return;
        const updatedEMIs = [...monthlyEMIs];
        updatedEMIs[monthIndex] = {
            ...updatedEMIs[monthIndex],
            amount: newAmount,
            emiChanged: newAmount !== 45000
        };
        setMonthlyEMIs(updatedEMIs);
    };

    // Calculate results when loan data changes
    useEffect(() => {
        if (isProUser) {
            calculateResults();
        }
    }, [loanData, isProUser]);

    const calculateResults = () => {
        const totalEMIPaid = loanData.emiAmount * loanData.emisPaid;

        // Simple calculation for demonstration
        const monthlyRate = 0.0702 / 12;
        const interest = loanData.loanOutstanding * monthlyRate * loanData.emisPaid;
        const principal = totalEMIPaid - interest;

        setResults({
            totalEMIPaid: Math.round(totalEMIPaid),
            interestComponent: Math.round(interest),
            principalComponent: Math.round(principal),
            interestPercentage: Math.round((interest / totalEMIPaid) * 10000) / 100,
            annualROI: 7.02
        });
    };

    const handleInputChange = (field, value) => {
        if (!isProUser) return;
        const numValue = parseFloat(value) || 0;
        setLoanData(prev => ({
            ...prev,
            [field]: numValue
        }));
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

    // Helper to format numbers with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    // Blurred number display for non-pro users
    const BlurredNumberDisplay = ({ value, className = "", isCurrency = false, isPercentage = false }) => {
        if (isProUser) {
            const displayValue = isCurrency ? formatCurrency(value) : (isPercentage ? `${value}%` : formatNumber(value));
            return <span className={className}>{displayValue}</span>;
        }
        // Show blurred placeholder
        return (
            <span className={`inline-block filter blur-[4px] select-none ${className}`} style={{ WebkitFilter: 'blur(4px)' }}>
                {isCurrency ? '₹ XX,XXX' : (isPercentage ? 'XX%' : 'XX,XXX')}
            </span>
        );
    };

    // Get health status config
    const getHealthStatus = (score) => {
        if (score >= 80) return {
            text: 'EXCELLENT HEALTH',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500/20',
            priority: 'Low Priority'
        };
        if (score >= 60) return {
            text: 'GOOD HEALTH',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500/20',
            priority: 'Medium Priority'
        };
        return {
            text: 'NEEDS ATTENTION',
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500/20',
            priority: 'High Priority'
        };
    };

    const actions = [
        {
            id: 1,
            title: "Buffer Fund Setup",
            description: "Maintain 3 months of EMI in a 'Sweep-in' Fixed Deposit linked to your repayment account.",
            buttonText: "Setup Buffer"
        },
        {
            id: 2,
            title: "ROI Normalization",
            description: "Identify months where interest increased without notice. Request bank for pass-through audit.",
            buttonText: "Audit ROI"
        },
        {
            id: 3,
            title: "Digital SI Check",
            description: "Verify your E-Mandate/Standing Instruction status to ensure zero technical bounces.",
            buttonText: "Verify SI"
        },
        {
            id: 4,
            title: "Nodal Escalation",
            description: "If a technical bounce (bank error) affected your score, draft a notice to the Nodal Officer.",
            buttonText: "Draft Notice"
        },
        {
            id: 5,
            title: "Tenure Audit",
            description: "Manually verify pending installments against sanctioned term to detect 'Silent Tenure Ballooning'.",
            buttonText: "Check Tenure"
        }
    ];

    const audioBriefings = [
        { id: 1, title: "The 90-Day Reset Mandate", description: "Understanding the legal reset window for EBLR-linked loans.", duration: "04:12" },
        { id: 2, title: "Spread Stickiness Audit", description: "How to identify if your bank is delaying Repo Rate cut transmission.", duration: "05:45" },
        { id: 3, title: "Tenure Ballooning Defense", description: "Strategic response to silent tenure extensions during rate spikes.", duration: "06:20" },
        { id: 4, title: "MCLR to EBLR Conversion Legal", description: "The legal process to shift to a more transparent benchmark.", duration: "07:15" },
        { id: 5, title: "Step-up EMI Buffer Math", description: "Calculating the ideal EMI increase to absorb 1% volatility.", duration: "04:50" }
    ];

    const visualMasterclasses = [
        { id: 1, title: "Visualizing Rate Shock", duration: "03:30", views: "12,405", color: "bg-neutral-100" },
        { id: 2, title: "Interest Leakage Heatmap", duration: "05:10", views: "8,920", color: "bg-neutral-100" },
        { id: 3, title: "Negative Amortization Alert", duration: "04:20", views: "15,100", color: "bg-neutral-100" },
        { id: 4, title: "Benchmark Accuracy Masterclass", duration: "08:45", views: "5,670", color: "bg-neutral-100" },
        { id: 5, title: "Escape Velocity Strategy", duration: "06:15", views: "22,300", color: "bg-neutral-100" }
    ];

    // Helper function to get status color and icon
    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return {
                    color: 'text-green-500',
                    bgColor: 'bg-white',
                    borderColor: 'border-neutral-300 hover:border-green-500/30',
                    icon: CircleCheck,
                    text: 'PAID'
                };
            case 'bounce':
                return {
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-500/20 shadow-sm shadow-red-500/5',
                    icon: CircleX,
                    text: 'BOUNCE'
                };
            case 'delayed':
                return {
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-500/20',
                    icon: Clock,
                    text: 'DELAYED'
                };
            default:
                return {
                    color: 'text-neutral-500',
                    bgColor: 'bg-white',
                    borderColor: 'border-neutral-300',
                    icon: CircleAlert,
                    text: 'PENDING'
                };
        }
    };

    const SmallClockIcon = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 6v6l4 2"></path>
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
    );

    const healthStatus = getHealthStatus(healthScore);

    // Upgrade banner component
    const UpgradeBanner = () => (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-indigo-200 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-indigo-900 mb-1">Unlock Full EMI Analytics</h4>
                    <p className="text-[12px] sm:text-[13px] text-indigo-800 mb-3 sm:mb-0">
                        Pro users get access to detailed repayment analysis, interactive calculators, and complete financial insights.
                    </p>
                </div>
                <button
                    className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent("openProModal"));
                    }}
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
            <ShieldCheck size={16} className={isProUser ? "text-green-700" : "text-gray-500"} />
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
                                EMI Repayment Health
                            </h1>
                            <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1 hidden sm:block">
                                Detailed monthly breakdown of your repayment discipline and bounce history.
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <ProStatusIndicator />
                    </div>
                    <p className="text-[12px] text-gray-500 mt-1 sm:hidden px-1">
                        Detailed monthly breakdown of your repayment discipline.
                    </p>
                </div>

                {/* Show upgrade banner for non-pro users */}
                {!isProUser && <UpgradeBanner />}

                {/* Health Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                    {/* Health Score Card */}
                    <div className={`bg-white p-4 sm:p-6 rounded-xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${!isProUser ? 'border-gray-200 opacity-80' : 'border-neutral-200'}`}>
                        <div className="p-3 sm:p-4 bg-neutral-50 rounded-lg text-neutral-700">
                            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] sm:text-[12px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">
                                Health Score
                            </span>
                            <div className="text-[18px] sm:text-[20px] font-bold text-neutral-900 tabular-nums">
                                <BlurredNumberDisplay value={healthScore} isPercentage={true} />
                            </div>
                        </div>
                    </div>

                    {/* On-Time Ratio Card */}
                    <div className={`bg-white p-4 sm:p-6 rounded-xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${!isProUser ? 'border-gray-200 opacity-80' : 'border-neutral-200'}`}>
                        <div className="p-3 sm:p-4 bg-green-50 rounded-lg text-green-500">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] sm:text-[12px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">
                                On-Time Ratio
                            </span>
                            <div className="text-[18px] sm:text-[20px] font-bold text-neutral-900 tabular-nums">
                                <BlurredNumberDisplay value={onTimeRatio} isPercentage={true} />
                            </div>
                        </div>
                    </div>

                    {/* Bounce Events Card (Full width on mobile if odd number of cards) */}
                    <div className={`col-span-2 md:col-span-1 bg-white p-4 sm:p-6 rounded-xl border shadow-sm flex flex-row items-center gap-3 sm:gap-4 ${!isProUser ? 'border-gray-200 opacity-80' : 'border-neutral-200'}`}>
                        <div className="p-3 sm:p-4 rounded-lg bg-red-50 text-red-500">
                            <CircleAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] sm:text-[12px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">
                                Bounce Events
                            </span>
                            <div className="text-[18px] sm:text-[20px] font-bold tabular-nums text-red-500">
                                <BlurredNumberDisplay value={bounceEvents} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* EMI Continuity Audit Section */}
                <div className="animate-in fade-in duration-500">
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden font-sans">
                        {/* Section Header */}
                        <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-50/50 gap-4">
                            <div>
                                <h3 className="text-[16px] sm:text-[18px] font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
                                    <Calendar className="w-5 h-5 text-neutral-600" />
                                    EMI Continuity Audit
                                </h3>
                                <p className="text-[11px] sm:text-[12px] text-neutral-500 font-medium uppercase tracking-widest mt-1.5">
                                    Monthly payment health tracking from scanned bank statements.
                                </p>
                            </div>
                            <div className="text-left sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none border sm:border-none border-gray-100 w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                                <div className="text-[11px] sm:text-[12px] font-bold uppercase text-neutral-500 tracking-wider order-2 sm:order-none">
                                    Continuity Score
                                </div>
                                <div className="text-[18px] font-bold tabular-nums text-yellow-500 order-1 sm:order-none">
                                    <BlurredNumberDisplay value={healthMetrics.continuityScore} isPercentage={true} />
                                </div>
                            </div>
                        </div>

                        {/* Monthly EMI Grid */}
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                    {monthlyEMIs.map((emi, index) => {
                                        const statusConfig = getStatusConfig(emi.status);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <div
                                                key={index}
                                                className={`p-3 sm:p-4 rounded-xl border transition-all ${statusConfig.bgColor} ${statusConfig.borderColor} ${isProUser ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'cursor-default opacity-80'}`}
                                                onClick={() => updateEMIStatus(index, emi.status === 'paid' ? 'bounce' : emi.status === 'bounce' ? 'delayed' : 'paid')}
                                            >
                                                <div className="text-[11px] sm:text-[12px] font-bold text-neutral-500 uppercase tracking-widest mb-2 sm:mb-3">
                                                    {emi.month}
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                                                    <StatusIcon className={`w-5 h-5 sm:w-4 sm:h-4 ${statusConfig.color}`} />
                                                    <div className="relative">
                                                        {isProUser ? (
                                                            <input
                                                                type="number"
                                                                value={emi.amount}
                                                                onChange={(e) => updateEMIAmount(index, parseInt(e.target.value) || 0)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`text-[14px] sm:text-[15px] font-bold tabular-nums w-full sm:w-20 text-left sm:text-right bg-transparent border-b border-transparent hover:border-neutral-400 focus:border-black focus:outline-none ${emi.emiChanged ? 'text-black' : 'text-neutral-900'}`}
                                                            />
                                                        ) : (
                                                            <span className="text-[14px] sm:text-[15px] font-bold tabular-nums w-full sm:w-20 text-left sm:text-right inline-block filter blur-[4px]">
                                                                XX,XXX
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-tight ${statusConfig.color}`}>
                                                    {!isProUser ? (
                                                        <span className="filter blur-[3px] inline-block">XXXX</span>
                                                    ) : (
                                                        statusConfig.text
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Payment Discipline Alert */}
                                <div className="bg-neutral-900 rounded-xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-md border border-neutral-800">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="p-3 rounded-lg bg-red-500/20 shrink-0 mt-1 sm:mt-0">
                                            <CircleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] sm:text-[16px] font-bold">Payment Discipline Audit</h4>
                                            <p className="text-[13px] sm:text-[14px] text-neutral-300 mt-1.5 font-medium leading-relaxed">
                                                Alert: Found {!isProUser ? 'X' : bounceEvents} payment failure(s). This results in significant hidden costs and lower eligibility.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className={`w-full md:w-auto whitespace-nowrap text-white text-[13px] sm:text-[14px] font-bold px-6 py-3 rounded-lg transition-all active:scale-[0.98] ${isProUser ? 'bg-black hover:bg-neutral-800 border border-neutral-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'}`}
                                        disabled={!isProUser}
                                    >
                                        {!isProUser ? 'Upgrade to View Fix' : 'View Fix'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EMIRepaymentHealth;
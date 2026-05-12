import React, { useState, useEffect, useMemo } from 'react';
import {
    Compass,
    Trophy,
    History,
    Zap,
    TrendingDown,
    Sparkles,
    BrainCircuit,
    Timer,
    Map as MapIcon,
    CircleAlert
} from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

export default function FreedomCalculator() {
    const { isProUser } = useAuth();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    const [loanData, setLoanData] = useState({
        originalSanction: 7500000,
        currentOutstanding: 5500000,
        monthlyEMI: 65000,
        roi: 9.15,
        additionalRepayment: 0
    });

    useEffect(() => {
        setIsCheckingAccess(false);
    }, []);

    const handleInputChange = (field, value) => {
        if (!isProUser) return;
        setLoanData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const handleSliderChange = (e) => {
        if (!isProUser) return;
        setLoanData(prev => ({ ...prev, additionalRepayment: parseInt(e.target.value) || 0 }));
    };

    // Auto-calculate roadmap metrics using useMemo
    const roadmap = useMemo(() => {
        const repaid = loanData.originalSanction - loanData.currentOutstanding;
        const journeyComplete = loanData.originalSanction > 0 ? (repaid / loanData.originalSanction) * 100 : 0;

        const remaining = loanData.currentOutstanding;
        const annualInterest = (remaining * loanData.roi) / 100;
        const interestLeakage = Math.round(annualInterest * 10); // Simplified 10yr approx

        const monthlyRate = loanData.roi / 12 / 100;
        const totalEMI = loanData.monthlyEMI + loanData.additionalRepayment;

        // Safety check for calculation
        let monthsLeft = 0;
        if (totalEMI > remaining * monthlyRate) {
            monthsLeft = Math.ceil(Math.log(totalEMI / (totalEMI - remaining * monthlyRate)) / Math.log(1 + monthlyRate));
        }

        const yearsLeft = Math.floor(monthsLeft / 12);
        const remainingMonths = monthsLeft % 12;

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const freedomYear = currentYear + yearsLeft + Math.floor((currentMonth + remainingMonths) / 12);
        const freedomMonth = (currentMonth + remainingMonths) % 12;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const tippingPointMonths = Math.ceil(monthsLeft * 0.6); // 60% of total time
        const tippingYear = currentYear + Math.floor((currentMonth + tippingPointMonths) / 12);
        const tippingMonth = monthNames[(currentMonth + tippingPointMonths) % 12];

        return {
            journeyComplete: Math.max(0, parseFloat(journeyComplete.toFixed(2))),
            repaidAmount: Math.max(0, repaid),
            freedomDate: `${monthNames[freedomMonth]} ${freedomYear}`,
            yearsLeft,
            monthsLeft: remainingMonths,
            interestLeakage,
            interestPerMonth: Math.round(remaining * monthlyRate),
            tippingPointDate: `${tippingMonth} ${tippingYear}`
        };
    }, [loanData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace('₹', '₹ ');
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

            {/* INPUT CARD */}
            <div className="bg-white rounded-2xl p-5 shadow border">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Compass size={18} className="text-gray-700" />
                        <h2 className="text-lg font-semibold">Debt Freedom Roadmap Audit</h2>
                    </div>
                    <div className={`px-3 py-1 rounded-md flex items-center gap-2 text-neutral-700 ${isProUser ? 'bg-white border' : 'bg-gray-50 border'}`}>
                        <div className={`w-2 h-2 rounded-full ${isProUser ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">
                            {isProUser ? 'Active Tracking' : 'Pro Required'}
                        </span>
                    </div>
                </div>

           <div className="space-y-5 mb-5">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <EditableRangeField
            label="Original Sanction"
            value={loanData.originalSanction}
            onChange={(val) =>
                handleInputChange(
                    "originalSanction",
                    val
                )
            }
            min={100000}
            max={50000000}
            step={1000}
            format="currency"
            icon={<Trophy className="w-3 h-3" />}
        />

        <EditableRangeField
            label="Outstanding"
            value={loanData.currentOutstanding}
            onChange={(val) =>
                handleInputChange(
                    "currentOutstanding",
                    val
                )
            }
            min={100000}
            max={50000000}
            step={1000}
            format="currency"
            icon={<History className="w-3 h-3" />}
        />

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <EditableRangeField
            label="Monthly EMI"
            value={loanData.monthlyEMI}
            onChange={(val) =>
                handleInputChange(
                    "monthlyEMI",
                    val
                )
            }
            min={1000}
            max={500000}
            step={100}
            format="currency"
            icon={<Zap className="w-3 h-3" />}
        />

        <EditableRangeField
            label="ROI (%)"
            value={loanData.roi}
            onChange={(val) =>
                handleInputChange(
                    "roi",
                    val
                )
            }
            min={1}
            max={20}
            step={0.05}
            format="percent"
            icon={<TrendingDown className="w-3 h-3" />}
        />

    </div>

    <EditableRangeField
        label="Accelerator (Extra EMI/Mo)"
        value={loanData.additionalRepayment}
        onChange={(val) =>
            handleInputChange(
                "additionalRepayment",
                val
            )
        }
        min={0}
        max={50000}
        step={100}
        format="currency"
        icon={<Sparkles className="w-3.5 h-3.5" />}
    />

</div>

                <button
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!isProUser}
                >
                    <BrainCircuit size={16} />
                    {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Simulate Freedom Roadmap'}
                </button>
            </div>

            {/* RESULTS SECTION */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Progress Circle */}
                    <div className="bg-white p-5 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="relative w-24 h-24 mb-3">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"></circle>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#2E7D32" strokeWidth="3"
                                    strokeDasharray={`${isProUser ? roadmap.journeyComplete : 0}, 100`} strokeLinecap="round" className="transition-all duration-1000"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-base font-bold text-gray-900 ${blurClass}`}>{roadmap.journeyComplete}%</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Journey Complete</span>
                        <div className={`text-sm font-semibold text-gray-900 mt-1 ${blurClass}`}>
                            {formatCurrency(roadmap.repaidAmount)} Repaid
                        </div>
                    </div>

                    {/* Freedom Date Box */}
                    <div className={`p-5 rounded-xl text-white shadow-md flex flex-col justify-between ${isProUser ? 'bg-[#1f2a3c]' : 'bg-gray-600'}`}>
                        <div>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Freedom Date Projection</span>
                            <div className={`text-xl font-bold tracking-tight ${blurClass}`}>
                                {isProUser ? roadmap.freedomDate : 'XX XXXX'}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-400 font-semibold mt-1">
                                <Timer className="w-3 h-3" />
                                {isProUser ? `${roadmap.yearsLeft}Y ${roadmap.monthsLeft}M Left` : 'XXY XXM Left'}
                            </div>
                        </div>
                        <div className="pt-3 border-t border-white/10 mt-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 uppercase font-semibold">Interest Leakage</span>
                                <span className={`text-red-400 font-bold ${blurClass}`}>{formatCurrency(roadmap.interestLeakage)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Milestone Map */}
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <MapIcon className="w-4 h-4 text-gray-700" />
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">The Milestone Map</h4>
                    </div>

                    <div className="relative h-1.5 bg-gray-100 rounded-full flex items-center mb-8">
                        <div className="absolute left-0 h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: `${isProUser ? roadmap.journeyComplete : 0}%` }}></div>
                        <div className="w-full flex justify-between relative">
                            <div className="flex flex-col items-center">
                                <div className="w-3.5 h-3.5 rounded-full bg-green-600 border-2 border-white shadow-sm z-10"></div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase mt-2 absolute top-4">Sanction</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 ${isProUser ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase mt-2 absolute top-4 whitespace-nowrap">Tipping Point</span>
                                <span className={`text-[9px] text-gray-500 mt-1 absolute top-8 whitespace-nowrap ${blurClass}`}>{isProUser ? roadmap.tippingPointDate : 'XX XXXX'}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 ${isProUser ? 'bg-gray-300' : 'bg-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase mt-2 absolute top-4 whitespace-nowrap">Debt Free</span>
                                <span className={`text-[9px] text-gray-500 mt-1 absolute top-8 whitespace-nowrap ${blurClass}`}>{isProUser ? roadmap.freedomDate : 'XX XXXX'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
                        <CircleAlert className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 leading-relaxed">
                            <strong>Critical Insight:</strong> Interest is costing you <span className={blurClass}>{formatCurrency(roadmap.interestPerMonth)}</span> per month. Tipping Point is the date when your principal portion exceeds interest in the EMI.
                        </p>
                    </div>
                </div>
            </div>
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
    icon = null,
}) {
    const [editing, setEditing] =
        useState(false);

    const [tempValue, setTempValue] =
        useState(value);

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
        <div className="space-y-3">

            <div className="flex items-center justify-between">

                <label className="text-xs text-gray-500 uppercase flex items-center gap-1">
                    {icon}
                    {label}
                </label>

                {!editing && (
                    <button
                        onClick={() => {
                            setEditing(true);
                            setTempValue(value);
                        }}
                        className="
                            w-7 h-7
                            rounded-lg
                            bg-gray-100
                            text-gray-600
                            flex items-center justify-center
                            text-xs
                        "
                    >
                        ✎
                    </button>
                )}

            </div>

            {!editing ? (
                <div className="border rounded-xl px-4 py-3 font-semibold bg-white">
                    {displayValue()}
                </div>
            ) : (
                <div className="flex items-center gap-2">

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
                        className="
                            flex-1
                            border
                            rounded-xl
                            px-4 py-3
                            font-semibold
                            bg-white
                            outline-none
                        "
                    />

                    <button
                        onClick={saveValue}
                        className="
                            px-4 py-3
                            rounded-xl
                            bg-black
                            text-white
                            text-sm
                            font-semibold
                        "
                    >
                        OK
                    </button>

                </div>
            )}

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
                    accent-black
                "
            />

            <div className="flex justify-between text-[10px] text-gray-400">

                <span>{min}</span>

                <span>{max}</span>

            </div>

        </div>
    );
}
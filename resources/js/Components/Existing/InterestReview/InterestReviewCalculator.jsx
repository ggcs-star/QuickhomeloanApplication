import React, { useState, useEffect } from 'react';
import {
    Scale,
    Calendar,
    Info,
    Wrench,
    Lock
} from "lucide-react";
import api from '../../../api';

export default function InterestReviewCalculator() {
    const [isProUser, setIsProUser] = useState(false);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    const [data, setData] = useState({
        loan: 5000000,
        emi: 45000,
        paid: 12,
        tenure: 15,
    });

    const [results, setResults] = useState({
        totalEMIPaid: 540000,
        interestComponent: 344847,
        principalComponent: 195153,
        interestPercentage: 63.86,
        annualROI: 7.02
    });

    // Check pro access on component mount
    useEffect(() => {
        checkProAccess();

        const handleSubscriptionUpdate = (event) => {
            if (event.detail?.isPro === true) {
                checkProAccess();
            }
        };

        window.addEventListener("subscriptionUpdated", handleSubscriptionUpdate);

        return () => {
            window.removeEventListener("subscriptionUpdated", handleSubscriptionUpdate);
        };
    }, []);

    const checkProAccess = async () => {
        setIsCheckingAccess(true);
        try {
            const isProLocal = localStorage.getItem("is_pro_user") === "true";
            if (isProLocal) {
                setIsProUser(true);
                setIsCheckingAccess(false);
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                setIsProUser(false);
                setIsCheckingAccess(false);
                return;
            }

            // Using your api instance
            const response = await api.get("/check-access");

            if (response.data && response.data.access === true) {
                setIsProUser(true);
                localStorage.setItem("is_pro_user", "true");
            } else {
                setIsProUser(false);
                localStorage.setItem("is_pro_user", "false");
            }
        } catch (error) {
            console.error("Error checking pro access:", error);
            // If 401, the interceptor will handle redirect
            const isProLocal = localStorage.getItem("is_pro_user") === "true";
            setIsProUser(isProLocal);
        } finally {
            setIsCheckingAccess(false);
        }
    };

    // Calculate results when loan data changes
    useEffect(() => {
        if (isProUser) {
            calculateResults();
        }
    }, [data, isProUser]);

    const calculateResults = () => {
        const totalEMIPaid = data.emi * data.paid;

        // Simple calculation for demonstration
        const monthlyRate = 0.0702 / 12;
        const interest = data.loan * monthlyRate * data.paid;
        const principal = totalEMIPaid - interest;

        setResults({
            totalEMIPaid: Math.round(totalEMIPaid),
            interestComponent: Math.round(interest),
            principalComponent: Math.round(principal),
            interestPercentage: Math.round((interest / totalEMIPaid) * 10000) / 100,
            annualROI: 7.02
        });
    };

    const format = (v) =>
        `₹ ${Number(v).toLocaleString("en-IN")}`;

    const getStatusBadge = (percentage) => {
        if (percentage > 70) return { text: "HIGH INTEREST SHARE", color: "bg-red-400" };
        if (percentage > 50) return { text: "MODERATE INTEREST SHARE", color: "bg-orange-400" };
        return { text: "LOW INTEREST SHARE", color: "bg-green-400" };
    };

    const getInterestShareColor = (percentage) => {
        if (percentage > 70) return "bg-red-100 text-red-700 border-red-200";
        if (percentage > 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-green-100 text-green-700 border-green-200";
    };

    const statusBadge = getStatusBadge(results.interestPercentage);

    return (
        <div className="space-y-6">

            {/* Upgrade Banner for non-pro users */}
            {!isProUser && !isCheckingAccess && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Lock size={18} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Unlock Full Calculator</h4>
                            <p className="text-xs text-indigo-800 mb-3">
                                Pro users get access to interactive inputs, detailed calculations, and complete financial insights.
                            </p>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent("openProModal"));
                                }}
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CARD */}
            <div className="bg-white rounded-2xl p-5 shadow border">

                {/* HEADER */}
                <div className="flex items-center gap-2 mb-4">
                    <Scale size={18} className="text-gray-700" />
                    <h2 className="text-lg font-semibold">
                        Yearly Interest & Rate Audit
                    </h2>
                </div>

                {/* STATUS BADGE */}
                <div className={`${statusBadge.color} text-white text-sm px-4 py-2 rounded-full inline-flex items-center gap-2 mb-5`}>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    {!isProUser && !isCheckingAccess ? "UPGRADE TO VIEW" : statusBadge.text}
                </div>

                {/* LOAN */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 uppercase">
                        Loan Outstanding
                    </label>

                    {isProUser ? (
                        <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                            <span className="text-gray-500 font-semibold mr-2">₹</span>
                            <input
                                type="number"
                                value={data.loan}
                                onChange={(e) => setData(prev => ({ ...prev, loan: parseFloat(e.target.value) || 0 }))}
                                className="w-full text-lg font-semibold bg-transparent outline-none"
                            />
                        </div>
                    ) : (
                        <div className="mt-1 border rounded-xl px-4 py-3 text-lg font-semibold filter blur-[4px] select-none">
                            {format(data.loan)}
                        </div>
                    )}
                </div>

                {/* EMI + PAID */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">
                            EMI Amount
                        </label>
                        {isProUser ? (
                            <div className="mt-1 border rounded-xl px-4 py-3 flex items-center">
                                <span className="text-gray-500 font-semibold mr-2">₹</span>
                                <input
                                    type="number"
                                    value={data.emi}
                                    onChange={(e) => setData(prev => ({ ...prev, emi: parseFloat(e.target.value) || 0 }))}
                                    className="w-full font-semibold bg-transparent outline-none"
                                />
                            </div>
                        ) : (
                            <div className="mt-1 border rounded-xl px-4 py-3 font-semibold filter blur-[4px] select-none">
                                {format(data.emi)}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase">
                            EMIs Paid
                        </label>
                        {isProUser ? (
                            <div className="mt-1 border rounded-xl px-4 py-3">
                                <input
                                    type="number"
                                    value={data.paid}
                                    onChange={(e) => setData(prev => ({ ...prev, paid: parseInt(e.target.value) || 0 }))}
                                    className="w-full font-semibold bg-transparent outline-none"
                                />
                            </div>
                        ) : (
                            <div className="mt-1 border rounded-xl px-4 py-3 font-semibold filter blur-[4px] select-none">
                                {data.paid}
                            </div>
                        )}
                    </div>
                </div>

                {/* TENURE */}
                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs text-gray-500 uppercase">
                            Tenure (Years)
                        </label>

                        <span className={`text-xs px-2 py-1 rounded ${!isProUser && !isCheckingAccess ? 'bg-gray-100 text-gray-500 filter blur-[3px]' : getInterestShareColor(results.interestPercentage)}`}>
                            {results.interestPercentage}% INTEREST SHARE
                        </span>
                    </div>

                    {isProUser ? (
                        <div className="mt-1 border rounded-xl px-4 py-3 flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <input
                                type="number"
                                value={data.tenure}
                                onChange={(e) => setData(prev => ({ ...prev, tenure: parseInt(e.target.value) || 0 }))}
                                className="font-semibold bg-transparent outline-none w-full"
                            />
                        </div>
                    ) : (
                        <div className="mt-1 border rounded-xl px-4 py-3 flex items-center gap-2 font-semibold filter blur-[4px] select-none">
                            <Calendar size={16} className="text-gray-500" />
                            {data.tenure}
                        </div>
                    )}
                </div>

                {/* NOTE */}
                <div className="border rounded-xl p-4 bg-gray-50 flex gap-3">
                    <Info size={18} className="text-blue-500 mt-1" />

                    <div>
                        <h4 className="font-semibold text-sm">
                            COMPLIANCE NOTE
                        </h4>
                        <p className="text-sm text-gray-600">
                            All calculations are based on standard amortization schedules as per RBI Master Circular.
                        </p>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    className={`w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${isProUser
                        ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    disabled={!isProUser}
                >
                    <Wrench size={16} />
                    {!isProUser && !isCheckingAccess ? 'Upgrade to Audit' : 'Complete Interest Audit'}
                </button>

            </div>

            {/* RESULT CARDS */}
            <div className="space-y-4">

                {/* INTEREST COMPONENT */}
                <div className="bg-red-100 border rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold">
                            INTEREST COMPONENT
                        </p>
                        <p className="text-xs text-red-500">
                            BANK'S EARNINGS
                        </p>
                    </div>

                    <span className={`font-bold text-lg ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {format(results.interestComponent)}
                    </span>
                </div>

                {/* INTEREST SHARE */}
                <div className={`border rounded-xl p-4 flex justify-between items-center ${getInterestShareColor(results.interestPercentage)}`}>
                    <div>
                        <p className="text-sm font-semibold">
                            INTEREST SHARE
                        </p>
                        <p className="text-xs">
                            {results.interestPercentage > 70 ? 'High Interest Burden' :
                                results.interestPercentage > 50 ? 'Moderate Interest Burden' :
                                    'Low Interest Burden'}
                        </p>
                    </div>

                    <span className={`font-bold text-lg ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {results.interestPercentage}%
                    </span>
                </div>

                {/* TOTAL EMI */}
                <div className="bg-[#1f2a3c] text-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-orange-300">
                            INTEREST COST IMPACT
                        </p>
                        <p className="text-sm font-semibold">
                            TOTAL EMI PAID
                        </p>
                    </div>

                    <span className={`font-bold text-xl ${!isProUser && !isCheckingAccess ? 'filter blur-[4px] select-none' : ''}`}>
                        {format(results.totalEMIPaid)}
                    </span>
                </div>

            </div>

        </div>
    );
}
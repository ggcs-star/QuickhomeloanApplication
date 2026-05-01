import React, { useState, useEffect } from 'react';
import {
    Scale,
    Calendar,
    Info,
    Wrench,
    Lock
} from "lucide-react";
import api from '../../../api';
import { useAuth } from "@/Context/AuthContext";
import { router } from "@inertiajs/react";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";
export default function InterestReviewCalculator() {


    const { isProUser } = useAuth();
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


    useEffect(() => {
        setIsCheckingAccess(false);

        const handleSubscriptionUpdate = () => {

        };

        window.addEventListener("subscriptionUpdated", handleSubscriptionUpdate);

        return () => {
            window.removeEventListener("subscriptionUpdated", handleSubscriptionUpdate);
        };
    }, []);


    useEffect(() => {
        if (isProUser) {
            calculateResults();
        }
    }, [data, isProUser]);

    const calculateResults = () => {
        const totalEMIPaid = data.emi * data.paid;

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
                <ProUpgradeBanner

                />
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
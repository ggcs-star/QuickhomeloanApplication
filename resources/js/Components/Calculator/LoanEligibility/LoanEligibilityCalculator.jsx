import React, { useState } from "react";

/* HELPERS */
const formatCurrency = (num) =>
    num ? `₹${Math.round(num).toLocaleString("en-IN")}` : "₹0";

const getFoirLimit = (income) => {
    if (income <= 30000) return 0.4;
    if (income <= 60000) return 0.5;
    return 0.6;
};

const calculateLoanFromEmi = (emi, annualRate, years) => {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return emi * n;
    return (emi * (Math.pow(1 + r, n) - 1)) /
        (r * Math.pow(1 + r, n));
};

export default function LoanEligibilityCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(80000);
    const [existingEmis, setExistingEmis] = useState(10000);
    const [loanType, setLoanType] = useState("home");
    const [method, setMethod] = useState("foir");
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [assetValue, setAssetValue] = useState(4500000);
    const [ltvRatio, setLtvRatio] = useState(80);
    const [result, setResult] = useState(null);

    /* CALCULATE */
    const handleCalculate = () => {
        let eligibleEmi = 0;

        if (method === "foir") {
            eligibleEmi =
                monthlyIncome * getFoirLimit(monthlyIncome) -
                Number(existingEmis);
        } else {
            const multiplier =
                loanType === "home" ? 60 :
                    loanType === "car" ? 36 : 24;

            setResult({
                eligibleLoan: monthlyIncome * multiplier,
                maxEmi: null,
                cappedLoan: null,
            });
            return;
        }

        if (eligibleEmi <= 0) {
            setResult({ error: "Existing EMIs are too high for eligibility." });
            return;
        }

        const loanFromIncome = calculateLoanFromEmi(
            eligibleEmi,
            interestRate,
            tenure
        );

        const ltvCap = (assetValue * ltvRatio) / 100;

        setResult({
            maxEmi: eligibleEmi,
            eligibleLoan: Math.min(loanFromIncome, ltvCap),
            cappedLoan: ltvCap,
        });
    };

    /* RESET */
    const handleReset = () => {
        setMonthlyIncome(80000);
        setExistingEmis(10000);
        setLoanType("home");
        setMethod("foir");
        setInterestRate(8.5);
        setTenure(20);
        setAssetValue(4500000);
        setLtvRatio(80);
        setResult(null);
    };

    /* DONUT */
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress =
        result && result.eligibleLoan && assetValue
            ? Math.min(result.eligibleLoan / assetValue, 1)
            : 0;
    const dash = progress * circumference;

    return (
        <section className="bg-white p-4 rounded-2xl shadow">

            <h2 className="text-xl font-bold mb-4">
                Loan Eligibility Calculator
            </h2>

            {/* FORM */}
            <div className="grid grid-cols-1 gap-4">

                <Input label="Net Monthly Income" value={monthlyIncome} onChange={setMonthlyIncome} prefix="₹" />
                <Input label="Existing EMIs" value={existingEmis} onChange={setExistingEmis} prefix="₹" />

                <Select
                    label="Loan Type"
                    value={loanType}
                    onChange={setLoanType}
                    options={[
                        { v: "home", t: "Home Loan" },
                        { v: "car", t: "Car Loan" },
                        { v: "personal", t: "Personal Loan" },
                    ]}
                />

                <Select
                    label="Calculation Method"
                    value={method}
                    onChange={setMethod}
                    options={[
                        { v: "foir", t: "FOIR" },
                        { v: "multiplier", t: "Multiplier" },
                    ]}
                />

                <Input label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" />
                <Input label="Tenure" value={tenure} onChange={setTenure} suffix="Yrs" />
                <Input label="Asset Value" value={assetValue} onChange={setAssetValue} prefix="₹" />
                <Input label="LTV Ratio" value={ltvRatio} onChange={setLtvRatio} suffix="%" />

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
                <button onClick={handleCalculate} className="w-full bg-gray-900 text-white py-3 rounded-lg">
                    Calculate
                </button>

                <button onClick={handleReset} className="w-full bg-gray-200 py-3 rounded-lg">
                    Reset
                </button>
            </div>

            {/* RESULT */}
            <div className="mt-6 text-center bg-gray-50 p-4 rounded-lg">

                {/* DONUT */}
                <div className="relative w-[140px] h-[140px] mx-auto mb-4">
                    <svg viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r={radius} stroke="#e5e7eb" strokeWidth="16" fill="none" />
                        {result && !result.error && (
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="#374151"
                                strokeWidth="16"
                                fill="none"
                                strokeDasharray={`${dash} ${circumference}`}
                                transform="rotate(-90 80 80)"
                            />
                        )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                        {!result ? (
                            <span className="text-sm text-gray-500">
                                Calculate
                            </span>
                        ) : result.error ? (
                            <span className="text-red-600 text-sm">
                                Not Eligible
                            </span>
                        ) : (
                            <>
                                <span className="text-xs text-gray-500">
                                    Eligible Loan
                                </span>
                                <span className="text-lg font-bold">
                                    {formatCurrency(result.eligibleLoan)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* STATS */}
                {result && !result.error && (
                    <div className="space-y-2">
                        {result.maxEmi && (
                            <Stat label="Eligible EMI" value={formatCurrency(result.maxEmi)} />
                        )}
                        <Stat label="Loan Amount" value={formatCurrency(result.eligibleLoan)} />
                    </div>
                )}

                {result?.error && (
                    <p className="text-red-600 mt-2">{result.error}</p>
                )}
            </div>
        </section>
    );
}

/* INLINE COMPONENTS */

function Input({ label, value, onChange, prefix, suffix }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <div className="relative mt-1">
                {prefix && <span className="absolute left-2 top-2">{prefix}</span>}
                {suffix && <span className="absolute right-2 top-2">{suffix}</span>}
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full border rounded px-3 py-2 ${prefix ? "pl-6" : ""} ${suffix ? "pr-6" : ""}`}
                />
            </div>
        </div>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
            >
                {options.map((o) => (
                    <option key={o.v} value={o.v}>
                        {o.t}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="flex justify-between bg-gray-100 p-2 rounded">
            <span>{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}
import React, { useState, useEffect, useMemo } from 'react';
import { FileSearch, ShieldAlert, BrainCircuit, Info } from 'lucide-react';
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";

// Reusable Card Component
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

// Constants & Rules
const MARKET_RANGES = {
  GOVT_BANK: { best: 7.10, averageMin: 7.50, averageMax: 8.10, worst: 10.0 },
  PRIVATE_BANK: { best: 7.20, averageMin: 8.00, averageMax: 9.00, worst: 13.20 },
  NBFC: { best: 7.20, averageMin: 8.20, averageMax: 10.0, worst: 15.0 }
};

const FEE_RULES = {
  PROCESSING_PERCENT: {
    GOVT_BANK: { best: [0, 0], average: [0.25, 0.35], worst: [0.50, 1] },
    PRIVATE_BANK: { best: [0, 0], average: [0.50, 0.50], worst: [1.50, 2.00] },
    NBFC: { best: [0.25, 0.25], average: [1.00, 2.00], worst: [2.00, 4.00] }
  },
  LEGAL_FEE: {
    GOVT_BANK: { best: [0, 0], average: [2500, 5000], worst: [10000, 15000] },
    PRIVATE_BANK: { best: [3000, 3000], average: [5000, 5000], worst: [15000, 20000] },
    NBFC: { best: [3000, 3000], average: [5000, 10000], worst: [20000, 30000] }
  },
  TECHNICAL_FEE: {
    GOVT_BANK: { best: [0, 0], average: [2500, 5000], worst: [10000, 15000] },
    PRIVATE_BANK: { best: [3000, 3000], average: [5000, 5000], worst: [15000, 20000] },
    NBFC: { best: [3000, 3000], average: [5000, 10000], worst: [20000, 30000] }
  },
  DOCUMENTATION: {
    GOVT_BANK: { best: [0, 0], average: [500, 1000], worst: [2500, 5000] },
    PRIVATE_BANK: { best: [0, 0], average: [2000, 2000], worst: [5000, 10000] },
    NBFC: { best: [0, 0], average: [2500, 2500], worst: [10000, 15000] }
  }
};

const sourceBiases = {
  GOVT_BANK: { bias: 'Slow processing, low rates, transparent. Often called Govt Banks.', risk: 'Low', score: 95 },
  PRIVATE_BANK: { bias: 'Aggressive sales, hidden insurance, fast.', risk: 'Medium', score: 82 },
  NBFC: { bias: 'High rates, flexible, heavy penalties.', risk: 'High', score: 65 },
};

export default function OfferDecoderCalculator() {
  const { isProUser } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [loanData, setLoanData] = useState({
    loanAmount: 5000000,
    tenureYears: 20
  });

  const [offerDetails, setOfferDetails] = useState({
    source: 'GOVT_BANK',
    quotedRate: 8.4,
    processingFee: 25000,
    legalFee: 5000,
    technicalFee: 5000,
    documentationCharges: 2000,
    prepaymentAllowed: 'Yes without charges',
    cibilScore: 750,
    modtFee: 0.1, // percentage
    isBuilderTieUp: false,
    hasBundledInsurance: false,
  });

  useEffect(() => {
    setIsCheckingAccess(false);
  }, []);

  // Helper Functions
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace('₹', '₹ ');

  const getCreditTier = (cibil) => {
    if (cibil >= 800) return "EXCELLENT";
    if (cibil >= 750) return "VERY GOOD";
    if (cibil >= 700) return "GOOD";
    if (cibil >= 650) return "AVERAGE";
    if (cibil >= 600) return "RISKY";
    return "HIGH RISK";
  };

  const expectedRate = (lender, cibil) => {
    const baseRate = MARKET_RANGES[lender].best;
    let adjustment = 3.40;
    if (cibil >= 800) adjustment = 0;
    else if (cibil >= 750) adjustment = 0.25;
    else if (cibil >= 700) adjustment = 0.55;
    else if (cibil >= 650) adjustment = 1.00;
    else if (cibil >= 600) adjustment = 1.75;
    return baseRate + adjustment;
  };

  const calculateEMI = (amount, annualRate, years) => {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return amount / n;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const classifyFee = (value, rule) => {
    if (value >= rule.best[0] && value <= rule.best[1]) return "BEST";
    if (value >= rule.average[0] && value <= rule.average[1]) return "AVERAGE";
    if (value >= rule.worst[0] && value <= rule.worst[1]) return "EXPENSIVE";
    return "VERY EXPENSIVE";
  };

  const handleLoanChange = (field, value) => {
    if (!isProUser) return;
    setLoanData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleOfferChange = (field, value) => {
    if (!isProUser) return;
    setOfferDetails(prev => ({ 
      ...prev, 
      [field]: field === 'source' || field === 'prepaymentAllowed' || typeof value === 'boolean' ? value : (parseFloat(value) || 0) 
    }));
  };

  // Calculations
  const decodedOffer = useMemo(() => {
    const emi = calculateEMI(loanData.loanAmount, offerDetails.quotedRate, loanData.tenureYears);
    const totalInterest = (emi * loanData.tenureYears * 12) - loanData.loanAmount;
    
    const creditTier = getCreditTier(offerDetails.cibilScore);
    const marketRate = expectedRate(offerDetails.source, offerDetails.cibilScore);
    const marketGap = offerDetails.quotedRate - marketRate;
    
    let offerCategory = "VERY EXPENSIVE";
    if (marketGap <= -0.05) offerCategory = "BEST OFFER";
    else if (marketGap <= 0.20) offerCategory = "GOOD OFFER";
    else if (marketGap <= 0.50) offerCategory = "AVERAGE OFFER";
    else if (marketGap <= 1.50) offerCategory = "EXPENSIVE OFFER";

    const idealEmi = calculateEMI(loanData.loanAmount, marketRate, loanData.tenureYears);
    const estimatedExtraInterest = Math.round((emi - idealEmi) * loanData.tenureYears * 12);

    const pfAmount = offerDetails.processingFee < 100 ? (loanData.loanAmount * offerDetails.processingFee / 100) : offerDetails.processingFee;
    const modtAmount = offerDetails.modtFee < 1 ? (loanData.loanAmount * offerDetails.modtFee / 100) : offerDetails.modtFee;
    
    const totalFees = pfAmount + offerDetails.legalFee + offerDetails.technicalFee + offerDetails.documentationCharges + modtAmount;
    const trueCost = totalInterest + totalFees;
    const tci = loanData.loanAmount > 0 ? (trueCost / loanData.loanAmount) * 100 : 0;
    const feePercentage = loanData.loanAmount > 0 ? (totalFees / loanData.loanAmount) * 100 : 0;
    
    const emiWithFee = calculateEMI(totalFees, offerDetails.quotedRate, loanData.tenureYears);
    const financedInterestCost = Math.round((emiWithFee * loanData.tenureYears * 12) - totalFees);

    const feeBreakdown = {
      processingFeeRating: classifyFee(pfAmount / loanData.loanAmount * 100, FEE_RULES.PROCESSING_PERCENT[offerDetails.source]),
      legalFeeRating: classifyFee(offerDetails.legalFee, FEE_RULES.LEGAL_FEE[offerDetails.source]),
      technicalFeeRating: classifyFee(offerDetails.technicalFee, FEE_RULES.TECHNICAL_FEE[offerDetails.source]),
      documentationRating: classifyFee(offerDetails.documentationCharges, FEE_RULES.DOCUMENTATION[offerDetails.source])
    };

    const isExpensive = offerCategory.includes('EXPENSIVE');

    return {
      emi, totalInterest, totalFees, trueCost, tci, pfAmount, modtAmount,
      creditTier, marketRate, marketGap, estimatedExtraInterest, feePercentage, 
      financedInterestCost, isExpensive, offerCategory, feeBreakdown
    };
  }, [loanData, offerDetails]);

  const blurClass = !isProUser && !isCheckingAccess ? "filter blur-[4px] select-none" : "";

  return (
    <div className="space-y-6">
      {!isProUser && !isCheckingAccess && <ProUpgradeBanner />}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
            <FileSearch className="text-blue-600" size={28} />
            Offer Truth Decoder
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Identify hidden bias in PSU, Private Bank, or NBFC loan offers.</p>
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">True Cost Index</div>
          <div className={`text-xl font-bold text-blue-600 ${blurClass}`}>{decodedOffer.tci.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* INPUT SECTION */}
        <div className="space-y-6 md:col-span-1">
       <Card title="Basic Information">

  <div className="space-y-4">

    {/* LENDER TYPE */}
    <div className="bg-white border border-[#e9edf5] rounded-[18px] p-4">

      <p className="text-[12px] text-gray-500 font-medium mb-3">
        Lender Type
      </p>

      {isProUser ? (

        <select
          value={offerDetails.source}
          onChange={(e) =>
            handleOfferChange(
              "source",
              e.target.value
            )
          }
          className="
            w-full
            h-12
            rounded-2xl
            border border-[#d9e2f2]
            px-4
            text-[14px]
            font-bold
            text-[#081c4b]
            outline-none
            focus:border-blue-500
          "
        >
          <option value="GOVT_BANK">
            GOVT BANK
          </option>

          <option value="PRIVATE_BANK">
            PRIVATE BANK
          </option>

          <option value="NBFC">
            NBFC
          </option>

        </select>

      ) : (

        <div
          className={`
            h-12 rounded-2xl
            border border-[#edf1f7]
            px-4
            flex items-center
            text-[14px]
            font-bold
            text-[#081c4b]
            bg-[#f8faff]
            ${blurClass}
          `}
        >
          GOVT BANK
        </div>

      )}

    </div>

    {/* BIAS CARD */}
    {offerDetails.source && (

      <div
        className={`
          p-4 rounded-[18px] border
          ${
            offerDetails.source ===
            "GOVT_BANK"
              ? "bg-green-50 border-green-200"
              : offerDetails.source ===
                "PRIVATE_BANK"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }
        `}
      >

        <div className="flex justify-between items-start gap-3">

          <div>

            <div className="flex items-center gap-2">

              <ShieldAlert
                size={16}
                className={
                  offerDetails.source ===
                  "GOVT_BANK"
                    ? "text-green-600"
                    : offerDetails.source ===
                      "PRIVATE_BANK"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              />

              <span className="text-[11px] font-black uppercase tracking-wider text-gray-900">
                {offerDetails.source.replace(
                  "_",
                  " "
                )}
                {" "}Bias Profile
              </span>

            </div>

            <p className="text-[11px] text-gray-600 mt-2 leading-5">
              {
                sourceBiases[
                  offerDetails.source
                ].bias
              }
            </p>

          </div>

          <div className="bg-white border border-white/50 rounded-xl px-2 py-1 text-[10px] font-black text-[#081c4b]">
            {
              sourceBiases[
                offerDetails.source
              ].score
            }
            /100
          </div>

        </div>

      </div>

    )}

    {/* MODERN INPUTS */}
    <EditableRangeField
      label="Loan Amount"
      value={loanData.loanAmount}
      onChange={(val) =>
        handleLoanChange(
          "loanAmount",
          val
        )
      }
      min={100000}
      max={10000000}
      step={100000}
      format="currency"
      disabled={!isProUser}
    />

    <EditableRangeField
      label="Interest Rate"
      value={offerDetails.quotedRate}
      onChange={(val) =>
        handleOfferChange(
          "quotedRate",
          val
        )
      }
      min={1}
      max={15}
      step={0.1}
      format="percent"
      disabled={!isProUser}
    />

    <EditableRangeField
      label="Loan Tenure"
      value={loanData.tenureYears}
      onChange={(val) =>
        handleLoanChange(
          "tenureYears",
          val
        )
      }
      min={1}
      max={30}
      step={1}
      format="year"
      disabled={!isProUser}
    />

    {/* SMALL INPUTS */}
    <div className="grid grid-cols-2 gap-3">

      <div className="bg-white border border-[#e9edf5] rounded-[18px] p-4">

        <p className="text-[11px] text-gray-500 font-medium mb-2">
          CIBIL Score
        </p>

        <input
          type="number"
          value={offerDetails.cibilScore}
          disabled={!isProUser}
          onChange={(e) =>
            handleOfferChange(
              "cibilScore",
              e.target.value
            )
          }
          className="
            w-full
            h-11
            rounded-2xl
            border border-[#d9e2f2]
            px-4
            text-[14px]
            font-bold
            outline-none
          "
        />

      </div>

      <div className="bg-white border border-[#e9edf5] rounded-[18px] p-4">

        <p className="text-[11px] text-gray-500 font-medium mb-2">
          Processing Fee
        </p>

        <input
          type="number"
          value={offerDetails.processingFee}
          disabled={!isProUser}
          onChange={(e) =>
            handleOfferChange(
              "processingFee",
              e.target.value
            )
          }
          className="
            w-full
            h-11
            rounded-2xl
            border border-[#d9e2f2]
            px-4
            text-[14px]
            font-bold
            outline-none
          "
        />

      </div>

    </div>

  </div>

</Card>
          <button
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold ${isProUser ? 'bg-[#1f2a3c] text-white hover:bg-[#2a3a4f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!isProUser}
          >
            <BrainCircuit size={16} />
            {!isProUser && !isCheckingAccess ? 'Upgrade to Decode' : 'Analyze Offer Truth'}
          </button>
        </div>

        {/* RESULTS SECTION */}
        <div className="md:col-span-2 space-y-6">
          {decodedOffer.isExpensive && (
            <div className={`bg-red-50 border border-red-200 rounded-xl p-5 ${blurClass}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-red-700 uppercase tracking-tighter">{decodedOffer.offerCategory}</h3>
                  <p className="text-xs text-gray-600">Based on {decodedOffer.creditTier} credit and {offerDetails.source.replace('_', ' ')} selection.</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-gray-500 font-bold">Market Gap</div>
                  <div className="text-lg font-bold text-red-600">{decodedOffer.marketGap.toFixed(2)}% Over</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Credit Tier</div>
                  <div className="text-xs font-bold text-blue-600">{decodedOffer.creditTier}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Bias Detection</div>
                  <div className="text-xs font-bold text-gray-800">{sourceBiases[offerDetails.source].score}/100</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Estimated Commission</div>
                  <div className="text-xs font-bold text-gray-500">₹0 – ₹0</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-[9px] uppercase text-gray-500 font-bold mb-1">Extra Interest</div>
                  <div className="text-xs font-bold text-red-600">{formatCurrency(decodedOffer.estimatedExtraInterest)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-[10px] uppercase text-gray-500 font-bold">Fee Intelligence</div>
                <div className="text-[10px] font-bold text-yellow-600 uppercase">Average Fees</div>
              </div>
              <div className={`p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 ${blurClass}`}>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-semibold">Fee % of Loan</span>
                  <span className="text-gray-900 font-bold">{decodedOffer.feePercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-600 font-semibold">Financed Interest Cost</span>
                  <span className="text-red-600 font-bold">{formatCurrency(decodedOffer.financedInterestCost)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] uppercase text-gray-500 font-bold">Fee Benchmark Analysis</div>
              <div className={`space-y-2 ${blurClass}`}>
                {[
                  { label: 'Processing Fee', val: offerDetails.processingFee, status: decodedOffer.feeBreakdown.processingFeeRating },
                  { label: 'Legal Fee', val: offerDetails.legalFee, status: decodedOffer.feeBreakdown.legalFeeRating },
                  { label: 'Technical Fee', val: offerDetails.technicalFee, status: decodedOffer.feeBreakdown.technicalFeeRating },
                  { label: 'Documentation', val: offerDetails.documentationCharges, status: decodedOffer.feeBreakdown.documentationRating },
                ].map((fee, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] p-2 bg-gray-50 border border-gray-100 rounded-md">
                    <span className="text-gray-600 font-semibold">{fee.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-bold">{formatCurrency(fee.val)}</span>
                      <span className={`font-bold ${fee.status.includes('EXPENSIVE') ? 'text-red-600' : 'text-green-600'}`}>{fee.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Info size={14} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Pro Tip</span>
            </div>
            <p className="text-[11px] text-gray-700 font-medium">
              If you finance these fees into your loan, you will pay an additional <span className="text-red-600 font-bold">{isProUser ? formatCurrency(decodedOffer.financedInterestCost) : '₹XX,XXX'}</span> in interest over {loanData.tenureYears} years. Always try to pay fees upfront.
            </p>
          </div>

          {/* Rate Comparison and Ratios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <div className="text-[10px] uppercase text-gray-500 font-bold mb-4">Principal vs Interest</div>
              <div className={`flex h-4 rounded-full overflow-hidden bg-gray-100 border border-gray-200 ${blurClass}`}>
                <div className="bg-red-500 h-full" style={{ width: `${(decodedOffer.totalInterest / (decodedOffer.totalInterest + loanData.loanAmount)) * 100}%` }} />
                <div className="bg-gray-400 h-full flex-1" />
              </div>
              <div className="flex justify-between mt-2 text-[9px] uppercase font-bold text-gray-500">
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> Interest</div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-gray-400 rounded-sm" /> Principal</div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Total Interest Payable</div>
                <div className={`text-xl font-bold text-gray-900 ${blurClass}`}>{formatCurrency(decodedOffer.totalInterest)}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase text-gray-500 font-bold mb-4">Rate Comparison</div>
              <div className={`space-y-4 ${blurClass}`}>
                <div className="relative pt-2">
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-1">
                    <span>7%</span><span>7.75%</span><span>8.5%</span><span>9.25%</span><span>10%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm" style={{ left: `${((offerDetails.quotedRate - 7) / 3) * 100}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" style={{ left: `${((decodedOffer.marketRate - 7) / 3) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-3 text-[9px] uppercase font-bold">
                    <span className="text-red-600">Your Offer ({offerDetails.quotedRate}%)</span>
                    <span className="text-green-600">Market Best ({decodedOffer.marketRate}%)</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase">Potential Savings</div>
                  <div className="text-xl font-bold text-green-600">{formatCurrency(decodedOffer.estimatedExtraInterest)}</div>
                </div>
              </div>
            </div>
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
  disabled = false,
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
      return `${Number(value).toFixed(1)}%`;
    }

    if (format === "year") {
      return `${value} Years`;
    }

    return value;
  };

  const saveValue = () => {

    let finalValue = parseFloat(tempValue);

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
    <div className="bg-white border border-[#e9edf5] rounded-[18px] p-4">

      {/* TOP */}
      <div className="flex items-start justify-between gap-3">

        <div className="flex-1 min-w-0">

          <p className="text-[12px] text-gray-500 font-medium">
            {label}
          </p>

          {!editing ? (

            <h3 className="text-[30px] leading-none font-black text-[#081c4b] mt-3 tracking-[-1px]">
              {displayValue()}
            </h3>

          ) : (

            <div className="flex gap-2 mt-3">

              <input
                type="number"
                value={tempValue}
                min={min}
                max={max}
                step={step}
                autoFocus
                disabled={disabled}
                onChange={(e) =>
                  setTempValue(
                    e.target.value
                  )
                }
                className="
                  flex-1
                  h-11
                  rounded-2xl
                  border border-[#d9e2f2]
                  px-4
                  text-[15px]
                  font-bold
                  outline-none
                  focus:border-blue-500
                "
              />

              <button
                onClick={saveValue}
                className="
                  h-11
                  px-4
                  rounded-2xl
                  bg-[#001B5E]
                  text-white
                  text-sm
                  font-bold
                "
              >
                Save
              </button>

            </div>

          )}

        </div>

        {!editing && (

          <button
            disabled={disabled}
            onClick={() => {
              setEditing(true);
              setTempValue(value);
            }}
            className="
              w-10 h-10
              rounded-2xl
              bg-[#f4f7fd]
              border border-[#edf1f7]
              flex items-center justify-center
              text-gray-500
              shrink-0
            "
          >
            ✎
          </button>

        )}

      </div>

      {/* SLIDER */}
      <div className="mt-5">

        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) =>
            onChange(
              parseFloat(e.target.value)
            )
          }
          className="
            w-full
            h-2
            accent-[#2563eb]
            cursor-pointer
          "
        />

        <div className="flex justify-between mt-2">

          <span className="text-[11px] text-gray-400">
            {min}
          </span>

          <span className="text-[11px] text-gray-400">
            {max}
          </span>

        </div>

      </div>

    </div>
  );
}
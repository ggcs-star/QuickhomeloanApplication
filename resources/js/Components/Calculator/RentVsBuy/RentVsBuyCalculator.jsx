import React, { useState, useEffect } from 'react';

export default function RentVsBuyCalculator() {
  // State for all inputs
  const [buyingDetails, setBuyingDetails] = useState({
    propertyPrice: 1000000,
    downPaymentPercent: 40,
    loanInterestRate: 6.9,
    loanTenure: 26,
  });

  const [rentingDetails, setRentingDetails] = useState({
    currentMonthlyRent: 15000
  });

  const [economicFactors, setEconomicFactors] = useState({
    propertyAppreciation: 6.0,
    annualRentIncrease: 7.0,
    investmentReturnRate: 12.0,
    maintenanceAndTax: 1.0,
    inflationRate: 6.0
  });

  const [timeFrame, setTimeFrame] = useState({
    analysisPeriod: 15
  });

  // Calculated results state
  const [results, setResults] = useState({
    wealthIfBuying: 840425,
    wealthIfRenting: -1955071,
    breakEvenPoint: 'Year 2',
    finalPropertyValue: 2396558,
    projectedEMI: 4142
  });

  // Chart data state
  const [chartData, setChartData] = useState([]);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [upfrontCosts, setUpfrontCosts] = useState({
    downPayment: 400000,
    stampDuty: 50000,
    registrationFees: 10000,
    brokerageFees: 10000,
    interiorsFurnishing: 100000,
    total: 570000
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate EMI
  const calculateEMI = () => {
    const { propertyPrice, downPaymentPercent, loanInterestRate, loanTenure } = buyingDetails;
    const loanAmount = propertyPrice * (1 - downPaymentPercent / 100);
    const monthlyRate = loanInterestRate / 12 / 100;
    const months = loanTenure * 12;

    if (monthlyRate === 0) return loanAmount / months;

    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Calculate all financial projections
  const calculateProjections = () => {
    const { propertyPrice, downPaymentPercent, loanInterestRate, loanTenure } = buyingDetails;
    const { currentMonthlyRent } = rentingDetails;
    const { propertyAppreciation, annualRentIncrease, investmentReturnRate, maintenanceAndTax, inflationRate } = economicFactors;
    const { analysisPeriod } = timeFrame;

    // Calculate upfront costs
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const stampDuty = propertyPrice * 0.05; // 5%
    const registrationFees = propertyPrice * 0.01; // 1%
    const brokerageFees = propertyPrice * 0.01; // 1%
    const interiorsFurnishing = propertyPrice * 0.1; // 10%
    const totalUpfrontCost = downPayment + stampDuty + registrationFees + brokerageFees + interiorsFurnishing;

    setUpfrontCosts({
      downPayment: Math.round(downPayment),
      stampDuty: Math.round(stampDuty),
      registrationFees: Math.round(registrationFees),
      brokerageFees: Math.round(brokerageFees),
      interiorsFurnishing: Math.round(interiorsFurnishing),
      total: Math.round(totalUpfrontCost)
    });

    // Calculate EMI
    const emi = calculateEMI();
    setResults(prev => ({ ...prev, projectedEMI: emi }));

    // Initialize arrays for yearly data
    const yearlyData = [];
    const chartPoints = [];

    let propertyValue = propertyPrice;
    let loanBalance = propertyPrice - downPayment;
    let buyingWealth = -totalUpfrontCost; 
    let rentingWealth = totalUpfrontCost; 
    let monthlyRent = currentMonthlyRent;

    // Calculate yearly
    for (let year = 1; year <= analysisPeriod; year++) {
      propertyValue *= (1 + propertyAppreciation / 100);
      if (year > 1) {
        monthlyRent *= (1 + annualRentIncrease / 100);
      }

      const yearlyEMI = emi * 12;
      const yearlyMaintenance = propertyValue * (maintenanceAndTax / 100);
      const yearlyInterest = loanBalance * (loanInterestRate / 100);
      const yearlyPrincipal = yearlyEMI - yearlyInterest;

      loanBalance = Math.max(0, loanBalance - yearlyPrincipal);
      buyingWealth = propertyValue - loanBalance - (yearlyEMI * year) - (yearlyMaintenance * year);

      const initialInvestmentGrown = totalUpfrontCost * Math.pow(1 + investmentReturnRate / 100, year);
      const totalRentPaid = monthlyRent * 12 * year;
      rentingWealth = initialInvestmentGrown - totalRentPaid;

      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      const buyingRealWealth = buyingWealth / inflationFactor;
      const rentingRealWealth = rentingWealth / inflationFactor;

      yearlyData.push({
        year,
        buying: Math.round(buyingRealWealth),
        renting: Math.round(rentingRealWealth),
        propertyValue: Math.round(propertyValue),
        remainingLoan: loanBalance > 1000000 ? `${Math.round(loanBalance / 100000)}L` :
          loanBalance > 100000 ? `${Math.round(loanBalance / 100000)}L` :
            Math.round(loanBalance)
      });

      chartPoints.push({
        year,
        buying: buyingRealWealth,
        renting: rentingRealWealth
      });
    }

    const finalBuying = yearlyData[yearlyData.length - 1].buying;
    const finalRenting = yearlyData[yearlyData.length - 1].renting;
    const finalPropertyValue = yearlyData[yearlyData.length - 1].propertyValue;

    let breakEvenYear = '>15';
    for (let i = 0; i < yearlyData.length; i++) {
      if (yearlyData[i].buying >= yearlyData[i].renting) {
        breakEvenYear = `Year ${yearlyData[i].year}`;
        break;
      }
    }

    setResults({
      wealthIfBuying: finalBuying,
      wealthIfRenting: finalRenting,
      breakEvenPoint: breakEvenYear,
      finalPropertyValue,
      projectedEMI: emi
    });

    setYearlyBreakdown(yearlyData);
    setChartData(chartPoints);
  };

  useEffect(() => {
    calculateProjections();
  }, [buyingDetails, rentingDetails, economicFactors, timeFrame]);

  const handleInputChange = (section, field, value) => {
    if (section === 'buying') {
      setBuyingDetails(prev => ({ ...prev, [field]: value }));
    } else if (section === 'renting') {
      setRentingDetails(prev => ({ ...prev, [field]: value }));
    } else if (section === 'economic') {
      setEconomicFactors(prev => ({ ...prev, [field]: value }));
    } else if (section === 'timeFrame') {
      setTimeFrame(prev => ({ ...prev, [field]: value }));
    }
  };

  const getSliderBackground = (value, min, max, customColor = '#111111') => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, ${customColor} ${percentage}%, #e5e7eb ${percentage}%)`,
    };
  };

  // Simple SVG Chart Component
  const WealthProgressionChart = ({ data, years }) => {
    if (!data || data.length === 0) return null;

    const width = 700;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allValues = data.flatMap(d => [d.buying, d.renting]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const xScale = (year) => padding.left + ((year - 1) / (years - 1)) * chartWidth;
    const yScale = (value) => {
      const scaled = ((value - minValue) / (maxValue - minValue)) * chartHeight;
      return height - padding.bottom - scaled;
    };

    const buyingPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.buying)}`).join(' ');
    const rentingPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.renting)}`).join(' ');

    const gridLines = [];
    const numGridLines = 5;
    for (let i = 0; i <= numGridLines; i++) {
      const value = minValue + (maxValue - minValue) * (i / numGridLines);
      const y = yScale(value);
      gridLines.push(
        <g key={`grid-${i}`}>
          <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(128, 128, 128, 0.1)" strokeDasharray="3 3" />
          <text x={padding.left - 10} y={y} textAnchor="end" dominantBaseline="middle" fill="#94a3b8" fontSize="12">
            {formatCurrency(value)}
          </text>
        </g>
      );
    }

    const yearLabels = [];
    for (let year = 1; year <= years; year++) {
      const x = xScale(year);
      yearLabels.push(
        <g key={`year-${year}`}>
          <line x1={x} y1={height - padding.bottom} x2={x} y2={height - padding.bottom + 5} stroke="#94a3b8" />
          <text x={x} y={height - padding.bottom + 20} textAnchor="middle" fill="#94a3b8" fontSize="12">{year}</text>
        </g>
      );
    }

    const buyingPoints = data.map((d, i) => (
      <circle key={`buying-${i}`} cx={xScale(d.year)} cy={yScale(d.buying)} r={3} fill="#10b981" stroke="#10b981" strokeWidth={2} />
    ));

    const rentingPoints = data.map((d, i) => (
      <circle key={`renting-${i}`} cx={xScale(d.year)} cy={yScale(d.renting)} r={3} fill="#0ea5e9" stroke="#0ea5e9" strokeWidth={2} />
    ));

    return (
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {gridLines}
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#94a3b8" />
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#94a3b8" />
          {yearLabels}
          <path d={buyingPath} fill="none" stroke="#10b981" strokeWidth="2" />
          <path d={rentingPath} fill="none" stroke="#0ea5e9" strokeWidth="2" />
          {buyingPoints}
          {rentingPoints}
        </svg>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div><span className="text-sm text-gray-800">Buying Net Worth</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div><span className="text-sm text-gray-800">Renting Net Worth</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Quick Stats Banner */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-300 rounded-lg mr-3">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommended Action</p>
                <p className="text-lg font-bold text-gray-800">{results.wealthIfBuying > results.wealthIfRenting ? 'BUY' : 'RENT'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-300 rounded-lg mr-3">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Break-Even Point</p>
                <p className="text-lg font-bold text-gray-800">{results.breakEvenPoint}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-300 rounded-lg mr-3">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(results.projectedEMI)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-300 rounded-lg mr-3">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Property Value</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(results.finalPropertyValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Buying Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                <div className="bg-gray-300 p-2 rounded-lg mr-3"><svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21H3.75a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118.75 21h-6" /></svg></div>
                <h3 className="font-bold text-lg text-black">Buying Details</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Property Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        className="w-36 pl-8 pr-4 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={buyingDetails.propertyPrice.toLocaleString('en-IN')}
                        onChange={(e) => {
                          const value = parseInt(e.target.value.replace(/\D/g, '')) || 1000000;
                          handleInputChange('buying', 'propertyPrice', Math.min(Math.max(value, 1000000), 50000000));
                        }}
                      />
                    </div>
                  </div>
                  <input type="range" min="1000000" max="50000000" step="100000"
                    value={buyingDetails.propertyPrice}
                    onChange={(e) => handleInputChange("buying", "propertyPrice", parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(buyingDetails.propertyPrice, 1000000, 50000000)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Down Payment</label>
                    <div className="relative">
                      <input
                        className="w-36 pl-4 pr-8 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={`${buyingDetails.downPaymentPercent} `}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 40;
                          handleInputChange('buying', 'downPaymentPercent', Math.min(Math.max(value, 10), 50));
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <input type="range" min="10" max="50" step="1"
                    value={buyingDetails.downPaymentPercent}
                    onChange={(e) => handleInputChange("buying", "downPaymentPercent", parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(buyingDetails.downPaymentPercent, 10, 50)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Loan Interest Rate</label>
                    <div className="relative">
                      <input
                        className="w-36 pl-4 pr-8 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={`${buyingDetails.loanInterestRate}`}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 6.9;
                          handleInputChange('buying', 'loanInterestRate', Math.min(Math.max(value, 6), 12));
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <input type="range" min="6" max="12" step="0.1"
                    value={buyingDetails.loanInterestRate}
                    onChange={(e) => handleInputChange("buying", "loanInterestRate", parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(buyingDetails.loanInterestRate, 6, 12)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                    <div className="relative">
                      <input
                        className="w-36 pl-4 pr-10 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={`${buyingDetails.loanTenure}`}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 26;
                          handleInputChange('buying', 'loanTenure', Math.min(Math.max(value, 5), 30));
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">yrs</span>
                    </div>
                  </div>
                  <input type="range" min="5" max="30" step="1"
                    value={buyingDetails.loanTenure}
                    onChange={(e) => handleInputChange("buying", "loanTenure", parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(buyingDetails.loanTenure, 5, 30)}
                  />
                </div>

                <div className="bg-gray-200 p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">Projected Monthly EMI</p>
                    <p className="text-2xl font-bold text-black mt-1">{formatCurrency(results.projectedEMI)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Renting Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                <div className="bg-gray-300 p-2 rounded-lg mr-3"><svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></div>
                <h3 className="font-bold text-lg text-black">Renting Details</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Current Monthly Rent</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        className="w-36 pl-8 pr-4 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={rentingDetails.currentMonthlyRent.toLocaleString('en-IN')}
                        onChange={(e) => {
                          const value = parseInt(e.target.value.replace(/\D/g, '')) || 15000;
                          handleInputChange('renting', 'currentMonthlyRent', Math.min(Math.max(value, 5000), 100000));
                        }}
                      />
                    </div>
                  </div>
                  <input type="range" min="5000" max="100000" step="1000"
                    value={rentingDetails.currentMonthlyRent}
                    onChange={(e) => handleInputChange("renting", "currentMonthlyRent", parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(rentingDetails.currentMonthlyRent, 5000, 100000)}
                  />
                </div>
              </div>
            </div>

            {/* Economic Factors Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                <div className="bg-gray-300 p-2 rounded-lg mr-3"><svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg></div>
                <h3 className="font-bold text-lg text-black">Economic Factors</h3>
              </div>
              <div className="p-5 space-y-5">
                {['propertyAppreciation', 'annualRentIncrease', 'investmentReturnRate', 'maintenanceAndTax', 'inflationRate'].map((field) => {
                  const labels = {
                    propertyAppreciation: 'Property Appreciation', annualRentIncrease: 'Annual Rent Increase',
                    investmentReturnRate: 'Investment Return Rate', maintenanceAndTax: 'Maintenance & Tax', inflationRate: 'Inflation Rate'
                  };
                  const ranges = {
                    propertyAppreciation: { min: 0, max: 15, step: 0.5 }, annualRentIncrease: { min: 0, max: 15, step: 0.5 },
                    investmentReturnRate: { min: 5, max: 20, step: 0.5 }, maintenanceAndTax: { min: 0.5, max: 5, step: 0.1 },
                    inflationRate: { min: 2, max: 10, step: 0.1 }
                  };
                  return (
                    <div key={field} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">{labels[field]}</label>
                        <div className="relative">
                          <input
                            className="w-36 pl-4 pr-8 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                            value={`${economicFactors[field]}`}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              handleInputChange('economic', field, Math.min(Math.max(value, ranges[field].min), ranges[field].max));
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      <input type="range" min={ranges[field].min} max={ranges[field].max} step={ranges[field].step}
                        value={economicFactors[field]}
                        onChange={(e) => handleInputChange("economic", field, parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                        style={getSliderBackground(economicFactors[field], ranges[field].min, ranges[field].max)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Frame Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                <div className="bg-gray-300 p-2 rounded-lg mr-3"><svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <h3 className="font-bold text-lg text-black">Time Frame</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Analysis Period</label>
                    <div className="relative">
                      <input
                        className="w-36 pl-4 pr-10 py-2 text-right bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold"
                        value={`${timeFrame.analysisPeriod}`}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 15;
                          handleInputChange('timeFrame', 'analysisPeriod', Math.min(Math.max(value, 5), 30));
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">yrs</span>
                    </div>
                  </div>
                  <input type="range" min="5" max="30" step="1"
                    value={timeFrame.analysisPeriod}
                    onChange={(e) => handleInputChange("timeFrame", "analysisPeriod", parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    style={getSliderBackground(timeFrame.analysisPeriod, 5, 30, "#9333ea")}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateProjections}
              className="w-full bg-gray-800 text-white hover:bg-gray-700 transition shadow-lg font-bold text-lg py-3 px-4 rounded-lg flex items-center justify-center group"
            >
              <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Calculate Financial Future
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Wealth Comparison Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Wealth Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-300 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21H3.75a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h16.5a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118.75 21h-6" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Wealth if Buying</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(results.wealthIfBuying)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Net Worth</span>
                      <span className="font-semibold text-black">+{formatCurrency(results.wealthIfBuying)}</span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-gray-200">
                      <div className="bg-black h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (results.wealthIfBuying / 5000000) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-300 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Wealth if Renting</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(results.wealthIfRenting)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Net Worth</span>
                      <span className="font-semibold text-black">{formatCurrency(results.wealthIfRenting)}</span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-gray-200">
                      <div className="bg-black h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (Math.abs(results.wealthIfRenting) / 5000000) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className="mt-6 p-4 bg-gray-200 rounded-lg text-black">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="font-bold">Recommendation</p>
                      <p className="text-sm opacity-90">
                        {results.wealthIfBuying > results.wealthIfRenting
                          ? `Buying is ${formatCurrency(results.wealthIfBuying - results.wealthIfRenting)} better than renting`
                          : `Renting is ${formatCurrency(results.wealthIfRenting - results.wealthIfBuying)} better than buying`}
                      </p>
                    </div>
                  </div>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    {results.wealthIfBuying > results.wealthIfRenting ? 'BUY' : 'RENT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Wealth Progression Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Wealth Progression Over Time</h3>
              </div>
              <div className="h-80">
                <WealthProgressionChart data={chartData} years={timeFrame.analysisPeriod} />
              </div>
            </div>

            {/* Upfront Costs Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Upfront Investment Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    {[
                      { label: 'Down Payment', value: upfrontCosts.downPayment, color: 'bg-blue-500' },
                      { label: 'Stamp Duty (~5%)', value: upfrontCosts.stampDuty, color: 'bg-indigo-500' },
                      { label: 'Registration Fees (~1%)', value: upfrontCosts.registrationFees, color: 'bg-purple-500' },
                      { label: 'Brokerage Fees (~1%)', value: upfrontCosts.brokerageFees, color: 'bg-pink-500' },
                      { label: 'Interiors & Furnishing (~10%)', value: upfrontCosts.interiorsFurnishing, color: 'bg-rose-500' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                          <span className="text-sm text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-200 p-6 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Total Upfront Investment</p>
                    <p className="text-3xl font-bold text-gray-800 mb-4">{formatCurrency(upfrontCosts.total)}</p>
                    <div className="w-32 h-32 mx-auto relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${(upfrontCosts.downPayment / upfrontCosts.total) * 283} 283`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray={`${(upfrontCosts.stampDuty / upfrontCosts.total) * 283} 283`} strokeDashoffset={`${-((upfrontCosts.downPayment / upfrontCosts.total) * 283)}`} transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray={`${(upfrontCosts.registrationFees / upfrontCosts.total) * 283} 283`} strokeDashoffset={`${-((upfrontCosts.downPayment + upfrontCosts.stampDuty) / upfrontCosts.total) * 283}`} transform="rotate(-90 50 50)" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-xs text-gray-500">Initial</span>
                          <p className="text-lg font-bold">Capital</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Breakdown */}
            <div className="bg-white mb-6 p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Year-by-Year Financial Projection</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Year</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Buying</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Renting</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Property Value</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Loan Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyBreakdown.map((row, index) => (
                      <tr key={row.year} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                        <td className="py-3 px-4 font-medium text-gray-800">{row.year}</td>
                        <td className="py-3 px-4 font-semibold text-black">{formatCurrency(row.buying)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-600">{formatCurrency(row.renting)}</td>
                        <td className="py-3 px-4 font-medium text-gray-700">{formatCurrency(row.propertyValue)}</td>
                        <td className="py-3 px-4 font-medium text-gray-700">{row.remainingLoan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3">Important Notes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-2 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    This calculator provides projections based on assumptions. Actual results may vary.
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-2 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    All calculations are adjusted for inflation to show real values.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-2 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Consult with a financial advisor before making major decisions.
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-2 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Market conditions and personal circumstances can significantly impact outcomes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
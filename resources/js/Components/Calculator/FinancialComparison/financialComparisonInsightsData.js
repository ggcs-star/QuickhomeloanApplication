export const FINANCIAL_COMPARISON_INSIGHTS = [
  {
    title: "What This Calculator Does",
    icon: "calculator",
    type: "list",
    items: [
      "Calculates Total Cost of Ownership over the full loan tenure, including principal, interest, and rent.",
      "Models exact pre-EMI (interest-only) payments for a UC property based on a detailed disbursement schedule.",
      "Factors in an annual rent increase rate for a true picture of rental outflow while waiting for a UC home.",
      "Computes total interest paid for both scenarios, revealing the long-term financial impact.",
      "Presents property price, down payment, loan amount, rent, and interest side-by-side.",
    ],
  },
  {
    title: "When to Use This Calculator",
    icon: "clock",
    type: "grid",
    items: [
      "Relocating to a new city (Renting UC vs Buying RTM)",
      "Comparing lower UC base price vs RTM certainty",
      "Evaluating builder's construction-linked payment plans",
      "Checking affordability of Rent + Pre-EMI burden",
      "Weighing potential appreciation (UC) vs rental income (RTM)",
      "Quantifying the financial risk of builder delays",
      "Understanding tax benefit timing differences",
    ],
  },
  {
    title: "How to Use – Step by Step",
    icon: "steps",
    type: "steps",
    items: [
      ["Fill in Common Inputs", "Enter your desired Loan Tenure, Annual Interest Rate, and Down Payment percentage."],
      ["Enter Property Specifics", "Input the prices for RTM and UC properties, UC construction timeline, and your expected rent details."],
      ["Define Disbursement Plan", "Specify the month and the percentage of the total loan disbursed at each stage for the UC property."],
      ["Adjust Phases", "Use the Add Phase button for complex plans or the × button to remove phases. Ensure total equals 100%."],
      ["Calculate & Compare", "Click Calculate to generate a detailed financial breakdown and final verdict."],
    ],
  },
  {
    title: "Technical Breakdown: Cost Logic",
    icon: "chart",
    type: "formula-multi",
    formulas: [
      "RTM Total Cost = Property Price + Total Interest",
      "Total Interest = (EMI × Loan Tenure in Months) − Loan Amount",
      "UC Total Cost = Property Price + Rent Paid + Pre-EMI Interest + Post-Construction Interest"
    ]
  },
  {
    title: "Core Mechanics Used",
    icon: "growth",
    type: "list",
    items: [
      "Phased Disbursement (Pre-EMI): Iterates month-by-month through construction. As disbursement increases, monthly interest is calculated on the new higher balance.",
      "Rent Escalation: Tracks years elapsed during construction. At the start of each new year, rent increases by the Annual Rent Increase Rate.",
      "Full EMI Calculation: Uses standard amortization formula once possession is handed over.",
    ],
  },
];
export const LOAN_INSIGHTS = [
  {
    title: "What This Calculator Does",
    icon: "calculator",
    type: "list",
    items: [
      "Estimates the maximum loan amount based on your financial profile.",
      "Uses FOIR (Fixed Obligation to Income Ratio) method.",
      "Helps determine a safe borrowing limit.",
      "Checks eligibility for home, car, and personal loans.",
      "Allows scenario testing with tenure and interest changes.",
      "Enables pre-check before applying for a loan.",
    ],
  },
  {
    title: "When to Use This Calculator",
    icon: "clock",
    type: "grid",
    items: [
      "Before searching for a home",
      "Planning to buy a car",
      "Before taking a personal loan",
      "Comparing different bank offers",
      "Checking eligibility based on salary",
      "If you already have existing EMIs",
      "Choosing the right loan tenure",
    ],
  },
  {
    title: "How to Use – Step by Step",
    icon: "steps",
    type: "steps",
    items: [
      ["Enter Monthly Income", "Add your net take-home salary."],
      ["Enter Existing EMIs", "Include all current monthly obligations."],
      ["Adjust Interest & Tenure", "Match loan offer details."],
      ["Select Loan Type", "Choose home, car, or personal loan."],
      ["Click Check Eligibility", "Get instant loan eligibility."],
      ["View Results", "See maximum loan you can get."],
    ],
  },
  {
    title: "How This Calculator Works",
    icon: "chart",
    type: "formula-multi", // 🔥 custom type for multiple formulas
    formulas: [
      "Eligible EMI = (Income × FOIR) − Existing EMIs",
      "Loan Amount = EMI × [ (1+r)^n − 1 ] / [ r × (1+r)^n ]",
    ],
  },
  {
    title: "Practical Applications",
    icon: "growth",
    type: "bulb",
    items: [
      "Plan property or car budget",
      "Compare lender offers",
      "Optimize tenure vs EMI",
      "Improve FOIR before applying",
      "Negotiate better loan terms",
    ],
  },
];
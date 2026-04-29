export const INTEREST_INSIGHTS = [
  {
    title: "What This Calculator Does",
    icon: "calculator",
    type: "list",
    items: [
      "Identify your effective interest rate.",
      "Verify if your bank is charging the correct interest.",
      "Check if refinancing makes financial sense.",
      "Compare bank offers with your current loan.",
      "Validate processing by DSA/agents.",
      "Check interest rate for old loans (where you forgot).",
    ],
  },
  {
    title: "When to Use This Calculator",
    icon: "clock",
    type: "grid",
    items: [
      "Identify your effective interest rate",
      "Verify bank interest charges",
      "Check refinancing opportunities",
      "Compare loan offers",
      "Validate agent calculations",
      "Analyze old loans",
    ],
  },
  {
    title: "How to Use – Step by Step",
    icon: "steps",
    type: "steps",
    items: [
      ["Enter Your EMI", "The fixed monthly payment (e.g., ₹30,000)."],
      ["Enter Loan Amount", "Total borrowed principal (e.g., ₹35,00,000)."],
      ["Enter Tenure", "Loan duration (e.g., 20 years / 240 months)."],
      ["Click Calculate", "Let the system compute the interest rate."],
      ["View Result", "See monthly & annual interest rates + total interest."],
    ],
  },
  {
    title: "How This Calculator Works",
    icon: "chart",
    type: "formula",
    formula: "EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)",
    meta: [
      "Uses iterative bisection method",
      "Finds exact interest rate from EMI",
      "Includes EMI, Loan Amount, Tenure",
      "Excludes fees & extra charges",
    ],
  },
  {
    title: "Practical Applications",
    icon: "growth",
    type: "bulb",
    items: [
      "Verify loan offers before switching",
      "Negotiate better interest rates",
      "Detect overcharging by lenders",
      "Analyze zero-cost EMI schemes",
    ],
  },
];
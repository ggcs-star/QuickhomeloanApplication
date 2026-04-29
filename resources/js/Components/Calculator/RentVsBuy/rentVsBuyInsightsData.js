export const RENT_VS_BUY_INSIGHTS = [
  {
    title: "How to Use – Step by Step",
    icon: "steps",
    type: "steps",
    items: [
      ["Enter Buying Details", "Input the property price, down payment, loan interest rate, and loan tenure. The calculator will automatically compute your monthly EMI."],
      ["Enter Renting Details", "Provide the current monthly rent for a comparable property you would choose if you decided to rent instead of buying."],
      ["Set Economic Assumptions", "Define expected growth rates for property value, rent increase, and investment returns. Also include maintenance costs and inflation."],
      ["Choose Comparison Period", "Select the long-term duration for comparison based on how many years you plan to stay in the property."],
      ["Analyze the Results", "Review the net worth difference between renting and buying to see which option is financially better over the selected time horizon."],
    ],
  },
  {
    title: "How This Calculator Thinks: Basics",
    icon: "calculator",
    type: "list",
    items: [
      "Monthly EMI: Your monthly home loan installment calculated using loan amount, interest rate, tenure, bank rates, and your credit score.",
      "What EMI Really Means: A 10–30 year commitment that builds long-term equity. The EMI is fixed, and becomes easier to manage every year due to inflation.",
      "Monthly Rent: Your current or expected rent for a comparable property, including base rent, maintenance, amenities, and parking.",
      "Reality Check on Rent: Rent feels cheaper today, but it increases every year due to market demand and inflation.",
    ],
  },
  {
    title: "Economic Factors & Analysis Period",
    icon: "clock",
    type: "list",
    items: [
      "Inflation Rate (Default 6%): Affects the real value of EMI, rent, purchasing power, and property appreciation. Favors buyers because EMI stays constant while rent rises.",
      "Annual Rent Increase (Default 7%): Typical ranges are Metros (7–10%), Tier-2 cities (5–7%), Suburbs (3–5%). Even a 1–2% change can completely alter long-term results.",
      "Short stay (< 5 years): Renting almost always wins.",
      "Long stay (10+ years): Buying often wins by building long-term equity.",
    ],
  },
  {
    title: "Financial Models Used",
    icon: "chart",
    type: "list",
    items: [
      "Rent Projection Model: Calculates year-by-year rent, total rent paid, inflation-adjusted rent, lost wealth due to rent, and opportunity cost if savings were invested instead.",
      "Buying Projection Model: Simulates EMI amortization, principal vs interest, property appreciation, maintenance (1–2% yearly), taxes, insurance, registration costs, and future resale value.",
      "Opportunity Cost Model: Models alternative investments (FDs, mutual funds, equity) if you choose not to buy — often a decisive factor in the final verdict.",
    ],
  },
  {
    title: "Costs Most First-Time Buyers Ignore",
    icon: "growth",
    type: "grid",
    items: [
      "Down payment (20–30%) — biggest hidden cost",
      "Stamp duty (5–7%) — varies by state",
      "Registration charges (≈1%)",
      "Home loan processing fees",
      "Society maintenance (₹2,000–₹10,000/month)",
      "Painting & repairs (every 3–5 years)",
      "Home insurance (often mandatory)",
      "Property tax (yearly)",
      "Brokerage (future buy/sell/rent)",
      "Furniture & interiors (10–20% of home value)",
    ],
  },
];
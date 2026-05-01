export const YearlyInterest_INSIGHTS = [

  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "The 13th EMI",
        description: "Pay just one extra EMI per year to reduce a 20-year tenure by over 4 years instantly.",
        buttonText: "Calculate Gain"
      },
      {
        id: 2,
        title: "Benchmark Audit",
        description: "Verify if your bank is using the correct Repo benchmark for interest calculations this year.",
        buttonText: "Start Audit"
      },
      {
        id: 3,
        title: "Tenure Rebalancing",
        description: "If rates fell, request a tenure reduction instead of an EMI reduction to save more interest.",
        buttonText: "Request Fix"
      },
      {
        id: 4,
        title: "Step-Up Prepayment",
        description: "Increase your EMI by 5% every year to follow your income growth and crush debt faster.",
        buttonText: "Setup Plan"
      },
      {
        id: 5,
        title: "Balance Transfer",
        description: "If your gap is > 0.5% compared to the market, initiate a transfer to save up to ₹5 Lakhs over the lifecycle.",
        buttonText: "Check Offers"
      }
    ]
  },
    {
    type: "audit-card",
    badge: "Audit Verified",
    title: "Interest Analysis Complete",
    description: "Review your interest breakdown. In early years, up to 80% of your EMI goes toward interest. Small prepayments now have the highest impact."
  },
  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "Info",
        title: "Interest-First Amortization",
        descriptionPro: () => "In early years, up to 80% of your EMI goes toward interest. Small prepayments now have the highest impact on reducing your lifetime debt.",
        descriptionFree: "Upgrade to Pro to understand how interest-first amortization affects your loan."
      },
      {
        id: 2,
        icon: "Lightbulb",
        title: "The '1 Extra EMI' Rule",
        descriptionPro: () => "Making just one extra EMI payment every year can reduce a standard 20-year loan tenure by approximately 40-48 months.",
        descriptionFree: "Upgrade to Pro to discover the power of the '1 Extra EMI' strategy."
      },
      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "Compounding in Reverse",
        descriptionPro: () => "Prepayment is like investing at your loan's interest rate, risk-free and tax-free. It's the most stable financial move for homeowners.",
        descriptionFree: "Upgrade to Pro to learn how prepayment works like reverse compounding."
      }
    ]
  }
];
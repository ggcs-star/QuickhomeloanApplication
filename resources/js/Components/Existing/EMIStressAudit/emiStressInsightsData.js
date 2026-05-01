export const EMIStress_INSIGHTS = [
  
  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "Consolidate Unsecured Loans",
        description: "If your FOIR > 50%, consider moving high-interest personal loans into a Home Loan Top-up for significantly lower costs.",
        buttonText: "View Savings"
      },
      {
        id: 2,
        title: "Principal Sprint",
        description: "Apply any yearly bonus directly to your principal amount now. Reducing principal lowers long-term stress.",
        buttonText: "Prepay Audit"
      },
      {
        id: 3,
        title: "Expenses Optimization",
        description: "Audit non-EMI living expenses to identify monthly surplus for defensive loan prepayments.",
        buttonText: "Audit Living"
      },
      {
        id: 4,
        title: "Switch to EBLR",
        description: "Stop interest leakage from outdated benchmarks (like MCLR) to free up monthly liquidity.",
        buttonText: "Switch Now"
      },
      {
        id: 5,
        title: "Emergency Buffer",
        description: "Set aside 3-6 EMIs in a liquid fund to prevent payment bounces during unexpected rate spikes or emergencies.",
     
      }
    ]
  },
  {
    type: "audit-card",
    badge: "Financial Health Status",
    title: "FOIR Audit Complete",
    description: "Check your Fixed Obligation to Income Ratio (FOIR). High FOIR puts you in the risk zone. Consider the actions below to optimize your financial liquidity."
  },
  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "TrendingDown",
        title: "The 40% Compliance Rule",
        descriptionPro: (data) => "Standard banking compliance suggests total EMIs should not exceed 40% of net monthly income. Keep it below 40% to maintain a healthy credit profile.",
        descriptionFree: "Upgrade to Pro to see if your FOIR meets the 40% banking compliance rule."
      },
      {
        id: 2,
        icon: "ShieldAlert",
        title: "Liquidity Buffers",
        descriptionPro: (data) => "A healthy surplus ratio (15-20%) is crucial. High EMI levels reduce your ability to absorb sudden Repo Rate hikes or financial shocks.",
        descriptionFree: "Upgrade to Pro to analyze your liquidity buffers and monthly surplus ratio."
      },
      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "Debt Consolidation",
        descriptionPro: (data) => "If your stress index is in the warning or risk zone, consider debt consolidation. Focus on clearing high-interest unsecured loans first.",
        descriptionFree: "Upgrade to Pro for personalized debt consolidation recommendations."
      }
    ]
  }
];
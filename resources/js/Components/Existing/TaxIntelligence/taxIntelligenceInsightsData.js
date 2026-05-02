export const TaxIntelligence_INSIGHTS = [

  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "Provisional Cert",
        description: "Download your bank's latest provisional interest certificate to lock in Sec 24(b) claims.",
        buttonText: "Download Cert"
      },
      {
        id: 2,
        title: "Insurance Surrender",
        description: "Surrender unexpired mortgage insurance for a pro-rata refund upon partial prepayment.",
        buttonText: "Claim Refund"
      },
      {
        id: 3,
        title: "80C Optimization",
        description: "Verify if your principal repayment is reaching the ₹1.5L cap. Adjust ELSS investments accordingly.",
        buttonText: "Check 80C"
      },
      {
        id: 4,
        title: "Co-Borrower Split",
        description: "Split interest benefits between spouse/parents to double the Sec 24(b) deduction to ₹4 Lakhs.",
        buttonText: "View Strategy"
      },
      {
        id: 5,
        title: "Pre-EMI Interest",
        description: "Claim construction-phase interest in 5 equal installments post-possession as per IT Act.",
        buttonText: "Start Claim"
      }
    ]
  },
    {
    type: "audit-card",
    badge: "Tax Audit Done",
    title: "Optimization Status",
    description: "Review your tax deductions. If you are not hitting the ₹2 Lakhs limit on Section 24(b), check if you can claim Pre-EMI interest or consider co-borrower splitting."
  },
  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "Info",
        title: "Section 24(b) Benefits",
        descriptionPro: () => "Deduct up to ₹2 Lakhs per annum for self-occupied property. For let-out properties, there is no upper limit, but set-off against other income heads is capped at ₹2 Lakhs.",
        descriptionFree: "Upgrade to Pro to understand Section 24(b) benefits and maximize your tax savings."
      },
      {
        id: 2,
        icon: "Lightbulb",
        title: "Section 80C Optimization",
        descriptionPro: () => "Deduct up to ₹1.5 Lakhs on principal repayment. This limit is shared with PPF and ELSS. Property must not be sold within 5 years of possession to keep this benefit.",
        descriptionFree: "Upgrade to Pro to optimize your Section 80C deductions and maximize tax benefits."
      },
      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "Pre-EMI Interest",
        descriptionPro: () => "Claim construction-phase interest in 5 equal installments post-possession as per IT Act. Ensure you obtain the property possession certificate before claiming.",
        descriptionFree: "Upgrade to Pro to understand how to claim pre-EMI interest benefits."
      }
    ]
  }
];
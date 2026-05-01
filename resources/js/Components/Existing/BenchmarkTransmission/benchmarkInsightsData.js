export const BenchmarkTransmission_INSIGHTS = [
 
  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "Request Rate Reset",
        description: "If your current ROI is higher than the market prime for your CIBIL score, submit a formal request to move to the bank's latest spread.",
        buttonText: "Draft Request"
      },
      {
        id: 2,
        title: "MCLR to EBLR Switch",
        description: "Stop opaque reset cycles. Move to EBLR (External Benchmark Linked Rate) for immediate pass-through of RBI Repo cuts within 90 days.",
        buttonText: "Switch Benchmark"
      },
      {
        id: 3,
        title: "Challenge Spread Creep",
        description: "Banks often keep spreads high for old customers. Use your 'Excellent' CIBIL status to negotiate a spread reduction.",
        buttonText: "View Strategy"
      },
      {
        id: 4,
        title: "Audit Reset Frequency",
        description: "Verify if the bank has reset your ROI at least 4 times in the last 12 months (quarterly reset). If not, it's a direct transmission violation.",
        buttonText: "Verify Reset Log"
      },
      {
        id: 5,
        title: "Ombudsman Escalation",
        description: "If the bank refuses a rate reset despite a 0.5% gap from their current prime rates, file a grievance via the Banking Ombudsman.",
        buttonText: "Escalate Case"
      }
    ]
  },
   {
    type: "audit-card",
    badge: "Transmission Status",
    title: "High Priority Audit",
    description: "Perform the recommended actions to recover your interest leakage immediately and optimize your loan terms."
  },
  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "Landmark",
        title: "What is Spread Creep?",
        descriptionPro: () => "Banks often increase the 'Spread' on existing loans when interest rates fall, preventing the benefit from reaching you. Keep a constant eye on market benchmarks.",
        descriptionFree: "Upgrade to Pro to understand spread creep and how it affects your loan."
      },
      {
        id: 2,
        icon: "ShieldAlert",
        title: "The EBLR Mandate",
        descriptionPro: () => "Per RBI guidelines, banks must reset the EBLR at least once in three months. Ensure your bank is complying with these transmission norms.",
        descriptionFree: "Upgrade to Pro to check if your bank is complying with EBLR mandates."
      },
      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "How to Fix a Gap?",
        descriptionPro: () => "If your gap is significant (>0.50%), ask for a rate reset or conversion. Most banks charge a nominal fee (0.25% or ₹5,000) to move you to current rates.",
        descriptionFree: "Upgrade to Pro for personalized strategies to fix your rate gap."
      }
    ]
  }
];
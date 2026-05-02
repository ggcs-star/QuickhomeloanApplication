export const RepaymentHealth_INSIGHTS = [

  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "Buffer Fund Setup",
        description: "Maintain 3 months of EMI in a 'Sweep-in' Fixed Deposit linked to your repayment account.",
        buttonText: "Setup Buffer"
      },
      {
        id: 2,
        title: "ROI Normalization",
        description: "Identify months where interest increased without notice. Request bank for pass-through audit.",
        buttonText: "Audit ROI"
      },
      {
        id: 3,
        title: "Digital SI Check",
        description: "Verify your E-Mandate/Standing Instruction status to ensure zero technical bounces.",
        buttonText: "Verify SI"
      },
      {
        id: 4,
        title: "Nodal Escalation",
        description: "If a technical bounce (bank error) affected your score, draft a notice to the Nodal Officer.",
        buttonText: "Draft Notice"
      },
      {
        id: 5,
        title: "Tenure Audit",
        description: "Manually verify pending installments against sanctioned term to detect 'Silent Tenure Ballooning'.",
        buttonText: "Check Tenure"
      }
    ]
  },
  {
    type: "audit-card",
    badge: "Repayment Audit Done",
    title: "Credit Health Intelligence",
    description: "Lenders prioritize 'Continuous Repayment History' (CRH). Even a single bounce, if not regularized within 30 days, can reduce your eligibility for Top-up loans or Balance Transfers by over 60%."
  },
  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "Landmark",
        title: "Why EMI Changes?",
        descriptionPro: (data) => "EMIs can increase due to interest rate hikes, tenure adjustments, or bank fees. Monitor your statement carefully if amounts fluctuate.",
        descriptionFree: "Upgrade to Pro to see EMI change analysis and reasons."
      },
      {
        id: 2,
        icon: "ShieldAlert",
        title: "Bounce Impact",
        descriptionPro: (data) => "A single bounce can reduce your credit score by 100+ points and affect loan eligibility for up to 12 months. Address failures immediately.",
        descriptionFree: "Upgrade to Pro to understand bounce impact on your credit health."
      },
      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "How to Improve Score?",
        descriptionPro: (data) => "Focus on on-time payments for 3-6 months. Setup payment reminders and maintain buffer funds to stabilize your CRH (Continuous Repayment History).",
        descriptionFree: "Upgrade to Pro for personalized score improvement strategies."
      }
    ]
  }
];
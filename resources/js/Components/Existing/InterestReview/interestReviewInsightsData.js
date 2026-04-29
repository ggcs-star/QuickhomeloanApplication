export const InterestReview_INSIGHTS = [


  {
    type: "actions",
    title: "Actions to Perform",
    items: [
      {
        id: 1,
        title: "Buffer Fund Setup",
        description:
          "Maintain 3 months of EMI in a 'Sweep-in' Fixed Deposit linked to your repayment account.",
      
      },
      {
        id: 2,
        title: "ROI Normalization",
        description:
          "Identify months where interest increased without notice. Request bank for pass-through audit.",
        
      },
      {
        id: 3,
        title: "Digital SI Check",
        description:
          "Verify your E-Mandate/Standing Instruction status to ensure zero technical bounces.",
        
      },
      {
        id: 4,
        title: "Nodal Escalation",
        description:
          "If a technical bounce affected your score, draft a notice to the Nodal Officer.",
       
      },
      {
        id: 5,
        title: "Tenure Audit",
        description:
          "Verify pending installments to detect silent tenure increase.",
  
      },
    ],
  },

  {
    type: "audit-card",
    badge: "Medium Priority Audit",
    title: "Interest Analysis Complete",
    description:
      "Consider optimization strategies to reduce interest burden.",
  },

  {
    type: "insight-cards",
    items: [
      {
        id: 1,
        icon: "Landmark",
        title: "Why EMI Changes?",
        dynamic: "emiChanges",

        descriptionPro: (data = {}) => {
          const emis = Array.isArray(data?.monthlyEMIs)
            ? data.monthlyEMIs
            : [];

          const changes = emis.filter(e => e?.emiChanged).length;

          return `EMIs can increase due to interest rate hikes, tenure adjustments, or bank fees.
      Your EMI changed ${changes} times in the last year.`;
        },

        descriptionFree:
          "Upgrade to Pro to see EMI change analysis and reasons.",
      },

      {
        id: 2,
        icon: "ShieldAlert",
        title: "Bounce Impact",
        dynamic: "bounceImpact",

        descriptionPro: (data = {}) => {
          const bounces = Number(data?.bounceEvents || 0);

          return `A single bounce can reduce your credit score by 100+ points and affect loan eligibility for up to 12 months.
          ${bounces > 0
              ? `You have ${bounces} bounce(s) to address.`
              : "No bounces detected."
            }`;
        },

        descriptionFree:
          "Upgrade to Pro to understand bounce impact on your credit health.",
      },

      {
        id: 3,
        icon: "CircleQuestionMark",
        title: "How to Improve Score?",
        dynamic: "scoreImprove",

        descriptionPro: (data = {}) => {
          const score = Number(data?.healthScore || 0);

          return score < 70
            ? "Focus on on-time payments for 3–6 months. Setup payment reminders and maintain buffer funds."
            : "Continue your good repayment habits. Consider additional measures for premium status.";
        },

        descriptionFree:
          "Upgrade to Pro for personalized score improvement strategies.",
      },
    ],
  },
];
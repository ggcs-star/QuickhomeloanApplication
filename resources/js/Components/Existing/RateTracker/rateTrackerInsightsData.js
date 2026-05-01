export const RateTracker_INSIGHTS = [
  
    {
        type: "actions",
        title: "Actions to Perform",
        items: [
            {
                id: 1,
                title: "Verify Reset Window",
                description: "Check if your bank applied the latest Repo Rate cut to your loan account within the mandated 90-day window.",

            },
            {
                id: 2,
                title: "Monitor Spread Stickiness",
                description: "Ensure your bank isn't secretly increasing the spread margin while the benchmark rate remains constant.",

            },
            {
                id: 3,
                title: "Tenure Ballooning Check",
                description: "Whenever a rate increases, banks often extend tenure instead of increasing EMI. Verify your pending installments.",

            }
        ]
    },
      {
        type: "audit-card",
        badge: "Transparency Audit",
        title: "Regulatory Compliance",
        description: "Banks must notify you of rate changes and their impact on EMI/Tenure. Any delayed pass-through of rate cuts is a Regulatory Violation."
    },
    {
        type: "insight-cards",
        items: [
            {
                id: 1,
                icon: "ShieldAlert",
                title: "Reset Response Time",
                descriptionPro: (data) => "Your bank's reset response is currently COMPLIANT (within 90 days). Keep monitoring next quarter.",
                descriptionFree: "Upgrade to Pro to verify if your bank is legally compliant with reset timelines."
            },
            {
                id: 2,
                icon: "Activity",
                title: "Spread Volatility",
                descriptionPro: (data) => "Your spread volatility is MODERATE. Consider negotiating a lower fixed spread if it crosses 2.50%.",
                descriptionFree: "Upgrade to Pro to analyze your bank's spread volatility and hidden charges."
            }
        ]
    }
];
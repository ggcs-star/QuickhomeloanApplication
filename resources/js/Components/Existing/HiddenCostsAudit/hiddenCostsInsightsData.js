export const HiddenCosts_INSIGHTS = [

    {
        type: "actions",
        title: "Actions to Perform",
        items: [
            {
                id: 1,
                title: "Negotiate Waivers",
                description: "Request the bank manager to waive technical bounce charges. Success rate is usually high for technical issues.",

            },
            {
                id: 2,
                title: "GST Reclamation",
                description: "Ensure you are not being charged GST twice on late fees. Audit your tax statements to recover potential leakages.",

            },
            {
                id: 3,
                title: "Sweep-In Facility",
                description: "Link a Fixed Deposit to your EMI account to prevent bounces automatically when funds are low.",

            },
            {
                id: 4,
                title: "Standardize Penal Rate",
                description: "Check your current penal rate. If it is higher than 2%, request a reset to standard RBI penal rates.",

            },
            {
                id: 5,
                title: "Discipline Buffer",
                description: "Setup an auto-reminder 48 hours before the EMI date to prevent any future bounces or technical delays.",

            }
        ]
    },
    {
        type: "audit-card",
        badge: "Recovery Status",
        title: "High Priority Audit",
        description: "Immediate action required to recover significant penalty charges. Perform these actions to optimize your penalty recovery."
    },
    {
        type: "insight-cards",
        items: [
            {
                id: 1,
                icon: "Wallet",
                title: "What are Hidden Costs?",
                descriptionPro: (data) => "Hidden costs include bounce charges, penal interest, and GST on penalties that banks levy for payment delays. Monitor your account regularly.",
                descriptionFree: "Upgrade to Pro to uncover hidden costs and penalties in your loan statements."
            },
            {
                id: 2,
                icon: "ShieldAlert",
                title: "Recovery Rights",
                descriptionPro: (data) => "Banks often waive charges for technical bounces. If your bounces were due to technical reasons, you have strong grounds for negotiation.",
                descriptionFree: "Upgrade to Pro to understand your recovery rights and maximize penalty refunds."
            },
            {
                id: 3,
                icon: "CircleQuestionMark",
                title: "How to Recover Costs?",
                descriptionPro: (data) => "You can recover up to 40% of total penalties through negotiation and GST reclamation if acted upon quickly.",
                descriptionFree: "Upgrade to Pro for personalized cost recovery strategies."
            }
        ]
    }
];
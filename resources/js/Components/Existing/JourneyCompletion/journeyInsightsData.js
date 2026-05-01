export const JourneyCompletion_INSIGHTS = [
    {
        type: "actions",
        title: "Actions to Perform",
        items: [
            {
                id: 1,
                title: "Recalculate Principal Share",
                description: "Ensure your bank isn't silently extending tenure while Repo Rates are falling. Request a principal-only update.",

            },
            {
                id: 2,
                title: "Benchmark Transition",
                description: "If your sanctioned tenure is still linked to MCLR, switch to EBLR for immediate transparency in reset cycles.",

            },
            {
                id: 3,
                title: "Partial Prepayment Audit",
                description: "A 5% principal prepayment at this stage can significantly reduce your journey. Perform a milestone payment.",

            },
            {
                id: 4,
                title: "No-Objection Strategy",
                description: "Verify your documentation status. Ensure all original deeds are tracked as per your sanctioned timeline.",

            }
        ]
    },
    {
        type: "audit-card",
        badge: "Audit Verified",
        title: "Lifecycle Review Done",
        description: "Complete these tasks to ensure your journey is optimized for zero-debt. Watch out for silent tenure extensions."
    },
    {
        type: "insight-cards",
        items: [
            {
                id: 1,
                icon: "CircleQuestionMark",
                title: "The Golden Ratio",
                descriptionPro: () => "Crossing the 60-month (5-year) mark is critical. Most Indian home loans see a significant drop in the outstanding principal acceleration after this point.",
                descriptionFree: "Upgrade to Pro to track your golden ratio milestone and optimize your loan journey."
            },
            {
                id: 2,
                icon: "Landmark",
                title: "Refinance Window",
                descriptionPro: () => "The best time to switch your loan is between the 3rd and 7th year, when the principal is still high enough to save significant interest.",
                descriptionFree: "Upgrade to Pro to identify your optimal refinance window and maximize savings."
            },
            {
                id: 3,
                icon: "ShieldAlert",
                title: "Tenure Verification",
                descriptionPro: () => "Always verify 'Pending Installments' manually. Banks often increase tenure silently to keep EMIs constant when Repo Rates rise.",
                descriptionFree: "Upgrade to Pro to detect silent tenure extensions and protect your loan terms."
            }
        ]
    }
];
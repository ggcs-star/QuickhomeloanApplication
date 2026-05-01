export const PrepaymentForeclosure_INSIGHTS = [

    {
        type: "actions",
        title: "Actions to Perform",
        items: [
            {
                id: 1,
                title: "Verify Penalty Exemption",
                description: "Individual floating-rate loans have 0% foreclosure fees. Verify your sanction letter's penalty clause.",
                buttonText: "Audit Clause"
            },
            {
                id: 2,
                title: "Request No-Dues Cert",
                description: "Obtain a formal acknowledgement of full principal recovery within 15 days of foreclosure.",
                buttonText: "Draft Request"
            },
            {
                id: 3,
                title: "Title Deed Audit",
                description: "Request the bank to specify the location of original deeds to ensure 30-day return compliance.",
                buttonText: "Locate Deeds"
            },
            {
                id: 4,
                title: "Penal Interest Refund",
                description: "If you were overcharged penal interest during the closure period, request a reversal.",
                buttonText: "Claim Refund"
            },
            {
                id: 5,
                title: "Insurance Surrender",
                description: "Apply for a pro-rata refund of your mortgage insurance premium if closing before term.",
                buttonText: "Surrender Now"
            }
        ]
    },
    {
        type: "audit-card",
        badge: "Closure Audit Ready",
        title: "Savings Opportunity",
        description: "Significant savings are possible. Execute the recommended steps for penalty-free closure and ensure you receive your original property deeds on time."
    },

    {
        type: "insight-cards",
        items: [
            {
                id: 1,
                icon: "Info",
                title: "Zero Penalty Rights",
                descriptionPro: () => "As per RBI guidelines, lenders cannot charge foreclosure penalties on individual floating-rate loans, even for business purposes.",
                descriptionFree: "Upgrade to Pro to understand your zero penalty rights and foreclosure protections."
            },
            {
                id: 2,
                icon: "Lightbulb",
                title: "Document Recovery",
                descriptionPro: () => "Banks must return property documents within 30 days of loan closure. Delays entitle you to compensation of ₹5,000 per day of delay.",
                descriptionFree: "Upgrade to Pro to learn about document recovery timelines and your compensation rights."
            },
            {
                id: 3,
                icon: "CircleQuestionMark",
                title: "Insurance Refunds",
                descriptionPro: () => "You're entitled to pro-rata refunds on mortgage insurance premiums when closing your loan before the term ends.",
                descriptionFree: "Upgrade to Pro to understand your insurance refund entitlements."
            }
        ]
    }
];
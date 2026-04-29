export const INTEREST_GUIDE = {
  title: "Interest Rate Calculator FAQs",

  faqs: [
    {
      question: "What does this Interest Rate Calculator do?",
      answer:
        "It calculates the effective annual interest rate of your loan using your EMI, loan amount, and tenure. This helps you uncover the real rate you are paying.",
    },
    {
      question: "How accurate is it?",
      answer:
        "The calculator is highly accurate and uses an iterative bisection method similar to banking systems. Minor rounding differences may occur.",
    },
    {
      question: "Why can't the interest rate be calculated directly?",
      answer:
        "Because the EMI formula cannot be algebraically reversed for the interest rate. The calculator uses numerical approximation to solve it.",
    },
    {
      question: "Can I use this for home, car, and personal loans?",
      answer:
        "Yes. It works for all EMI-based loans including home, car, personal, and education loans.",
    },
    {
      question: "What if my EMI includes insurance or other fees?",
      answer:
        "If EMI includes insurance or add-ons, the calculated interest rate may appear higher since those costs are not part of the principal.",
    },
    {
      question: "Does the processing fee change the interest rate?",
      answer:
        "Processing fees do not change the EMI rate mathematically, but they increase the effective cost of borrowing.",
    },
    {
      question: "Why is my calculated interest rate very high?",
      answer:
        "High rates are common for unsecured loans or short tenures. It may also indicate bundled fees or dealer markups.",
    },
    {
      question: "What about floating interest rate loans?",
      answer:
        "For floating-rate loans, the calculator shows the effective rate based on your current EMI and outstanding tenure.",
    },
    {
      question: "Can I calculate the interest rate on an old loan?",
      answer:
        "Yes. As long as you know the EMI, original loan amount, and tenure, this calculator will work.",
    },
    {
      question: "Will this calculator save my personal data?",
      answer:
        "No. All calculations happen locally in your browser. No data is stored or transmitted.",
    },
    {
      question: "Can I calculate the rate if my EMI changes?",
      answer:
        "Yes. Enter the revised EMI to instantly see the updated effective interest rate.",
    },
  ],

  tips: [
    "Higher EMI at the same loan amount usually means a higher interest rate. Even small EMI increases can significantly impact total cost.",
    "If your calculated interest rate is high, consider switching lenders or using a balance transfer to reduce costs.",
    "Review your loan interest rate every 6–12 months—market rates may drop, and refinancing can save money.",
  ],
};
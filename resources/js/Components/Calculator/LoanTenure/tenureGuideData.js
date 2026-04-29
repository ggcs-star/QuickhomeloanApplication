export const TENURE_GUIDE = {
  title: "Loan Tenure Calculator FAQs",
  faqs: [
    {
      question: "What is a Loan Tenure Calculator?",
      answer: "It calculates the time required to repay a loan using your monthly installment (EMI), interest rate, and the principal loan amount.",
    },
    {
      question: "How accurate is this?",
      answer: "Highly accurate because it uses the mathematical reverse of the standard EMI formula to solve for the loan's duration.",
    },
    {
      question: "Can tenure be fractional?",
      answer: "Yes—your loan may end in a period that isn't a full month. In practice, banks usually adjust the final EMI to close the loan.",
    },
    {
      question: "Why does my tenure seem long?",
      answer: "This is usually because the EMI amount is too low relative to the loan amount and interest rate. If the payment barely covers the monthly interest, the principal reduces very slowly.",
    },
    {
      question: "Does increasing EMI reduce tenure?",
      answer: "Yes, a higher EMI means you pay off the principal faster, which shortens the repayment time and reduces the total interest paid.",
    },
    {
      question: "Does reducing EMI increase tenure?",
      answer: "Yes, reducing your EMI will increase the loan tenure, often drastically, and will also increase the total amount of interest you pay over the life of the loan.",
    },
    {
      question: "Can a floating interest rate affect tenure?",
      answer: "Yes. If a floating rate increases, your loan tenure will increase unless you also increase your EMI amount to compensate.",
    },
    {
      question: "Does prepayment reduce tenure?",
      answer: "Yes, making a bulk prepayment directly reduces the principal amount, which immediately shortens the remaining tenure.",
    },
    {
      question: "Does the loan amount include processing fees?",
      answer: "No, this calculation uses the principal loan amount only. Fees and other charges are not included.",
    },
    {
      question: "Is my personal data saved?",
      answer: "No. All calculations are performed in your browser. No data is sent to or stored on any server.",
    },
    {
      question: "Can I calculate the tenure for an already running loan?",
      answer: "Yes. Use your outstanding loan balance as the loan amount along with your current EMI and interest rate to find the remaining tenure.",
    },
  ],
  tips: [
    "Choose an EMI that reduces tenure without hurting your budget.",
    "Increasing EMI by even a small amount can reduce tenure by months or years.",
    "Prepay small amounts yearly to cut years from your loan.",
    "Keep monitoring your floating rate — a higher rate means a longer tenure.",
    "A balance transfer to a lower interest rate can drop tenure drastically.",
  ],
};
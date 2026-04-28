import Stat from "./Stat";

export default function EmiChart({
  emi,
  amount,
  totalPayment,
  totalInterest,
  hasCalculated,
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const progress = totalPayment ? amount / totalPayment : 0;
  const dash = progress * circumference;

  const format = (v) => `₹${Math.round(v || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center">

      <h3 className="text-lg font-bold mb-4">
        Loan Repayment Details
      </h3>

      {!hasCalculated ? (
        <div>
          <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 border flex items-center justify-center">
            Calculate EMI
          </div>
          <p className="mt-3">Repayment Breakdown</p>
        </div>
      ) : (
        <>
          <div className="relative w-[160px] h-[160px] mx-auto mb-4">
            <svg viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} stroke="#e5e7eb" strokeWidth="20" fill="none" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#374151"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 90 90)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-xs">Monthly EMI</span>
              <span className="text-xl font-bold">{format(emi)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Stat label="Principal" value={format(amount)} />
            <Stat label="Total Interest" value={format(totalInterest)} />
            <Stat label="Total Payment" value={format(totalPayment)} />
          </div>
        </>
      )}
    </div>
  );
}
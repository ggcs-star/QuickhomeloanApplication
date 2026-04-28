const types = ["Home Buyer", "Car Loan", "Personal Loan"];

export default function LoanTypeSelector({ loanType, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {types.map((type) => {
        const active = loanType === type;

        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`
              text-xs sm:text-sm
              py-2 px-2 sm:px-4
              rounded-full
              w-full
              transition-all duration-200
              active:scale-95
              ${
                active
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
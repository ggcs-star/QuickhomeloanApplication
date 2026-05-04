import { FileSearch, ShieldCheck, LineChart, ChevronRight } from "lucide-react";

export default function AnalysisSection() {
  const cards = [
    {
      title: "Statement Analyzer",
      desc: "Analyze statements",
      icon: FileSearch,
    },
    {
      title: "Rate Change Risk",
      desc: "Interest risk alert",
      icon: ShieldCheck,
    },
    {
      title: "Rate Change Tracker",
      desc: "Track rate changes",
      icon: LineChart,
    },
  ];

  return (
    <div className="px-4 py-5 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Analysis
      </h1>

      {/* INVESTMENT VALUE */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Current investment value
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl font-semibold text-gray-900">
            ₹0.00
          </span>
          <span className="text-green-600 text-sm font-medium">
            +0.00%
          </span>
        </div>
      </div>

      {/* CARDS */}
      <div className="space-y-4">
        {cards.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="
                flex items-center justify-between
                bg-white rounded-2xl p-4
                shadow-sm border
                hover:shadow-md transition
                cursor-pointer
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* ICON BOX */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600" size={22} />
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* RIGHT ICON */}
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
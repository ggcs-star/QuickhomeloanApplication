import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CalculatorLayout({
  title,
  CalculateComponent,
  InsightsComponent,
  GuideComponent,
}) {
  const [activeTab, setActiveTab] = useState("calculate");

  return (
    <div className="px-4 py-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft
          className="text-gray-700 cursor-pointer"
          onClick={() => window.history.back()}
        />
        <h1 className="text-xl font-semibold text-gray-800">
          {title}
        </h1>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-4">

        {["calculate", "insights", "guide"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "calculate" && <CalculateComponent />}
        {activeTab === "insights" && <InsightsComponent />}
        {activeTab === "guide" && <GuideComponent />}
      </div>

    </div>
  );
}
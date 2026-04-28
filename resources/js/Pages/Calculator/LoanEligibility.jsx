import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { ArrowLeft } from "lucide-react";

import LoanEligibilityCalculator from "@/Components/Calculator/LoanEligibility/LoanEligibilityCalculator";
import LoanInsightsTab from "@/Components/Calculator/LoanEligibility/LoanInsightsTab";
import LoanGuideTab from "@/Components/Calculator/LoanEligibility/LoanGuideTab";

export default function LoanEligibility() {
  const [activeTab, setActiveTab] = useState("calculate");

  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <div className="px-4 py-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <ArrowLeft
            className="text-gray-700 cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Loan Eligibility
          </h1>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-200 mb-4">

          <button
            onClick={() => setActiveTab("calculate")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "calculate"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            Calculate
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "insights"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            Insights
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "guide"
                ? "text-black border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            Guide
          </button>

        </div>

        {/* TAB CONTENT */}
        <div>
          {activeTab === "calculate" && <LoanEligibilityCalculator />}

          {activeTab === "insights" && <LoanInsightsTab />}

          {activeTab === "guide" && <LoanGuideTab />}
        </div>

      </div>
    </AppLayout>
  );
}
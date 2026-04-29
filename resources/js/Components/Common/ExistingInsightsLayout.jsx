import {
  ListChecks,
  Lightbulb,
  ShieldCheck,
  Landmark,
  ShieldAlert,
  CircleQuestionMark,
} from "lucide-react";

const ICONS = {
  Landmark,
  ShieldAlert,
  CircleQuestionMark,
};

export default function ExistingInsightsLayout({
  sections,
  isProUser = true,
  data = {},
}) {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-5">

      {/* MAIN STACK */}
      <div className="space-y-5 max-w-md mx-auto">

        {sections.map((section, idx) => {

          /* ================= INSIGHT CARDS ================= */
          if (section.type === "insight-cards") {
            return (
              <div
                key={idx}
                className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
              >
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon];

                  return (
                    <div
                      key={item.id}
                      className="min-w-[260px] bg-white rounded-2xl p-4 shadow-sm border border-gray-200 snap-start"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          {Icon && <Icon size={18} className="text-gray-700" />}
                        </div>

                        <h4 className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {isProUser
                          ? item.descriptionPro?.(data || {})
                          : item.descriptionFree}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          }

          /* ================= ACTIONS ================= */
          if (section.type === "actions") {
            return (
              <section
                key={idx}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks size={18} className="text-gray-700" />
                  <h2 className="text-[16px] font-semibold text-gray-800">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-2xl p-4 flex gap-4 border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                        {item.id}
                      </div>

                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="text-[13px] text-gray-600 leading-relaxed">
                          {item.description}
                        </p>

                        {item.buttonText && (
                          <button className="mt-2 text-xs font-semibold text-blue-600">
                            {item.buttonText} →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          /* ================= AUDIT CARD ================= */
          if (section.type === "audit-card") {
            return (
              <div
                key={idx}
                className="bg-[#1f2a3c] rounded-3xl p-5 text-white shadow-md"
              >
                <div className="flex items-center gap-2 mb-3 text-blue-300 font-semibold text-sm">
                  <ShieldCheck size={18} />
                  {section.badge}
                </div>

                <h3 className="text-lg font-semibold mb-1">
                  {section.title}
                </h3>

                <p className="text-sm text-gray-300">
                  {section.description}
                </p>
              </div>
            );
          }

          /* ================= TIP CARD ================= */
        

          return null;
        })}
      </div>
    </div>
  );
}
import {
  ListChecks,
  Lightbulb,
  ShieldCheck,
  Landmark,
  ShieldAlert,
  CircleQuestionMark,
  Info,
  Lightbulb as Lightbulbs,
  Target,
  Map,

} from "lucide-react";

const ICONS = {
  Landmark,
  ShieldAlert,
  CircleQuestionMark,
  Info,
  Lightbulb,
  Target,
  Map,
  ShieldCheck,
};

export default function ExistingInsightsLayout({
  sections,
  isProUser = true,
  data = {},
}) {
  return (
  <div className="min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
    <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">

        {sections.map((section, idx) => {

          /* ================= INSIGHT CARDS ================= */
          if (section.type === "insight-cards") {
            return (
              <div
                key={idx}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide
                          md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:snap-none md:pb-0"
              >
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon];

                  return (
                    <div
                      key={item.id}
                      className="min-w-[260px] sm:min-w-[280px] md:min-w-0 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 snap-start
                                hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                          {Icon && <Icon size={18} className="text-gray-700" />}
                        </div>

                        <h4 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <ListChecks size={18} className="text-gray-700 flex-shrink-0" />
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 border border-gray-200
                                hover:border-gray-300 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0 text-sm sm:text-base">
                        {item.id}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-[15px] md:text-base font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="text-xs sm:text-[13px] md:text-sm text-gray-600 leading-relaxed mt-1">
                          {item.description}
                        </p>

                        {/* {item.buttonText && (
                          <button className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            {item.buttonText} →
                          </button>
                        )} */}
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
                className="bg-[#1f2a3c] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white shadow-md
                          hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center gap-2 mb-3 text-blue-300 font-semibold text-xs sm:text-sm">
                  <ShieldCheck size={18} className="flex-shrink-0" />
                  <span>{section.badge}</span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                  {section.title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  {section.description}
                </p>
              </div>
            );
          }

          /* ================= TIP CARD ================= */
          if (section.type === "tip-card") {
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-amber-200"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <Lightbulb size={18} className="text-amber-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-amber-900 mb-1">
                      {section.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
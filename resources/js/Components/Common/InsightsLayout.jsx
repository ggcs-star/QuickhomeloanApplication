import {
  Calculator,
  Clock,
  ListChecks,
  BarChart3,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const ICONS = {
  calculator: Calculator,
  clock: Clock,
  steps: ListChecks,
  chart: BarChart3,
  growth: TrendingUp,
};

export default function InsightsLayout({ sections }) {
  return (
    <div className="space-y-6">

      {sections.map((section, idx) => {
        const Icon = ICONS[section.icon];

        return (
          <Section key={idx} title={section.title} icon={Icon}>

            {/* ✅ LIST (same as your UI) */}
            {section.type === "list" && (
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* ✅ GRID BULLETS */}
            {section.type === "grid" && (
              <div className="grid grid-cols-1 gap-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-blue-500">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ STEPS (exact same design) */}
            {section.type === "steps" && (
              <div className="grid grid-cols-1 gap-3">
                {section.items.map(([title, desc], i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-3 rounded-lg border flex gap-3"
                  >
                    <div className="text-blue-600 font-bold">
                      {i + 1}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ FORMULA BLOCK */}
            {section.type === "formula" && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 text-center font-mono text-sm">
                  {section.formula}
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3">
                  {section.meta.map((m, i) => (
                    <p key={i}>{m}</p>
                  ))}
                </div>
              </>
            )}
            {section.type === "formula-multi" && (
              <div className="space-y-2">
                {section.formulas.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg p-3 text-center font-mono text-sm"
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* ✅ BULB LIST */}
            {section.type === "bulb" && (
              <div className="grid grid-cols-1 gap-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Lightbulb size={14} className="text-yellow-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

          </Section>
        );
      })}

    </div>
  );
}

/* SECTION */
function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-blue-600" />}
        <h2 className="text-sm font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      {/* CONTENT */}
      <div className="text-gray-600 text-sm leading-relaxed space-y-2">
        {children}
      </div>

    </section>
  );
}
import {
  Calculator,
  Clock3,
  ListChecks,
  BarChart3,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Lightbulb,
} from "lucide-react";

import { useState } from "react";

const ICONS = {
  calculator: Calculator,
  clock: Clock3,
  steps: ListChecks,
  chart: BarChart3,
  growth: TrendingUp,
  faq: HelpCircle,
};

const ICON_STYLES = {
  calculator: {
    bg: "bg-[#f3e8ff]",
    color: "text-[#9333ea]",
  },

  clock: {
    bg: "bg-[#dbeafe]",
    color: "text-[#2563eb]",
  },

  steps: {
    bg: "bg-[#e0e7ff]",
    color: "text-[#4f46e5]",
  },

  chart: {
    bg: "bg-[#ffedd5]",
    color: "text-[#f97316]",
  },

  growth: {
    bg: "bg-[#dcfce7]",
    color: "text-[#16a34a]",
  },

  faq: {
    bg: "bg-[#f3f4f6]",
    color: "text-[#374151]",
  },
};

export default function InsightsLayout({
  sections,
}) {
const [openIndex, setOpenIndex] =
  useState(null);

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-[#eceef3]">

      {sections.map((section, idx) => {
        const Icon =
          ICONS[section.icon];

        const style =
          ICON_STYLES[section.icon] ||
          ICON_STYLES.calculator;

        const isOpen =
          openIndex === idx;

        return (
          <Section
            key={idx}
            title={section.title}
            icon={Icon}
            style={style}
            isOpen={isOpen}
            onClick={() =>
              setOpenIndex(
                isOpen ? null : idx
              )
            }
          >

            {/* LIST */}
            {section.type === "list" && (
              <ul className="space-y-4 pt-1">
                {section.items.map(
                  (item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-start text-[14px] leading-7 text-[#374151]"
                    >
                      <span className="text-[#22c55e] font-bold mt-[2px]">
                        ✓
                      </span>

                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            )}

            {/* GRID */}
            {section.type === "grid" && (
              <div className="space-y-3 pt-1">
                {section.items.map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-start text-[14px] text-[#374151]"
                    >
                      <span className="text-[#2563eb]">
                        •
                      </span>

                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* STEPS */}
            {section.type === "steps" && (
              <div className="space-y-3">
                {section.items.map(
                  ([title, desc], i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] border border-[#e5e7eb] rounded-xl p-3 flex gap-3"
                    >
                      <div className="text-[#2563eb] font-bold text-sm">
                        {i + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-[#111827] text-sm">
                          {title}
                        </p>

                        <p className="text-xs text-[#6b7280] mt-1">
                          {desc}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* FORMULA */}
            {section.type ===
              "formula" && (
              <>
                <div className="bg-[#f3f4f6] rounded-xl p-4 text-center font-mono text-sm text-[#111827]">
                  {section.formula}
                </div>

                <div className="space-y-2 mt-4 text-[14px] text-[#374151]">
                  {section.meta.map(
                    (m, i) => (
                      <p key={i}>{m}</p>
                    )
                  )}
                </div>
              </>
            )}

            {/* MULTI FORMULA */}
            {section.type ===
              "formula-multi" && (
              <div className="space-y-2">
                {section.formulas.map(
                  (f, i) => (
                    <div
                      key={i}
                      className="bg-[#f3f4f6] rounded-xl p-3 text-center font-mono text-sm"
                    >
                      {f}
                    </div>
                  )
                )}
              </div>
            )}

            {/* BULB */}
            {section.type === "bulb" && (
              <div className="space-y-3">
                {section.items.map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-start text-[14px] text-[#374151]"
                    >
                      <Lightbulb
                        size={14}
                        className="text-[#facc15] mt-[3px]"
                      />

                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            )}

          </Section>
        );
      })}

    </div>
  );
}

/* SECTION */
function Section({
  title,
  icon: Icon,
  children,
  style,
  isOpen,
  onClick,
}) {
  return (
    <section className="border-b border-[#eceef3] last:border-b-0">

      {/* HEADER */}
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-4 py-[14px]"
      >

        <div className="flex items-start gap-3 text-left">

          {/* ICON */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}
          >
            {Icon && (
              <Icon
                size={15}
                className={style.color}
                strokeWidth={2.2}
              />
            )}
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-[15px] font-semibold text-[#111827] leading-none">
              {title}
            </h2>

            <p className="text-[12px] text-[#6b7280] mt-[6px] leading-none">
              Discover the best use cases and scenarios.
            </p>
          </div>

        </div>

        {/* ARROW */}
        <ChevronDown
          size={18}
          strokeWidth={2.2}
          className={`text-[#0f172a] shrink-0 transition-all duration-300 ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />

      </button>

      {/* CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-5">
          {children}
        </div>
      </div>

    </section>
  );
}
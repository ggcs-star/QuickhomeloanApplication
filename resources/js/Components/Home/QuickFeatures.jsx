import {
  Home,
  UserRound,
  Calculator,
  BadgePercent,
} from "lucide-react";

import { router } from "@inertiajs/react";

export default function QuickFeatures() {
  const items = [
    {
      title: "Home Loan",
      desc: "Low interest\nrates",
      icon: Home,
      bg: "from-[#2f6bff] to-[#1447d8]",
      onClick: () => router.visit("/profile/smart-setup"),
    },
 {
  title: "Loan by Profession",
  desc: "Quick funds for\nyour needs",
  icon: UserRound,
  bg: "from-[#33d65f] to-[#18a542]",
  onClick: () => router.visit("/loan-by-profession"),
},
    {
      title: "Calculators",
      desc: "Plan better with\nsmart tools",
      icon: Calculator,
      bg: "from-[#a855f7] to-[#7e22ce]",
      onClick: () => router.visit("/tools/calculator"),
    },
 {
  title: "Eligibility",
  desc: "See loan offers\ninstantly",
  icon: BadgePercent,
  bg: "from-[#ffb020] to-[#ff8a00]",
  onClick: () => {
    window.location.href =
      "https://myscore.cibil.com/CreditView/enrollShort_new.page?enterprise=CIBIL&offer=FACRA";
  },
},
  ];

  return (
    <section className="px-3 sm:px-4 mt-3 relative z-30">

      {/* DIVIDER */}
      <div className="px-1 pb-3">
        <div className="h-[1px] bg-[#ECECEC]" />
      </div>

      {/* CARD */}
      <div
        className="
          rounded-[24px]
          overflow-hidden
          bg-gradient-to-r
          from-[#061943]
          via-[#08265d]
          to-[#031537]
          grid
          grid-cols-4
          shadow-[0_8px_25px_rgba(3,21,55,0.18)]
        "
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`
                flex flex-col items-center justify-center
                py-4 px-1
                min-h-[136px]
                active:scale-95
                transition-all duration-200
                ${
                  index !== items.length - 1
                    ? "border-r border-white/10"
                    : ""
                }
              `}
            >
              {/* ICON */}
              <div
                className={`
                  w-[46px] h-[46px]
                  sm:w-[52px] sm:h-[52px]
                  rounded-full
                  bg-gradient-to-br
                  ${item.bg}
                  flex items-center justify-center
                  mb-2
                  shrink-0
                  shadow-md
                `}
              >
                <Icon
                  size={21}
                  strokeWidth={2.3}
                  className="text-white sm:w-6 sm:h-6"
                />
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-white
                  text-[11px]
                  sm:text-[13px]
                  font-semibold
                  text-center
                  leading-snug
                "
              >
                {item.title}
              </h3>

              {/* DESC */}
              <p
                className="
                  text-white/70
                  text-[9px]
                  sm:text-[11px]
                  text-center
                  mt-1
                  leading-tight
                  whitespace-pre-line
                  px-[2px]
                "
              >
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
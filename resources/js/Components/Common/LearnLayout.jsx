import { router } from "@inertiajs/core";
import { ArrowRight } from "lucide-react";

export default function LearnLayout() {
  const cards = [
    {
      title: "Audio Insights",
      desc: "Understand calculations with quick audio",
      button: "Start Listening",
      color: "blue",
      image: "/images/audio.png", 
      route: "/calculator/audio",
    },
    {
      title: "Visual Guides",
      desc: "See loan calculations in action",
      button: "Start Watching",
      color: "orange",
      image: "", 
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-5">

      <div className="max-w-md mx-auto space-y-5">

        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-4 flex gap-4 items-center border border-gray-200 shadow-sm"
          >
            {/* LEFT IMAGE */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1">

              <h3 className="text-[16px] font-semibold text-gray-800">
                {card.title}
              </h3>

              <p className="text-[13px] text-gray-600 mt-1">
                {card.desc}
              </p>

              {/* CTA */}
              <div
                className={`mt-3 flex items-center justify-between text-sm font-semibold ${card.color === "blue"
                    ? "text-blue-600"
                    : "text-orange-500"
                  }`}
              >
                <span>{card.button}</span>
                <ArrowRight size={18} />
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
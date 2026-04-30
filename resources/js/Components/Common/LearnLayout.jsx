import { router } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

export default function LearnLayout({ slug }) {
  const cards = [
    {
      title: "Audio Insights",
      desc: "Understand calculations with quick audio",
      button: "Start Listening",
      color: "blue",
      image: "/images/CalculatorAudio.png",
      route: "/existing/audio",
    },
    {
      title: "Visual Guides",
      desc: "See loan calculations in action",
      button: "Start Watching",
      color: "orange",
      image: "/images/CalculatorVideo.png",
      route: "/existing/video",
    },
  ];

  return (
    <div className="bg-[#f5f7fb] min-h-screen px-4 py-6">

      {/* SCREEN CONTAINER */}
      <div className="max-w-md mx-auto space-y-4">

        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => router.visit(`${card.route}/${slug}`)}
            className="
              bg-white 
              rounded-3xl 
              p-4 
              flex 
              gap-4 
              items-center 
              shadow-[0_6px_16px_rgba(0,0,0,0.06)]
              border border-gray-100
              active:scale-[0.97]
              transition-all
              duration-150
              cursor-pointer
            "
          >

            {/* LEFT IMAGE BOX */}
            <div
              className={`
                w-[90px] h-[90px] 
                rounded-2xl 
                flex items-center justify-center
                ${card.color === "blue"
                  ? "bg-gradient-to-br from-blue-100 to-blue-50"
                  : "bg-gradient-to-br from-orange-100 to-orange-50"}
              `}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1">

              {/* TITLE */}
              <h3 className="text-[16px] font-semibold text-gray-900 leading-tight">
                {card.title}
              </h3>

              {/* DESC */}
              <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">
                {card.desc}
              </p>

              {/* CTA */}
              <div
                className={`
                  mt-3 flex items-center justify-between text-[13px] font-semibold
                  ${card.color === "blue"
                    ? "text-blue-600"
                    : "text-orange-500"}
                `}
              >
                <span>{card.button}</span>

                <div className="flex items-center gap-1">
                  <ArrowRight size={18} />
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
import AppLayout from "../Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
export default function Education() {

  const cards = [
    {
      title: "Audio Briefings",
      desc: "Smart insights to make better loan decisions.",
      action: "Start Listening",
      color: "blue",
      image: "/images/audio.png",
      route: "/courses?type=audio",
      bg: "bg-blue-50",
    },
    {
      title: "Visual Masterclasses",
      desc: "Visual learning for better loan decisions.",
      action: "Start Watching",
      color: "orange",
      image: "/images/video.png",
      route: "/courses?type=video",
      bg: "bg-orange-50",
    },
    {
      title: "Podcast",
      desc: "Learn on-the-go with expert insights",
      action: "Start Episode",
      color: "blue",
      image: "/images/Podcast.png",
      route: "",
      bg: "bg-purple-50",
    },
    {
      title: "Quick Knowledge",
      desc: "Quick videos to boost knowledge",
      action: "Start Learning",
      color: "blue",
      image: "/images/Reels.png",
      route: "/reels",
      bg: "bg-green-50",
    },
  ];

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-gray-100 px-4 py-5 pb-24">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 mt-4">
          Academy
        </h1>

        {/* CARDS */}
        <div className="space-y-5">

          {cards.map((item, index) => (
            <div
              key={index}
              onClick={() => router.visit(item.route)}
              className="bg-white rounded-2xl border shadow-sm p-4 flex gap-4 items-center active:scale-[0.98] transition"
            >

              <div className="w-24 h-24 min-w-[96px] rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1">

                <h3 className="text-[17px] font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1 leading-snug">
                  {item.desc}
                </p>

                {/* CTA */}
                <div className="mt-3 flex items-center justify-between">

                  <span className="text-sm font-semibold text-blue-600">
                    {item.action}
                  </span>

                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50">
                    <ArrowRight size={18} className="text-blue-600" />
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

      

      </div>
    </AppLayout>
  );
}
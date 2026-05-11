import { ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

const items = [
  {
    title: "Courses",
    desc: "Video & audio\nguides",
    icon: "/images/Home/media.png",
    bg: "bg-blue-100",
    route: "/education",
  },
  {
    title: "Tools",
    desc: "Make smarter\ndecisions",
    icon: "/images/Home/tools.png",
    bg: "bg-orange-100",
    route: "/tools",
  },
  {
    title: "News",
    desc: "Stay informed\n& ahead",
    icon: "/images/Home/news.png",
    bg: "bg-green-100",
    route: "/news",
  },
  {
    title: "Community",
    desc: "Connect,grow\ntogether",
    icon: "/images/Home/community.png",
    color: "bg-purple-500",
    route: "/community",
  },
];

export default function QuickActions() {

  const handleNavigation = (route) => {
    if (!route) return;

    // External URL
    if (route.startsWith("http")) {
      window.location.href = route;
      return;
    }

    // Internal Inertia route
    router.visit(route);
  };

  return (
    <section className="px-4 py-5 bg-[#F8F8FA]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-bold text-[#111827]">
          Explore & Grow
        </h2>

        <button className="flex items-center gap-1 text-[#2563EB] text-[15px] font-medium">
          View All
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleNavigation(item.route)}
            className="
              bg-white
              border
              border-[#E5E7EB]
              rounded-[18px]
              px-4
              py-4
              flex
              items-start
              relative
              active:scale-[0.98]
              transition-all
              duration-200
              min-h-[84px]
            "
          >
            {/* ICON */}
            <div
              className={`
                w-11
                h-11
                rounded-full
                flex
                items-center
                justify-center
                shrink-0
                ${item.bg}
              `}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-5 h-5 object-contain"
              />
            </div>

            {/* CONTENT */}
            <div className="ml-3 text-left">
              <h3 className="text-[14px] font-bold text-[#111827] leading-[18px]">
                {item.title}
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-[15px]
                  text-[#6B7280]
                  whitespace-pre-line
                "
              >
                {item.desc}
              </p>
            </div>

            {/* ARROW */}
            <div
              className="
                absolute
                right-3
                bottom-3
                w-5
                h-5
                rounded-full
                bg-[#EEF4FF]
                flex
                items-center
                justify-center
              "
            >
              <ChevronRight
                size={12}
                strokeWidth={2.8}
                className="text-[#2563EB]"
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
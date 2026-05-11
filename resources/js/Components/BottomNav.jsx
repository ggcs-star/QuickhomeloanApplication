import { router, usePage } from "@inertiajs/react";
import {
  Home,
  BarChart3,
  Zap,
  GraduationCap,
  Newspaper,
} from "lucide-react";

export default function BottomNav() {
  const { url } = usePage();

  const menus = [
    { icon: Home, path: "/", label: "Home" },
    { icon: BarChart3, path: "/analysis", label: "Analysis" },
    { icon: Zap, path: "/reels", center: true, label: "Reels" },
    { icon: GraduationCap, path: "/education", label: "Education" },
    { icon: Newspaper, path: "/news", label: "News" },
  ];

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-md
          bg-white/95
          backdrop-blur-xl
          border-t
          border-gray-200
          px-1
          pt-1.5
          pb-[max(6px,env(safe-area-inset-bottom))]
          flex
          justify-around
          items-center
          shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
          rounded-t-[18px]
        "
      >
        {menus.map((item, index) => {
          const Icon = item.icon;
          const active = url === item.path;

          // CENTER BUTTON
          if (item.center) {
            return (
              <button
                key={index}
                onClick={() => router.visit(item.path)}
                aria-label={item.label}
                className="
                  relative
                  -mt-6
                  flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  rounded-full
                  bg-[#214165]
                  text-white
                  shadow-[0_8px_20px_rgba(33,65,101,0.35)]
                  transition-all
                  duration-300
                  active:scale-90
                "
              >
                <Icon size={22} strokeWidth={2.5} />
              </button>
            );
          }

          // NORMAL MENU
          return (
            <button
              key={index}
              onClick={() => router.visit(item.path)}
              aria-label={item.label}
              className="
                relative
                flex
                flex-col
                items-center
                justify-center
                w-14
                h-[48px]
                transition-all
                duration-200
                active:scale-90
              "
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className={`transition-colors duration-300 ${
                  active
                    ? "text-[#214165]"
                    : "text-gray-400"
                }`}
              />

              {/* ACTIVE DOT */}
              <div
                className={`
                  absolute
                  bottom-1
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#214165]
                  transition-all
                  duration-300
                  ${
                    active
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
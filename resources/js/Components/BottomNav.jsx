import { router, usePage } from "@inertiajs/react";
import {
  Home,
  BarChart3,
  Zap,
  GraduationCap,
  Newspaper
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
        fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
          bg-white/90 backdrop-blur-xl border border-white/20
          shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl px-2 py-3
          flex justify-around items-center
        "
      >
        {menus.map((item, index) => {
          const Icon = item.icon;
          const active = url === item.path;

          // ⭐ CENTER BUTTON (Floating)
          if (item.center) {
            return (
              <button
                key={index}
                onClick={() => router.visit(item.path)}
                aria-label={item.label}
                className="
                  relative group flex items-center justify-center
                  w-14 h-14 rounded-full -mt-10 
                  bg-[#214165] text-white shadow-[0_8px_20px_rgb(33,65,101,0.4)]
                  transition-all duration-300 ease-out
                  hover:bg-[#1a3350] hover:-translate-y-1
                  active:scale-90 active:translate-y-0
                "
              >
                <Icon size={26} strokeWidth={2.5} className="transition-transform duration-300 group-hover:scale-110" />
              </button>
            );
          }

          // NORMAL ITEMS
          return (
            <button
              key={index}
              onClick={() => router.visit(item.path)}
              aria-label={item.label}
              className="
                relative flex flex-col items-center justify-center w-16
                transition-transform duration-200 active:scale-90
              "
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.5 : 2}
                className={`transition-colors duration-300 ${
                  active ? "text-[#214165]" : "text-gray-400 hover:text-gray-600"
                }`}
              />

              {/* DOT INDICATOR WITH ANIMATION */}
              <div
                className={`
                  absolute -bottom-3 h-1.5 w-1.5 rounded-full bg-[#214165]
                  transition-all duration-300 ease-out
                  ${active ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
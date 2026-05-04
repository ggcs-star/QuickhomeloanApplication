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
    { icon: Home, path: "/" },
    { icon: BarChart3, path: "/analysis" },
    { icon: Zap, path: "/reels", center: true },
    { icon: GraduationCap, path: "/education" },
    { icon: Newspaper, path: "/news" },
  ];

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50
        pb-[env(safe-area-inset-bottom)]
      "
      style={{ bottom: "16px" }} // spacing from bottom
    >
      <div
        className="
          bg-white/90 backdrop-blur-lg
          shadow-xl rounded-2xl px-4 pt-3 pb-3
          flex justify-between items-center
        "
      >

        {menus.map((item, index) => {
          const Icon = item.icon;
          const active = url === item.path;

          // ⭐ CENTER BUTTON
          if (item.center) {
            return (
              <button
                key={index}
                onClick={() => router.visit(item.path)}
                className="
                  text-white 
                  w-14 h-14 rounded-xl 
                  flex items-center justify-center
                  shadow-lg -mt-8
                "
                style={{ backgroundColor: "#214165" }}
              >
                <Icon size={24} strokeWidth={2.5} />
              </button>
            );
          }

          // NORMAL ITEMS
          return (
            <button
              key={index}
              onClick={() => router.visit(item.path)}
              className="flex flex-col items-center justify-center flex-1"
            >
              <Icon
                size={22}
                strokeWidth={2}
                className={active ? "text-black" : "text-gray-400"}
              />

              {/* DOT */}
              <div
                className={`mt-1 h-1 w-1 rounded-full ${active ? "bg-black" : "bg-transparent"
                  }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { router, usePage } from "@inertiajs/react";
import {
  Home,
  FileText,
  Calculator,
  GraduationCap,
  User
} from "lucide-react";

export default function BottomNav() {
  const { url } = usePage();

  const menus = [
    { icon: Home, path: "/" },
    { icon: FileText, path: "" },
    { icon: Calculator, path: "" },
    { icon: GraduationCap, path: "/education" },
    { icon: User, path: "" },
  ];

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50"
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
    >
      <div className="bg-white shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center">

        {menus.map((item, index) => {
          const Icon = item.icon;
          const active = url === item.path;

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

              {/* Active Dot */}
              <div
                className={`mt-1 h-1 w-1 rounded-full ${
                  active ? "bg-black" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}

      </div>
    </div>
  );
}
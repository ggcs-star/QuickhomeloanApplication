import { Search, User, Mic, Bell } from "lucide-react";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function TopNav() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-[#f3f4f6]"
        style={{
          paddingTop: "max(10px, env(safe-area-inset-top))",
        }}
      >
        <div className="px-4 py-3">

          {/* ================= TOP ROW ================= */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 min-w-0">

              {/* LOGO */}
              <div
                onClick={() => router.visit("/")}
                className="
                  w-11
                  h-11
                  rounded-xl
                  overflow-hidden
                  shadow-sm
                  shrink-0
                  cursor-pointer
                "
              >
                <img
                  src="/images/Logo.png"
                  alt="App Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* USER NAME */}
              <div className="flex-1 min-w-0">
                <h2
                  className="
                    text-[17px]
                    font-bold
                    text-[#111827]
                    leading-[21px]
                    truncate
                  "
                >
                  Hey, {user?.full_name || "Guest"} 
                </h2>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">

              {/* NOTIFICATION */}
             <div
  className="
    relative
    w-10
    h-10
    rounded-full
    bg-white
    border
    border-gray-200
    flex
    items-center
    justify-center
    shadow-sm
    shrink-0
    text-[#1e2330]
  "
>
  <Bell size={19} strokeWidth={1.9} />

  {/* RED DOT */}
  <span
    className="
      absolute
      top-2.5
      right-2.5
      w-2
      h-2
      rounded-full
      bg-red-500
    "
  />
</div>

              {/* PROFILE */}
              <button
                onClick={() => router.visit("/profile")}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  shrink-0
                  text-[#1e2330]
                "
              >
                <User size={20} strokeWidth={1.7} />
              </button>

            </div>
          </div>

          {/* ================= SEARCH BAR ================= */}
          <div className="mt-3 relative">

            {/* SEARCH ICON */}
            <Search
              size={18}
              strokeWidth={2}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            {/* INPUT */}
            <input
              type="text"
              placeholder="Search for loans, tools, courses & more"
              className="
                w-full
                h-[48px]
                rounded-full
                border
                border-gray-200
                bg-white
                pl-11
                pr-11
                text-[14px]
                text-gray-700
                placeholder:text-gray-400
                shadow-sm
                focus:outline-none
              "
            />

            {/* MIC ICON */}
            <Mic
              size={18}
              strokeWidth={2}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />
          </div>
        </div>
      </div>

      {/* SPACING */}
      <div className="h-[120px]" />
    </>
  );
}
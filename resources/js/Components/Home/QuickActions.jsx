import { router } from "@inertiajs/react";

const items = [
  {
    title: "Media",
    desc: "Learn through videos & audios",
    icon: "/images/Home/media.png",
    color: "bg-blue-500",
    route: "/education", 
  },
  {
    title: "Tools",
    desc: "Make smarter loan decisions",
    icon: "/images/Home/tools.png",
    color: "bg-orange-500",
    route: "/tools",
  },
  {
    title: "News",
    desc: "Stay informed, stay ahead",
    icon: "/images/Home/news.png",
    color: "bg-green-500",
    route: "/news",
  },
  {
    title: "Community",
    desc: "Connect, learn, grow together",
    icon: "/images/Home/community.png",
    color: "bg-purple-500",
    route: "/community",
  },
];

export default function QuickActions() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 
        RESPONSIVE GRID: 
        - 2 columns on small mobile screens
        - 3 columns on tablets (sm)
        - 4 columns on laptops/desktops (lg)
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        
        {items.map((item, i) => (
          <div
            key={i} // Added missing unique key for React
            onClick={() => item.route && router.visit(item.route)}
            className={`
              relative bg-white rounded-3xl p-5 sm:p-6 
              flex flex-col items-center text-center
              border border-gray-100
              shadow-[0_4px_12px_rgba(0,0,0,0.04)] 
              transition-all duration-300 ease-out
              group
              ${item.route ? "cursor-pointer hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-95" : "opacity-80"}
            `}
          >
            {/* ICON CONTAINER */}
            <div className="mb-4 sm:mb-5 relative">
              <div
                className="
                  w-14 h-14 sm:w-16 sm:h-16 
                  rounded-2xl flex items-center justify-center 
                  bg-gray-50 group-hover:bg-white
                  transition-colors duration-300
                  relative z-10
                "
              >
                {/* Glow Effect (Scales up slightly on hover) */}
                <div 
                  className={`
                    absolute inset-0 rounded-2xl blur-xl opacity-20 
                    transition-transform duration-300 group-hover:scale-110 
                    ${item.color}
                  `} 
                />

                {/* Image (Slight bounce on hover) */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain relative z-20 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* TITLE */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 transition-colors group-hover:text-black">
              {item.title}
            </h3>

            {/* DESC (Hidden on extremely small screens, visible on normal mobile and up) */}
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2 leading-relaxed px-1 sm:px-2 line-clamp-2">
              {item.desc}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
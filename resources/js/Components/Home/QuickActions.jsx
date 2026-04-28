
import { router } from "@inertiajs/react";
const items = [
    {
        title: "Media",
        desc: "Learn through videos & audios",
        icon: "/images/Home/media.png",
        color: "bg-blue-500",
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
    },
    {
        title: "Community",
        desc: "Connect, learn, grow together",
        icon: "/images/Home/community.png",
        color: "bg-purple-500",
    },
];

export default function QuickActions() {
    return (
        <div className="px-4">
            <div className="grid grid-cols-2 gap-5">

                {items.map((item, i) => (
                    <div
                        onClick={() => item.route && router.visit(item.route)}
                        className="
  bg-white 
  rounded-3xl 
  p-6 
  flex flex-col items-center text-center
  shadow-[0_4px_12px_rgba(0,0,0,0.08)]
  border border-gray-200
  transition-all duration-200
  active:scale-95
  cursor-pointer
  "
                    >

                        {/* ICON WITH GLOW */}
                        {/* ICON WITH BACKGROUND */}
                        <div className="mb-4">

                            <div
                                className="
                                w-16 h-16 
                                rounded-2xl 
                                flex items-center justify-center 
                                bg-gray-100 
                                relative
                                "
                            >

                                {/* Glow */}
                                <div className={`absolute inset-0 rounded-2xl blur-lg opacity-20 ${item.color}`} />

                                {/* Image */}
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="w-9 h-9 object-contain relative z-10"
                                />

                            </div>

                        </div>

                        {/* TITLE */}
                        <h3 className="text-lg font-semibold text-gray-800">
                            {item.title}
                        </h3>

                        {/* DESC */}
                        <p className="text-sm text-gray-500 mt-1 leading-snug px-2">
                            {item.desc}
                        </p>

                    </div>
                ))}

            </div>
        </div>
    );
}
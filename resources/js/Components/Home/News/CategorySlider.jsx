import { useRef, useMemo } from "react";

export default function CategorySlider({ categories = [], active, onChange }) {
  const sliderRef = useRef(null);

  const allCategory = {
    id: "ALL",
    name: "All",
  };

  const mergedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [allCategory];
    const hasAll = categories.some((c) => String(c.id).toUpperCase() === "ALL");
    return hasAll ? categories : [allCategory, ...categories];
  }, [categories]);

  if (mergedCategories.length === 0) return null;

  const showArrows = mergedCategories.length > 8;

  const scroll = (dir) => {
    sliderRef.current?.scrollBy({
      left: dir * 250,
      behavior: "smooth",
    });
  };

  const handleClick = (id) => {
    sessionStorage.setItem("activeCategory", id);
    onChange(id);
  };

  return (
    <div className="relative flex items-center w-full">
      {/* LEFT ARROW (Hidden on mobile, visible on desktop) */}
      {showArrows && (
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute -left-4 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:bg-gray-50 transition"
        >
          ‹
        </button>
      )}

      {/* SCROLLABLE CATEGORIES */}
      <div
        ref={sliderRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 w-full snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mergedCategories.map((cat) => {
          const isActive = String(cat.id) === String(active);

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-[12px] border text-[13px] md:text-[14px] font-semibold whitespace-nowrap transition-all duration-200 snap-start shrink-0
                ${
                  isActive
                    ? "bg-[#1e293b] text-white border-[#1e293b] shadow-md shadow-slate-900/10"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* RIGHT ARROW (Hidden on mobile, visible on desktop) */}
      {showArrows && (
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex absolute -right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:bg-gray-50 transition"
        >
          ›
        </button>
      )}
    </div>
  );
}
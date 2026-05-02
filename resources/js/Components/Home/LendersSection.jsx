import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import api from "@/api"; // ✅ your axios instance
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function LendersSection() {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLenders();
  }, []);

  const fetchLenders = async () => {
    try {
      const res = await api.get("/lenders"); // ✅ use axios
      if (res.data?.status) {
        setLenders(res.data.data);
      }
    } catch (err) {
      console.error("Lenders API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f3f4f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-[26px] md:text-3xl font-bold text-[#0f172a]">
            Our Trusted Lending Partners
          </h2>
          <p className="text-[#64748b] mt-3 max-w-lg mx-auto text-[15px] md:text-base leading-relaxed">
            We've partnered with India's leading banks to bring you the best home loan offers.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden mt-8 pt-10 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl border border-gray-200 p-5 pt-10 shadow-sm animate-pulse min-w-[260px] md:min-w-[280px]"
              >
                {/* Skeleton Floating Logo */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-gray-200 rounded-[14px] border border-gray-100 shadow-sm" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                <div className="border-t border-gray-200 mx-2 mb-4" />
                <div className="flex justify-between items-end px-2">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : lenders.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No lenders found
          </div>
        ) : (
          /* SINGLE LINE SLIDER (SWIPER) */
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0">
            <Swiper
              grabCursor={true}
              resistanceRatio={0.85}
              breakpoints={{
                // Mobile (Peeking effect)
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 16,
                },
                480: {
                  slidesPerView: 1.5,
                  spaceBetween: 16,
                },
                // Tablets
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                // Desktops
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3.2,
                  spaceBetween: 24,
                },
              }}
              // pt-10 is crucial here so the floating logos don't get cut off by Swiper's overflow:hidden
              className="pt-10 pb-6 !px-2" 
            >
              {lenders.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <div className="relative bg-white rounded-2xl border border-gray-200 px-5 pb-5 pt-10 shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full">
                    
                    {/* FLOATING LOGO BOX */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-[14px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden z-10">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-9 h-9 object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => (e.target.src = "/images/fallback.png")}
                      />
                    </div>

                    {/* BANK NAME */}
                    <h3 className="text-center text-[#0f172a] font-medium text-[17px] mb-3 truncate px-2">
                      {item.name}
                    </h3>

                    {/* DARK DIVIDER LINE */}
                    <div className="border-t border-gray-400 mx-1 mb-3"></div>

                    {/* BOTTOM SECTION (Interest Rate & Icon) */}
                    <div className="flex justify-between items-end px-1">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#64748b] mb-0.5">
                          Interest Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[#16a34a] font-medium text-[17px]">
                            {item.rate?.includes('%') ? item.rate : `${item.rate}%`}
                          </span>
                          <span className="text-[#64748b] text-[14px] mb-0.5">
                            p.a.
                          </span>
                        </div>
                      </div>
                      
                      {/* CHEVRON ICON */}
                      <ChevronRight 
                        className="text-[#334155] w-5 h-5 mb-1 group-hover:translate-x-1 transition-transform" 
                        strokeWidth={2.5} 
                      />
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
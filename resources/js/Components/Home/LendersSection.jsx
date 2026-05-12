import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import api from "@/api";

export default function LendersSection() {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLenders();
  }, []);

  const fetchLenders = async () => {
    try {
      const res = await api.get("/lenders");

      if (res.data?.status) {
        setLenders(res.data.data);
      }
    } catch (err) {
      console.error("Lenders API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW APPLY LOAN ROUTE LOGIC
  const openLender = (item) => {

    const bankName = item?.name?.trim();

    if (!bankName) return;

    const category = encodeURIComponent(
      "Home Loan By Banks"
    );

    const subcategory = encodeURIComponent(
      bankName
    );

    const url =
      `https://quickhomeloan.in/apply-loan?category=${category}&subcategory=${subcategory}`;

    console.log("BANK:", bankName);
    console.log("URL:", url);

    window.location.href = url;
  };

  return (
    <section className="bg-[#f3f4f6] pt-3 pb-2 overflow-hidden">
      <div className="px-4">

        {/* HEADER */}
        <div className="text-center mb-4">

          <h2 className="text-[18px] leading-[24px] font-bold text-[#081c4b]">
            Our Trusted Lending Partners
          </h2>

          <p
            className="
              text-[#6b7280]
              mt-1
              text-[12px]
              leading-[18px]
              max-w-[290px]
              mx-auto
            "
          >
            We've partnered with India's leading banks to bring you
            the best home loan offers.
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex gap-4 overflow-hidden pt-8 pb-2">

            {[1, 2, 3, 4].map((i) => (

              <div
                key={i}
                className="
                  relative
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  pb-5
                  pt-10
                  shadow-sm
                  min-w-[165px]
                  max-w-[165px]
                  animate-pulse
                  flex-shrink-0
                "
              >

                <div
                  className="
                    absolute
                    -top-7
                    left-1/2
                    -translate-x-1/2
                    w-14
                    h-14
                    rounded-[14px]
                    bg-gray-200
                  "
                />

                <div className="h-4 bg-gray-200 rounded mb-3" />

                <div className="border-t border-gray-200 mb-3"></div>

                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>

                  <div className="w-4 h-4 bg-gray-200 rounded" />
                </div>

              </div>

            ))}

          </div>

        ) : lenders.length === 0 ? (

          <div className="text-center text-gray-500 py-8">
            No lenders found
          </div>

        ) : (

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">

            <div className="flex gap-4 w-max pt-8 pb-2">

              {lenders.map((item) => (

                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLender(item);
                  }}
                  className="
                    relative
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    pb-4
                    pt-9
                    shadow-sm
                    min-w-[165px]
                    max-w-[165px]
                    cursor-pointer
                    active:scale-[0.98]
                    transition-all
                    duration-200
                    flex-shrink-0
                    text-left
                  "
                >

                  {/* FLOATING LOGO */}
                  <div
                    className="
                      absolute
                      -top-6
                      left-1/2
                      -translate-x-1/2
                      w-12
                      h-12
                      bg-white
                      rounded-xl
                      border
                      border-gray-100
                      shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                      flex
                      items-center
                      justify-center
                      overflow-hidden
                      z-10
                    "
                  >

                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) =>
                        (e.target.src = "/images/fallback.png")
                      }
                    />

                  </div>

                  {/* BANK NAME */}
                  <h3
                    className="
                      text-center
                      text-[#0f172a]
                      font-medium
                      text-[14px]
                      leading-5
                      min-h-[42px]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {item.name}
                  </h3>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-300 my-3"></div>

                  {/* BOTTOM */}
                  <div className="flex justify-between items-end">

                    <div>

                      <span className="text-[11px] text-[#64748b] block">
                        Interest Rate
                      </span>

                      <div className="flex items-baseline gap-1">

                        <span className="text-[#16a34a] font-semibold text-[15px]">
                          {item.rate?.includes("%")
                            ? item.rate
                            : `${item.rate}%`}
                        </span>

                        <span className="text-[#64748b] text-[11px]">
                          p.a.
                        </span>

                      </div>

                    </div>

                    <ChevronRight
                      className="text-[#334155] w-4 h-4"
                      strokeWidth={2.5}
                    />

                  </div>

                </button>

              ))}

            </div>

          </div>

        )}

      </div>
    </section>
  );
}
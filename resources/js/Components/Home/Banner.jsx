import { useEffect, useState } from "react";
import api from "@/api";

export default function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [banners]);

    const fetchBanners = async () => {
        try {
            // ✅ CHECK CACHE FIRST
            const cachedBanners =
                localStorage.getItem("home_banners");

            if (cachedBanners) {
                setBanners(JSON.parse(cachedBanners));
                setLoading(false);
            }

            // ✅ FETCH LATEST DATA
            const res = await api.get("/banners");

            const data = res.data.data || [];

            setBanners(data);

            // ✅ SAVE CACHE
            localStorage.setItem(
                "home_banners",
                JSON.stringify(data)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full px-4">

            {/* LOADING */}
            {loading && (
                <div className="w-full animate-pulse">
                    <div className="w-full h-[180px] rounded-[20px] bg-gray-200" />
                </div>
            )}

            {/* BANNERS */}
            {!loading && banners.length > 0 && (
                <div className="relative w-full">

                    <img
                        src={banners[current].image_url}
                        alt="Banner"
                        className="
                            w-full
                            block
                            object-contain
                            rounded-[20px]
                        "
                        style={{
                            height: "auto",
                            maxHeight: "100%",
                        }}
                        loading="lazy"
                    />

                    {/* DOTS */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`
                                    rounded-full
                                    transition-all
                                    duration-300
                                    cursor-pointer
                                    ${
                                        i === current
                                            ? "w-4 h-1.5 bg-[#111827]"
                                            : "w-1.5 h-1.5 bg-[#d1d5db]"
                                    }
                                `}
                            />
                        ))}
                    </div>

                </div>
            )}
        </section>
    );
}
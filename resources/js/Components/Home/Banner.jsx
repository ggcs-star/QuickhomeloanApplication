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
            const res = await api.get("/banners");
            setBanners(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full px-4 mt-4">

            {/* LOADING */}
            {loading && (
                <div className="w-full animate-pulse">
                    <div className="w-full h-[180px] rounded-[20px] bg-gray-200" />
                </div>
            )}

            {/* BANNER */}
            {!loading && banners.length > 0 && (
                <div className="relative w-full">

                    <img
                        src={banners[current].image_url}
                        alt="Banner"
                        className="
                            w-full
                            block
                            object-contain
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
                            <div
                                key={i}
                                className={`
                                    rounded-full
                                    transition-all
                                    duration-300
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
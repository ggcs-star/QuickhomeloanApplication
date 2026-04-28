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
        <div className="w-full px-4 mt-10">

            {/* 🔥 SKELETON */}
            {loading && (
                <div className="w-full h-52 rounded-2xl bg-gray-200 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
                </div>
            )}

            {/* 🎯 BANNER */}
            {!loading && banners.length > 0 && (
                <div className="relative">

                    {/* Slide */}
                    <div className="relative h-52 rounded-2xl overflow-hidden shadow">

                        <img
                            src={banners[current].image_url}
                            className="w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />


                    </div>

                    {/* DOTS */}
                    <div className="flex justify-center gap-2 mt-3">
                        {banners.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-black" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                </div>
            )}

            {/* ❗ EMPTY */}
            {!loading && banners.length === 0 && (
                <p className="text-center text-gray-400 text-sm">
                    No banners available
                </p>
            )}

            {/* ✨ SHIMMER CSS */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

        </div>
    );
}
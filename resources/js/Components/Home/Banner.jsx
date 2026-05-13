import { useEffect, useState } from "react";
import api from "@/api";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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
            nextSlide();
        }, 4000);

        return () => clearInterval(interval);

    }, [banners, current]);

    const fetchBanners = async () => {

        try {

            // CACHE
            const cachedBanners =
                localStorage.getItem("home_banners");

            if (cachedBanners) {
                setBanners(JSON.parse(cachedBanners));
                setLoading(false);
            }

            // API
            const res = await api.get("/banners");

            const data = res.data.data || [];

            setBanners(data);

            // SAVE CACHE
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

    // NEXT
    const nextSlide = () => {
        setCurrent((prev) =>
            (prev + 1) % banners.length
        );
    };

    // PREV
    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0
                ? banners.length - 1
                : prev - 1
        );
    };

    return (
        <section className="w-full px-4">
        <section className="w-full px-4">

            {/* LOADING */}
            {loading && (
                <div className="w-full animate-pulse">
                    <div className="w-full h-[180px] rounded-[20px] bg-gray-200" />
                </div>
            )}

            {/* BANNERS */}
            {/* BANNERS */}
            {!loading && banners.length > 0 && (

                <div className="relative w-full">

                    {/* IMAGE */}
                    <img
                        src={banners[current].image_url}
                        alt="Banner"
                        className="
                            w-full
                            block
                            object-contain
                            rounded-[20px]
                            rounded-[20px]
                        "
                        style={{
                            height: "auto",
                            maxHeight: "100%",
                        }}
                        loading="lazy"
                    />

                    {/* LEFT ARROW */}
                    <button
                        onClick={prevSlide}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            w-10
                            h-10
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            shadow-md
                            flex
                            items-center
                            justify-center
                            active:scale-95
                            transition
                        "
                    >
                        <ChevronLeft
                            size={22}
                            className="text-[#111827]"
                        />
                    </button>

                    {/* RIGHT ARROW */}
                    <button
                        onClick={nextSlide}
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            w-10
                            h-10
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            shadow-md
                            flex
                            items-center
                            justify-center
                            active:scale-95
                            transition
                        "
                    >
                        <ChevronRight
                            size={22}
                            className="text-[#111827]"
                        />
                    </button>

                    {/* DOTS */}
                    <div className="flex items-center justify-center gap-2 mt-3">

                        {banners.map((_, i) => (

                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                onClick={() => setCurrent(i)}
                                className={`
                                    rounded-full
                                    transition-all
                                    duration-300
                                    cursor-pointer
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
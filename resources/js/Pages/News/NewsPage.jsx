import { useEffect, useState } from "react";
import { Heart, MessageCircle, Bookmark, Eye } from "lucide-react";
import newsApi from "@/newsApi";
import AppLayout from "@/Layouts/AppLayout"; 

const IMAGE_BASE_URL = "https://news.quickhomeloan.in/";

export default function NewsPage() {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    /* ---------- FETCH DATA ---------- */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, postRes] = await Promise.all([
                    newsApi.getCategories(),
                    newsApi.getPosts(),
                ]);

                setCategories(catRes?.data?.categories || []);
                setPosts(postRes?.data?.posts || []);
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ---------- FILTER ---------- */
    useEffect(() => {
        if (activeCategory === "ALL") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter((p) => String(p.category_id) === String(activeCategory))
            );
        }
    }, [activeCategory, posts]);

    /* ---------- HELPER FUNCTIONS ---------- */
    const getImageUrl = (post) => {
        const imagePath = post.image_slider || post.image_mid || post.image_big || post.image;
        return imagePath
            ? (imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`)
            : "/images/Home/news-default-big.png";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString || Date.now());
        const datePart = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        const timePart = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        return { datePart, timePart };
    };

    return (
        <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
            <div className="bg-[#f8fafc] min-h-screen">
                {/* Main App Container */}
                <div className="max-w-[640px] mx-auto bg-[#f8fafc] min-h-screen sm:border-x border-gray-200 shadow-sm">

                    {/* HEADER & TABS SECTION */}
                    <div className="px-4 pt-6 pb-4 sticky top-0 bg-[#f8fafc] z-20">
                        <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-5">News</h1>

                        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <button
                                onClick={() => setActiveCategory("ALL")}
                                className={`px-5 py-2.5 rounded-[10px] text-[14px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${activeCategory === "ALL"
                                        ? "bg-[#1e293b] text-white border border-[#1e293b] shadow-md shadow-slate-900/10"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                All
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-[10px] text-[14px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${String(activeCategory) === String(cat.id)
                                            ? "bg-[#1e293b] text-white border border-[#1e293b] shadow-md shadow-slate-900/10"
                                            : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* THICK DIVIDER */}
                    <div className="h-2.5 w-full bg-gray-200/60 mb-2"></div>

                    {/* POSTS FEED */}
                    <div className="space-y-3 sm:space-y-6 sm:p-4 bg-gray-100 sm:bg-transparent pb-4">
                        {loading ? (
                            /* ================= SKELETON LOADER ================= */
                            Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="block bg-white p-4 sm:p-5 sm:rounded-2xl sm:border border-gray-200 shadow-sm animate-pulse"
                                >
                                    <div className="w-24 h-7 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0"></div>
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                            <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                            <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="w-full h-5 bg-gray-200 rounded"></div>
                                        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-full h-[220px] sm:h-[280px] rounded-2xl bg-gray-200 mb-4"></div>
                                    <div className="flex justify-between items-center px-1 pt-1">
                                        <div className="flex gap-6">
                                            <div className="w-12 h-5 bg-gray-200 rounded"></div>
                                            <div className="w-12 h-5 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))
                            /* ================= END SKELETON LOADER ================= */
                        ) : filteredPosts.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-medium">No news found</div>
                        ) : (
                            filteredPosts.map((item) => {
                                const { datePart, timePart } = formatDate(item.created_at);

                                return (
                                    <a
                                        key={item.id}
                                        href={`/news/${item.title_slug}`}
                                        className="block bg-white p-4 sm:p-5 sm:rounded-2xl sm:border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* CATEGORY BADGE */}
                                        <div className="inline-block bg-[#eff6ff] text-[#3b82f6] px-3 py-1.5 rounded-lg text-[13px] font-medium mb-4">
                                            {item.category_name || "News"}
                                        </div>

                                        {/* AUTHOR INFO */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <img
                                                src={item.author_image || "/images/default-avatar.jpg"}
                                                alt="Author"
                                                className="w-11 h-11 rounded-full object-cover border border-gray-100"
                                            />
                                            <div className="flex flex-col leading-[1.2]">
                                                <span className="text-[15px] font-medium text-gray-900 mb-0.5">
                                                    {item.author_name || "QuickHomeLoan"}
                                                </span>
                                                <span className="text-[13px] text-gray-500">{datePart}</span>
                                                <span className="text-[13px] text-gray-500 mt-0.5">{timePart}</span>
                                            </div>
                                        </div>

                                        {/* TITLE */}
                                        <h2 className="text-[19px] font-bold text-gray-900 mb-3 leading-snug tracking-tight">
                                            {item.title}
                                        </h2>

                                        {/* IMAGE */}
                                        <div className="w-full h-[220px] sm:h-[280px] rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                                            <img
                                                src={getImageUrl(item)}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* ACTION BAR */}
                                        <div className="flex justify-between items-center px-1 pt-1">
                                            <div className="flex gap-6">
                                                <div className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                                                    <Heart size={20} strokeWidth={1.5} />
                                                    <span className="text-[14px] font-medium">{item.likes || 120}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                                                    <MessageCircle size={20} strokeWidth={1.5} />
                                                    <span className="text-[14px] font-medium">{item.comment_count || 12}</span>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 hover:text-gray-900 transition-colors">
                                                <Bookmark size={20} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
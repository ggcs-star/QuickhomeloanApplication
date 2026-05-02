import { useEffect, useState } from "react";
import newsApi from "@/newsApi";
import CategorySlider from "./News/CategorySlider";
import PostCard from "./News/PostCard";
import PostsSlider from "./News/PostsSlider";

export default function TrendingNews() {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    /* ---------- FETCH DATA ---------- */
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, postRes] = await Promise.all([
                newsApi.getCategories(),
                newsApi.getPosts(),
            ]);

            setCategories(catRes?.data?.categories || []);
            setPosts(postRes?.data?.posts || []);

            // Check if user previously selected a category
            const savedCategory = sessionStorage.getItem("activeCategory");
            if (savedCategory) {
                setActiveCategory(savedCategory);
            }
        } catch (error) {
            console.error("Error fetching trending news:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- FILTER POSTS ---------- */
    useEffect(() => {
        if (activeCategory === "ALL") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter(
                    (p) => String(p.category_id) === String(activeCategory)
                )
            );
        }
    }, [activeCategory, posts]);

    /* ---------- CATEGORY CHANGE ---------- */
    const handleCategoryChange = (id) => {
        sessionStorage.setItem("activeCategory", id);
        setActiveCategory(id);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#1e293b]">
                Trending News
            </h2>

            {/* Category Slider Component */}
            <div className="-mx-4 sm:mx-0 px-4 sm:px-0">
                <CategorySlider
                    categories={categories}
                    active={activeCategory}
                    onChange={handleCategoryChange}
                />
            </div>

            {/* Content Section */}
            <div className="mt-6 md:mt-8">
                {loading ? (
                    /* Skeleton Loader */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 p-2.5 md:p-3 h-[280px] md:h-[320px] shadow-sm animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    /* No Posts State */
                    <div className="h-40 flex items-center justify-center text-sm md:text-base text-gray-500 bg-gray-50 rounded-[20px] border border-gray-100">
                        No posts found in this category
                    </div>
                ) : filteredPosts.length <= 3 ? (
                    /* GRID VIEW (If posts are 3 or less) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    /* SLIDER VIEW (If posts are more than 3) */
                    <div className="-mx-4 sm:mx-0 px-4 sm:px-0 ">
                        <PostsSlider posts={filteredPosts} />
                    </div>
                )}
            </div>
        </div>
    );
}
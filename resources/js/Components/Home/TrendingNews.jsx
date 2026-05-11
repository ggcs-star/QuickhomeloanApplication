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

            const savedCategory =
                sessionStorage.getItem("activeCategory");

            if (savedCategory) {
                setActiveCategory(savedCategory);
            }
        } catch (error) {
            console.error("Error fetching trending news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeCategory === "ALL") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(
                posts.filter(
                    (p) =>
                        String(p.category_id) ===
                        String(activeCategory)
                )
            );
        }
    }, [activeCategory, posts]);

    const handleCategoryChange = (id) => {
        sessionStorage.setItem("activeCategory", id);
        setActiveCategory(id);
    };

return (
    <section className="w-full mt-6 overflow-hidden">
        {/* HEADER */}
        <div className="px-4 sm:px-5 flex items-center justify-between mb-4">
            <h2
                className="
                    text-[20px]
                    sm:text-[24px]
                    font-bold
                    text-[#0f172a]
                "
            >
                Trending News
            </h2>
        </div>

        {/* CATEGORY SLIDER */}
        <div className="px-4 sm:px-5">
            <CategorySlider
                categories={categories}
                active={activeCategory}
                onChange={handleCategoryChange}
            />
        </div>

        {/* CONTENT */}
        <div className="mt-5 px-4 sm:px-5">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="
                                bg-white
                                rounded-[20px]
                                border
                                border-gray-100
                                h-[250px]
                                animate-pulse
                            "
                        />
                    ))}
                </div>
            ) : filteredPosts.length === 0 ? (
                <div
                    className="
                        h-32
                        flex
                        items-center
                        justify-center
                        text-sm
                        text-gray-500
                        bg-gray-50
                        rounded-[18px]
                        border
                        border-gray-100
                    "
                >
                    No posts found in this category
                </div>
            ) : filteredPosts.length <= 3 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
           <div className="w-full">
    <PostsSlider posts={filteredPosts} />
</div>
            )}
        </div>
    </section>
);
}
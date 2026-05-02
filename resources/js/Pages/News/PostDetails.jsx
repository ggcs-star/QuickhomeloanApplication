import React, { useEffect, useState } from "react";
import {
    ArrowLeft, Calendar, Eye, Share2, Bookmark, MessageCircle
} from "lucide-react";
import newsApi from "@/newsApi";
import AppLayout from "@/Layouts/AppLayout"; // AppLayout इम्पोर्ट किया गया है

const IMAGE_BASE_URL = "https://news.quickhomeloan.in/";

export default function PostDetails({ slug }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- FETCH POST DETAILS ---------- */
    useEffect(() => {
        // Fallback for demo purposes. Ensure `slug` prop is passed correctly from your router.
        const currentSlug = slug || "home-loan-for-women-2026-benefits";

        const fetchPostDetails = async () => {
            try {
                // If your newsApi has a getPostDetails method, use that. Otherwise use fetch.
                const json = await newsApi.getPostDetails(currentSlug);
                if (json.status && json.data) {
                    setPost(json.data);
                }
            } catch (error) {
                console.error("Error fetching post details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [slug]);

    /* ---------- HELPER FUNCTIONS ---------- */
    const goBack = () => {
        window.history.back();
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/images/Home/news-default-big.png";
        return imagePath.startsWith("http") ? imagePath : `${IMAGE_BASE_URL}${imagePath}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /* ---------- SKELETON LOADER ---------- */
    if (loading) {
        return (
            <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
                <div className="min-h-screen bg-[#f8fafc]">
                    <div className="max-w-[640px] mx-auto bg-white min-h-screen sm:border-x border-gray-200">

                        {/* Fake Header */}
                        <div className="px-4 h-14 flex items-center justify-between border-b border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="px-4 sm:px-6 pt-6">
                            {/* Category Badge Skeleton */}
                            <div className="w-24 h-7 bg-gray-200 rounded-md mb-4 animate-pulse"></div>

                            {/* Title Skeleton */}
                            <div className="space-y-3 mb-6">
                                <div className="h-8 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-4/5 animate-pulse"></div>
                            </div>

                            {/* Author Meta Skeleton */}
                            <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 animate-pulse"></div>
                                <div className="space-y-2 w-full">
                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                    <div className="flex gap-4">
                                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Skeleton */}
                            <div className="w-full h-[250px] sm:h-[350px] bg-gray-200 rounded-2xl mb-8 animate-pulse"></div>

                            {/* Content Skeleton */}
                            <div className="space-y-4 mb-8">
                                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-11/12 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-10/12 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!post) {
        return (
            <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Post not found</h2>
                    <button onClick={goBack} className="text-blue-600 font-semibold hover:underline">
                        Go back to News
                    </button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <div className="bg-[#f8fafc] min-h-screen pb-24">
                <div className="max-w-[640px] mx-auto bg-white sm:border-x border-gray-200 min-h-screen relative shadow-sm">

                    {/* TOP NAVIGATION */}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100">
                        <div className="px-4 h-14 flex items-center justify-between">
                            <button
                                onClick={goBack}
                                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div className="flex items-center gap-2 text-gray-600">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Share2 size={20} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Bookmark size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <article className="px-4 sm:px-6 pt-6">
                        {/* HEADER SECTION */}
                        <header className="mb-6">
                            <div
                                className="inline-block px-3 py-1 rounded-md text-[13px] font-bold tracking-wide uppercase mb-4"
                                style={{
                                    backgroundColor: post.category_color ? `${post.category_color}15` : '#eff6ff',
                                    color: post.category_color || '#3b82f6'
                                }}
                            >
                                {post.category_name}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.3] mb-6 tracking-tight">
                                {post.title}
                            </h1>

                            {/* META INFO */}
                            <div className="flex flex-wrap items-center justify-between gap-y-4 border-y border-gray-100 py-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <img
                                            src={post.author_image || "/images/default-avatar.jpg"}
                                            alt={post.author_username || "Author"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/images/default-avatar.jpg";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                                            {post.author_username || "QuickHomeLoan"}
                                        </p>
                                        <div className="flex items-center gap-3 text-[13px] text-gray-500 mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} /> {formatDate(post.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} /> {post.pageviews || 0} Views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* FEATURED IMAGE */}
                        <div className="w-full rounded-[20px] overflow-hidden mb-8 bg-gray-50 shadow-sm border border-gray-100">
                            <img
                                src={getImageUrl(post.image_big || post.image_default)}
                                alt={post.title}
                                className="w-full h-auto object-cover max-h-[400px]"
                            />
                        </div>

                        {/* SUMMARY (Highlight) */}
                        {post.summary && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-8">
                                <p className="text-[16px] text-blue-900 font-medium leading-relaxed italic">
                                    {post.summary}
                                </p>
                            </div>
                        )}

                        {/* MAIN HTML CONTENT (Rich Text Styling) */}
                        <div
                            className="
                                text-gray-800 text-[16px] sm:text-[18px] leading-[1.8] font-serif
                                [&>p]:mb-6
                                [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-4
                                [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-3
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:pl-1
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                                [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full [&>img]:border [&>img]:border-gray-100
                                [&>strong]:text-gray-900
                                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
                            "
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* TAGS / KEYWORDS */}
                        {post.keywords && (
                            <div className="mt-12 pt-6 border-t border-gray-100 mb-8">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Related Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {post.keywords.split('  ').map((keyword, index) => {
                                        const cleanTag = keyword.trim();
                                        if (!cleanTag) return null;
                                        return (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                #{cleanTag.replace(/\s+/g, '')}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* FLOATING ACTION BAR (Mobile & Desktop) */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
                        <div className="flex justify-between items-center max-w-[640px] mx-auto px-2">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-full"><Eye size={20} /></div>
                                    <span className="text-sm font-semibold">{post.pageviews}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                    <div className="p-2 bg-gray-50 rounded-full"><MessageCircle size={20} /></div>
                                    <span className="text-sm font-semibold">{post.comment_count || 0}</span>
                                </button>
                            </div>
                            <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-blue-600 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
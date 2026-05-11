import { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, X } from "lucide-react";
import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await api.get('/user');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }, []);

    const fetchPosts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/community/posts?page=${page}`);
            const postsData = response.data.data.data || response.data.data || [];
            setPosts(postsData);
            
            if (response.data.data) {
                setCurrentPage(response.data.data.current_page || page);
                setLastPage(response.data.data.last_page || 1);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
        fetchPosts(1);
    }, [fetchCurrentUser, fetchPosts]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/community/posts', { content: newPostContent });
            setNewPostContent('');
            await fetchPosts(1);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/community/posts/${postId}/like`);
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        is_liked_by_user: response.data.data.liked,
                        likes_count: response.data.data.likes_count
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleSave = async (postId) => {
        try {
            const response = await api.post(`/community/posts/${postId}/save`);
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return { ...post, is_saved_by_user: response.data.data.saved };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const handleShare = async (postId) => {
        try {
            const response = await api.post(`/community/posts/${postId}/share`);
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return { ...post, shares_count: response.data.data.shares_count };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const openCommentModal = async (post) => {
        try {
            const response = await api.get(`/community/posts/${post.id}`);
            const freshPost = response.data.data.post;
            freshPost.comments = response.data.data.comments || [];
            setSelectedPost(freshPost);
            setCommentInput('');
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const closeCommentModal = () => {
        setSelectedPost(null);
        setCommentInput('');
    };  

    const handleAddComment = async () => {
        if (!commentInput.trim() || !selectedPost) return;

        setSubmittingComment(true);

        try {
            const response = await api.post('/community/comments', {
                post_id: selectedPost.id,
                comment: commentInput
            });

            const newComment = response.data.data;

            setPosts(prev => prev.map(post => {
                if (post.id === selectedPost.id) {
                    const updatedComments = [
                        ...(post.comments || []),
                        newComment
                    ];
                    return {
                        ...post,
                        comments: updatedComments,
                        comments_count: (post.comments_count || 0) + 1
                    };
                }
                return post;
            }));

            setSelectedPost(prev => ({
                ...prev,
                comments: [...(prev.comments || []), newComment],
                comments_count: (prev.comments_count || 0) + 1
            }));

            setCommentInput('');

        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const toggleExpandComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    if (loading) {
        return (
            <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
                <div className="min-h-screen bg-white">
                    <div className="max-w-[640px] mx-auto bg-white min-h-screen">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-48 mb-3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
            <div className="min-h-screen bg-white">
                <div className="max-w-[640px] mx-auto bg-white min-h-screen pb-20">
                    {/* Header */}
                    <div className="px-4 py-3 sticky top-0 bg-white z-20 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => window.history.back()} 
                                className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                                <p className="text-sm text-gray-500 mt-0.5">100 members • 50 online</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Create Post - Instagram Style */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">
                                    {(currentUser?.full_name?.[0] || 'U').toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="flex-1 p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
                                />
                                <button
                                    onClick={handleCreatePost}
                                    disabled={submitting || !newPostContent.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-full font-medium disabled:opacity-50 disabled:bg-gray-400 whitespace-nowrap"
                                >
                                    {submitting ? '...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white">
                                <div className="p-4">
                                    {/* Post Header */}
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-sm">
                                                {(post.user_name?.[0] || 'U').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {post.user_name || 'User'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    • {formatTime(post.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-800 text-sm mt-1 leading-relaxed">
                                                {post.content}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-around mt-3 pt-1">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition ${
                                                post.is_liked_by_user ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                            }`}
                                        >
                                            <Heart size={22} fill={post.is_liked_by_user ? 'currentColor' : 'none'} strokeWidth={1.5} />
                                            <span className="text-xs font-medium">{post.likes_count || 0}</span>
                                        </button>

                                        <button onClick={() => openCommentModal(post)} className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-gray-500 hover:text-blue-500 transition">
                                            <MessageCircle size={22} strokeWidth={1.5} />
                                            <span className="text-xs font-medium">{post.comments_count || 0}</span>
                                        </button>

                                        <button onClick={() => handleShare(post.id)} className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-gray-500 hover:text-green-500 transition">
                                            <Share2 size={22} strokeWidth={1.5} />
                                            <span className="text-xs font-medium">{post.shares_count || 0}</span>
                                        </button>

                                        <button onClick={() => handleSave(post.id)} className={`py-1.5 px-3 rounded-full transition ${post.is_saved_by_user ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}>
                                            <Bookmark size={22} fill={post.is_saved_by_user ? 'currentColor' : 'none'} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    {/* Comments Preview */}
                                    {post.comments && post.comments.length > 0 && (
                                        <div className="mt-2 pt-1">
                                            <div className="space-y-1.5">
                                                {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((comment) => (
                                                    <div key={comment._id} className="flex gap-1 text-sm">
                                                        <span className="font-medium text-gray-800 text-xs flex-shrink-0">{comment.user_name}:</span>
                                                        <span className="text-gray-600 text-xs break-words">{comment.comment}</span>
                                                        {comment.is_admin_reply && (
                                                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">Admin</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {(post.comments_count || 0) > 2 && (
                                                <button onClick={() => toggleExpandComments(post.id)} className="text-xs text-gray-400 mt-1 font-medium">
                                                    {expandedComments[post.id] ? 'Show less' : `View all ${post.comments_count} comments`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {posts.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={36} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800">No posts yet</h3>
                            <p className="text-sm text-gray-500 text-center mt-1">Be the first to share something with the community!</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="flex justify-center items-center gap-2 py-6 px-4">
                            <button
                                onClick={() => {
                                    if (currentPage > 1) {
                                        fetchPosts(currentPage - 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Previous
                            </button>
                            
                            <div className="flex gap-1">
                                {[...Array(Math.min(5, lastPage))].map((_, i) => {
                                    let pageNum;
                                    if (lastPage <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= lastPage - 2) {
                                        pageNum = lastPage - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => {
                                                fetchPosts(pageNum);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                                                currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => {
                                    if (currentPage < lastPage) {
                                        fetchPosts(currentPage + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                disabled={currentPage === lastPage}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    currentPage === lastPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Comment Modal */}
                    {selectedPost && (
                        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center">
                            <div className="bg-white w-full max-w-[640px] rounded-t-2xl max-h-[80vh] flex flex-col animate-slideUp z-[101]">
                                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold">Comments</h2>
                                    <button onClick={closeCommentModal} className="p-1 rounded-full hover:bg-gray-100">
                                        <X size={22} />
                                    </button>
                                </div>

                                <div className="p-4 border-b border-gray-100 flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-xs">{(selectedPost.user_name?.[0] || 'U').toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-gray-900 text-sm">{selectedPost.user_name || 'User'}</span>
                                            <span className="text-xs text-gray-400">• {formatTime(selectedPost.created_at)}</span>
                                        </div>
                                        <p className="text-gray-800 text-sm mt-1">{selectedPost.content}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {selectedPost.comments && selectedPost.comments.length > 0 ? (
                                        selectedPost.comments.map((comment) => (
                                            <div key={comment._id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gray-600 font-bold text-xs">{(comment.user_name?.[0] || 'U').toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-900 text-sm">{comment.user_name}</span>
                                                        {comment.is_admin_reply && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">Admin</span>}
                                                        <span className="text-xs text-gray-400">{formatTime(comment.created_at)}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm mt-0.5">{comment.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm">No comments yet. Be the first to comment!</div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                                    <div className="flex gap-2">
                                        <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Add a comment..." className="flex-1 p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500" onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} autoFocus />
                                        <button onClick={handleAddComment} disabled={submittingComment || !commentInput.trim()} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-full font-medium disabled:opacity-50 disabled:bg-gray-400">{submittingComment ? '...' : 'Post'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
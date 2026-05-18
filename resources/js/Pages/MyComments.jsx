import React, { useEffect, useState } from "react";
import PageSkeleton from "@/components/Skeleton/PageSkeleton";
import {
  ArrowLeft,
  MessageCircle
} from "lucide-react";

import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

function MyCommentsContent() {

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsRes = await api.get("/community/my-comments");
      const commentsData = commentsRes.data.data.data;

      const postsRes = await api.get("/community/posts");
      const postsData = postsRes.data.data.data;

      const updatedComments = commentsData.map((comment) => {
        const matchedPost = postsData.find(
          (post) => String(post._id || post.id) === String(comment.post_id)
        );
        return {
          ...comment,
          post_data: matchedPost || null
        };
      });

      setComments(updatedComments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageSkeleton>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[28px] border border-[#edf1f7] shadow-sm p-5">
              <div className="space-y-3">
                <div className="bg-[#f5f7fd] border border-[#edf1f7] rounded-xl p-3">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageSkeleton>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fd]">

      {/* HEADER - Same as My Posts */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
          </button>
          <div>
            <h1 className="text-[24px] font-black tracking-[-0.5px] text-[#081c4b] leading-tight">
              My Comments
            </h1>
            <p className="text-[12px] text-gray-500 mt-[2px]">
              Your community activity
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-5">

        {!loading && comments.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#edf1f7]">
            <h3 className="font-semibold text-gray-700 text-lg">
              No Comments Found
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Your comments will appear here
            </p>
          </div>
        )}

        {comments.map((comment, index) => (
          <div key={comment._id || comment.id || index} className="bg-white rounded-[28px] border border-[#edf1f7] shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="space-y-4">
                
                {/* Original Post */}
                <div className="bg-[#f5f7fd] border border-[#edf1f7] rounded-xl p-4">
                  <p className="text-[11px] text-gray-500 mb-2 font-medium">Commented On Post</p>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#001B5E] flex items-center justify-center text-xs font-bold text-white">
                        {comment.post_data?.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#081c4b]">
                          {comment.post_data?.user_name || "Unknown User"}
                        </p>
                        <p className="text-[10px] text-gray-400">Original Post</p>
                      </div>
                    </div>
                    <p className="text-[14px] text-gray-700 leading-6 line-clamp-3">
                      {comment.post_data?.content || "Post not found"}
                    </p>
                  </div>
                </div>

                {/* My Comment */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f5f7fd] flex items-center justify-center">
                    <MessageCircle size={18} className="text-[#001B5E]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#081c4b] leading-relaxed">
                      {comment.comment}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default function MyComments() {
  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      <MyCommentsContent />
    </AppLayout>
  );
}
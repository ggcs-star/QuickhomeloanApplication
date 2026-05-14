import React, { useEffect, useState } from "react";
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

  try {

    // COMMENTS
    const commentsRes = await api.get(
      "/community/my-comments"
    );

    const commentsData =
      commentsRes.data.data.data;

    // POSTS
    const postsRes = await api.get(
      "/community/posts"
    );

    const postsData =
      postsRes.data.data.data;
      console.log("POSTS", postsData);
console.log("COMMENTS", commentsData);

    // MERGE
    const updatedComments =
      commentsData.map((comment) => {

       const matchedPost =
  postsData.find(
    (post) =>
      String(post._id || post.id) ===
      String(comment.post_id)
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

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      {/* HEADER */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b sticky top-0 z-10">

        <ArrowLeft
          className="w-5 h-5 cursor-pointer"
          onClick={() => window.history.back()}
        />

        <h1 className="text-lg font-semibold">
          My Comments
        </h1>

      </div>

      {/* BODY */}
      <div className="p-4 space-y-4">

        {loading && (
          <div className="text-center text-gray-500 mt-10">
            Loading...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No Comments Found
          </div>
        )}

        {comments.map((comment, index) => (

          <div
            key={comment._id || comment.id || index}
            className="bg-white rounded-2xl p-4 border shadow-sm"
          >

            {/* COMMENT */}
            <div className="space-y-3">

  {/* POST INFO */}
  <div className="bg-gray-50 border rounded-xl p-3">

    <p className="text-xs text-gray-500 mb-1">
      Commented On Post
    </p>
<div>

  <div className="flex items-center gap-2 mb-2">

    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
      {
        comment.post_data?.user_name
          ?.charAt(0)
          ?.toUpperCase()
      }
    </div>

    <div>

      <p className="text-[13px] font-semibold text-gray-800">
        {
          comment.post_data?.user_name ||
          "Unknown User"
        }
      </p>

      <p className="text-[11px] text-gray-400">
        Original Post
      </p>

    </div>

  </div>

  <p className="text-[14px] text-gray-800 leading-6 line-clamp-3">
    {
      comment.post_data?.content ||
      "Post not found"
    }
  </p>

</div>

  </div>

  {/* COMMENT */}
  <div className="flex items-start gap-3">

    <div className="bg-blue-100 p-3 rounded-full">

      <MessageCircle
        size={18}
        className="text-blue-600"
      />

    </div>

    <div className="flex-1">

      <p className="text-[15px] font-medium text-gray-800">
        {comment.comment}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(
          comment.created_at
        ).toLocaleString()}
      </p>

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
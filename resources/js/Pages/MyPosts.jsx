import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

function MyPostsContent() {

  const [posts, setPosts] = useState([]);
  const [postDetails, setPostDetails] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {

    try {

      const res = await api.get(
        "/community/my-posts"
      );

      const postsData =
        res.data.data.data;

      setPosts(postsData);

      const details = {};

      await Promise.all(

        postsData.map(async (post) => {

          try {

            const detailRes =
              await api.get(
                `/community/posts/${post._id || post.id}`
              );

            details[
              post._id || post.id
            ] = detailRes.data.data;

          } catch (err) {

            console.log(err);

          }

        })

      );

      setPostDetails(details);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#f4f7fb]">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">

        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">

          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div>

            <h1 className="text-[20px] font-bold text-gray-900">
              My Posts
            </h1>

            <p className="text-xs text-gray-500">
              Your community activity
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-5">

        {loading && (

          <div className="text-center py-20 text-gray-500">
            Loading posts...
          </div>

        )}

        {!loading && posts.length === 0 && (

          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">

            <h3 className="font-semibold text-gray-700 text-lg">
              No Posts Found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Your community posts will appear here
            </p>

          </div>

        )}

        {posts.map((post, index) => (

          <div
            key={post._id || post.id || index}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
          >

            <div className="p-5">

              {/* USER */}
              <div className="flex items-center gap-3">

                <img
                  src={
                    post.user_photo ||
                    "/images/default-avatar.jpg"
                  }
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-[15px] text-gray-900 truncate">
                    {post.user_name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(
                      post.created_at
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

              {/* CONTENT */}
              <div className="mt-4">

                <p className="text-[15px] leading-7 text-gray-800 whitespace-pre-line">
                  {post.content}
                </p>

              </div>

              {/* IMAGE */}
              {post.image && (

                <div className="mt-4">

                  <img
                    src={post.image}
                    alt=""
                    className="w-full rounded-3xl object-cover max-h-[420px]"
                  />

                </div>

              )}

              {/* STATS */}
              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">

                {/* LIKES */}
                <div className="flex items-center gap-2 text-gray-600">

                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                    <Heart
                      size={18}
                      className="text-red-500"
                    />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      {post.likes_count || 0}
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Likes
                    </p>

                  </div>

                </div>

                {/* COMMENTS */}
                <button
                  onClick={() =>
                    setOpenComments((prev) => ({
                      ...prev,
                      [post._id || post.id]:
                        !prev[post._id || post.id]
                    }))
                  }
                  className="flex items-center gap-2 text-gray-600"
                >

                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <MessageCircle
                      size={18}
                      className="text-blue-500"
                    />
                  </div>

                  <div className="text-left">

                    <p className="text-sm font-semibold">
                      {post.comments_count || 0}
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Comments
                    </p>

                  </div>

                  {openComments[
                    post._id || post.id
                  ] ? (
                    <ChevronUp
                      size={18}
                      className="ml-1 text-gray-400"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="ml-1 text-gray-400"
                    />
                  )}

                </button>

              </div>

              {/* LIKES USERS */}
              {postDetails[
                post._id || post.id
              ]?.likes_users?.length > 0 && (

                <div className="mt-5">

                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    Liked By
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {postDetails[
                      post._id || post.id
                    ]?.likes_users.map((user, i) => (

                      <div
                        key={i}
                        className="px-3 py-2 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-100"
                      >
                        {user.user_name}
                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

            {/* COMMENTS SECTION */}
            {openComments[
              post._id || post.id
            ] &&
            postDetails[
              post._id || post.id
            ]?.comments?.length > 0 && (

              <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-5">

                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Comments
                </h4>

                <div className="space-y-3">

                  {postDetails[
                    post._id || post.id
                  ]?.comments.map((comment, i) => (

                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 border border-gray-100"
                    >

                      <div className="flex items-start gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">

                          {
                            comment.user_name
                              ?.charAt(0)
                              ?.toUpperCase()
                          }

                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-3">

                            <h5 className="text-[14px] font-semibold text-gray-900 truncate">
                              {comment.user_name}
                            </h5>

                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {new Date(
                                comment.created_at
                              ).toLocaleDateString()}
                            </span>

                          </div>

                          <p className="text-[14px] text-gray-700 leading-6 mt-2 break-words">
                            {comment.comment}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default function MyPosts() {
  return (
    <AppLayout
      showTopNav={false}
      showBottomNav={false}
    >
      <MyPostsContent />
    </AppLayout>
  );
}
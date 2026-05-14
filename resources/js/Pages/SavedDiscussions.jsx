import React, {
  useEffect,
  useState
} from "react";

import {
  Heart,
  MessageCircle,
  Bookmark
} from "lucide-react";

import api from "@/api";

import AppLayout from "@/Layouts/AppLayout";

export default function SavedDiscussions() {

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [openComments, setOpenComments] =
    useState({});

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {

    try {

      // SAVED POSTS
      const savedRes = await api.get(
        "/community/saved"
      );

      const savedPosts =
        savedRes?.data?.data?.data || [];

      // ALL POSTS
      const postsRes = await api.get(
        "/community/posts"
      );

      const allPosts =
        postsRes?.data?.data?.data || [];

      // MERGE POSTS
      const mergedPosts =
        savedPosts.map((savedPost) => {

          const matchedPost =
            allPosts.find(
              (post) =>
                String(post._id || post.id) ===
                String(savedPost._id || savedPost.id)
            );

          return {
            ...(matchedPost || savedPost),

            comments:
              matchedPost?.comments ||
              savedPost?.comments ||
              []
          };
        });

      setPosts(mergedPosts);

    } catch (error) {

      console.log(
        "Saved discussions error",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  const toggleComments = (postId) => {

    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <AppLayout>

      <div className="p-4 pb-24">

        <h1 className="text-2xl font-bold mb-5">
          Saved Discussions
        </h1>

        {loading ? (

          <p className="text-gray-500">
            Loading...
          </p>

        ) : posts.length === 0 ? (

          <p className="text-gray-500">
            No saved discussions
          </p>

        ) : (

          <div className="space-y-4">

            {posts.map((post, index) => {

              const postId =
                post._id || post.id || index;

              return (

                <div
                  key={postId}
                  className="bg-white border rounded-2xl p-4 shadow-sm"
                >

                  {/* USER */}
                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">

                      {
                        post.user_name
                          ?.charAt(0)
                          ?.toUpperCase()
                      }

                    </div>

                    <div>

                      <p className="font-semibold">
                        {
                          post.user_name ||
                          "User"
                        }
                      </p>

                      <p className="text-xs text-gray-400">

                        {
                          post.created_at
                            ? new Date(
                                post.created_at
                              ).toLocaleDateString()
                            : ""
                        }

                      </p>

                    </div>

                  </div>

                  {/* CONTENT */}
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">

                    {
                      post.content ||
                      "No content"
                    }

                  </p>

                  {/* STATS */}
                  <div className="flex items-center gap-5 text-sm text-gray-500">

                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      {post.likes_count || 0}
                    </div>

                    {/* COMMENT BUTTON */}
                    <button
                      onClick={() =>
                        toggleComments(postId)
                      }
                      className="flex items-center gap-1"
                    >

                      <MessageCircle size={16} />

                      {post.comments_count || 0}

                    </button>

                    <div className="flex items-center gap-1">
                      <Bookmark size={16} />
                      {post.saved_count || 0}
                    </div>

                  </div>

                  {/* COMMENTS */}
                  {openComments[postId] &&
                    post.comments &&
                    post.comments.length > 0 && (

                    <div className="border-t pt-3 mt-4 space-y-3">

                      <h3 className="text-sm font-semibold text-gray-700">

                        Comments

                      </h3>

                      {post.comments.map(
                        (comment, commentIndex) => (

                        <div
                          key={
                            comment._id ||
                            comment.id ||
                            commentIndex
                          }
                          className="bg-gray-50 rounded-xl p-3"
                        >

                          {/* COMMENT USER */}
                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-600">

                              {
                                comment.user_name
                                  ?.charAt(0)
                                  ?.toUpperCase()
                              }

                            </div>

                            <div>

                              <p className="text-sm font-medium">

                                {
                                  comment.user_name ||
                                  "User"
                                }

                              </p>

                              <p className="text-xs text-gray-400">

                                {
                                  comment.created_at
                                    ? new Date(
                                        comment.created_at
                                      ).toLocaleDateString()
                                    : ""
                                }

                              </p>

                            </div>

                          </div>

                          {/* COMMENT TEXT */}
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">

                            {
                              comment.comment ||
                              ""
                            }

                          </p>

                          {/* COMMENT STATS */}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">

                            <div className="flex items-center gap-1">

                              <Heart size={13} />

                              {
                                comment.likes_count || 0
                              }

                            </div>

                          </div>

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

    </AppLayout>
  );
}
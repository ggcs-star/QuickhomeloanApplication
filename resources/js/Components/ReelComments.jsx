import { useEffect, useState } from "react";
import api from "@/api";

export default function ReelComments({ reelId, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/reels/comment/${reelId}`);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await api.post(`/reels/comment/${reelId}`, {
        comment: text,
      });

      setText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end "
      onClick={onClose} // ✅ outside click close
    >
      {/* Bottom Sheet */}
      <div
        className="w-full bg-white rounded-t-3xl h-[75%] flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()} // ✅ prevent inside click close
      >

        {/* DRAG HANDLE */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2" />

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">Comments</h3>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* 🔥 SKELETON */}
          {loading &&
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-1/4" />
                  <div className="h-3 bg-gray-300 rounded w-3/4" />
                </div>
              </div>
            ))}

          {/* COMMENTS */}
          {!loading && comments.length > 0 && comments.map((c, i) => (
            <div key={i} className="flex gap-3">

              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 
              rounded-full flex items-center justify-center text-white text-sm font-semibold uppercase">
                {c.user_name?.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1">

                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {c.user_name}
                  </p>
                  <span className="text-xs text-gray-400">
                    {c.time_ago}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {c.comment}
                </p>

              </div>
            </div>
          ))}

          {/* ❗ Empty State */}
          {!loading && comments.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">
              No comments yet. Be the first to comment 🚀
            </p>
          )}

        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2 bg-white mb-7">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 rounded-full text-sm font-medium active:scale-95 transition"
          >
            Send
          </button>
        </div>

      </div>

      {/* Animation */}
      <style jsx>{`
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
    `}</style>
    </div>
  );
}
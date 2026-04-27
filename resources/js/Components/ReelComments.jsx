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
    if (!text) return;

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
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[70%] z-50 flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Comments</h3>
        <button onClick={onClose}>✖</button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {loading && <p>Loading...</p>}

        {comments.map((c, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm">{c.comment}</p>
          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write comment..."
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}
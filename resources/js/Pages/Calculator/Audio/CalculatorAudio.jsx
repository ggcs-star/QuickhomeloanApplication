import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import api from "@/api"; // ✅ use your axios instance

export default function CalculatorAudio() {
  const { slug } = usePage().props;
console.log("Received slug:", slug); // ✅ DEBUG    
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchAudio();
  }, [slug]);

  const fetchAudio = async () => {
    try {
      setLoading(true);

      
      const res = await api.get(
        `/calculator-media/${slug}`,
        {
          params: { type: "audio" }, 
        }
      );

      if (res.data?.status) {
        setData(res.data.data || []);
      }
console.log("API Response:", res.data); // ✅ DEBUG
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-5">

      {/* TITLE */}
      <h1 className="text-lg font-semibold mb-4 capitalize text-gray-800">
        {slug.replace(/_/g, " ")}
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Loading audio...</p>
      )}

      {/* AUDIO LIST */}
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200 flex gap-3 items-center"
          >
            {/* THUMB */}
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />

            {/* CONTENT */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {item.title}
              </p>

              <p className="text-xs text-gray-500">
                {item.description}
              </p>
            </div>

            {/* PLAY */}
            <button
              onClick={() => window.open(item.file_url, "_blank")}
              className="bg-black text-white px-3 py-1 rounded text-xs active:scale-95"
            >
              Play
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">
          No audio available
        </p>
      )}

    </div>
  );
}
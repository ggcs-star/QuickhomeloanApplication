import { useEffect, useState } from "react";
import api from "@/api";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";
import AppLayout from "../Layouts/AppLayout";
import { router } from "@inertiajs/react";
export default function AudioBriefings() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/education/audio");
      setModules(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDuration = (contents) => {
    return contents.reduce((sum, item) => {
      return sum + parseInt(item.duration || 0);
    }, 0);
  };

  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      <div className="px-4 py-5 bg-gray-100 min-h-screen space-y-5">

        {/* Header */}

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-200 active:scale-95 transition"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            Audio Briefings
          </h2>
        </div>

        {/* 🔥 Skeleton Loader */}
        {loading &&
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="w-full h-40 bg-gray-200" />

              <div className="border-t mx-4"></div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>

                <div className="flex justify-end">
                  <div className="h-8 w-24 bg-gray-300 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}

        {/* ✅ Real Data */}
        {!loading &&
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            >
              <div className="w-full h-40 bg-gray-50 overflow-hidden rounded-t-2xl">
                <img
                  src={module.image_url}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="border-t mx-4"></div>

              {/* Bottom */}
              <div className="flex items-center justify-between p-4">

                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    {module.title}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen size={16} />
                    {module.contents.length} lessons
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={16} />
                    Total: {getTotalDuration(module.contents)} min
                  </div>
                </div>

                <button
                  className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-sm font-medium"
                  onClick={() => router.visit(`/education/audio-details?id=${module.id}`)}
                >
                  Listen Now
                </button>

              </div>
            </div>
          ))}

      </div>
    </AppLayout>
  );
}
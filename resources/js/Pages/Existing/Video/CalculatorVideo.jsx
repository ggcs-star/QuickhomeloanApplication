import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft, Play, Pause, Clock, Eye } from "lucide-react";
import api from "@/api";
import { useGlobalVideo } from "@/Context/GlobalVideoContext";
import GlobalMiniVideoPlayer from "@/Components/GlobalMiniVideoPlayer";
import { useAuth } from "@/Context/AuthContext";
import ProUpgradeBanner from "@/Components/Common/ProUpgradeBanner";
export default function CalculatorVideo() {
  const { slug } = usePage().props;

  const {
    currentVideo,
    isPlaying,
    progress,
    playVideo,
    togglePlay,
    setVideoList,
    setCurrentIndex,
  } = useGlobalVideo();
  const { isProUser } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchVideos();
  }, [slug]);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/calculator-media/${slug}`, {
        params: { type: "video" },
      });

      if (res.data?.status) {
        setData(res.data.data || []);
        setVideoList(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PLAY HANDLER ================= */
  const handlePlay = (item, index) => {
    if (!isProUser) {
      router.visit("/membership");
      return;
    }

    playVideo(item, data, index);
    setVideoList(data);
    setCurrentIndex(index);
  };

  const handleToggle = (e, item, index) => {
    e.stopPropagation();

    if (!isProUser) {
      router.visit("/membership");
      return;
    }

    if (currentVideo?.id === item.id) {
      togglePlay();
    } else {
      handlePlay(item, index);
    }
  };

  const openFullPlayer = () => {
    router.visit("/video-player");
  };

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-5 pb-28">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <ArrowLeft
          className="text-gray-700 cursor-pointer"
          onClick={() => window.history.back()}
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Visual Guides
        </h1>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-5">
        {!isProUser && (
          <ProUpgradeBanner

          />
        )}
        {(loading ? Array.from({ length: 3 }) : data).map((item, index) => {
          const isActive = currentVideo?.id === item?.id;

          return (
            <div
              key={index}
              onClick={() => {
                if (loading) return;

                if (!isProUser) {
                  router.visit("/membership");
                  return;
                }

                handlePlay(item, index);
              }}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 transition
    ${isActive ? "ring-2 ring-blue-500" : ""}
    ${!isProUser ? "opacity-80" : ""}
  `}
            >

              {/* IMAGE */}
              <div className="relative">

                {loading ? (
                  <div className="h-44 bg-gray-200 animate-pulse" />
                ) : (
                  <img
                    src={item.thumbnail_url}
                    className={`w-full h-44 object-cover ${!isProUser ? "blur-[2px] brightness-75" : ""
                      }`}
                  />
                )}

                {/* PLAY BUTTON */}
                {!loading && (
                  <button
                    onClick={(e) => handleToggle(e, item, index)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className={`p-4 rounded-full
      ${isProUser ? "bg-black/70" : "bg-gray-400/70"}
    `}
                    >
                      {isActive && isPlaying ? (
                        <Pause className="text-white" size={24} />
                      ) : (
                        <Play className="text-white" size={24} />
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">

                {loading ? (
                  <>
                    <div className="h-4 bg-gray-200 w-2/3 rounded mb-3 animate-pulse" />
                    <div className="h-3 bg-gray-100 w-full rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <h3
                      className={`font-semibold text-[15px] ${isActive ? "text-blue-600" : "text-gray-800"
                        }`}
                    >
                      {item.title}
                    </h3>

                    {/* META */}
                    <div className="flex justify-between mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {item.duration || "03:30"} min
                      </div>

                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {Math.floor(Math.random() * 20000).toLocaleString()} Views
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    {isActive && (
                      <div className="w-full bg-gray-200 h-1 mt-3 rounded-full">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No videos available
        </p>
      )}

      {/* ================= MINI PLAYER ================= */}
      <GlobalMiniVideoPlayer
        onExpandClick={() => {
          if (!isProUser) {
            router.visit("/membership");
            return;
          }
          openFullPlayer();
        }}
        isLocked={!isProUser}
      />

    </div>
  );
}
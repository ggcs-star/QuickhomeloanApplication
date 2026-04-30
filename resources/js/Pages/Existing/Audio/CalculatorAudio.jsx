import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { ArrowLeft, Play, Pause, BookOpen, Clock } from "lucide-react";
import api from "@/api";
import { useGlobalAudio } from "@/Context/GlobalAudioContext";

export default function CalculatorAudio() {
  const { slug } = usePage().props;

  const {
    currentAudio,
    isPlaying,
    progress,
    playAudio,
    togglePlay,
    setAudioList,
    setCurrentIndex,
  } = useGlobalAudio();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchAudio();
  }, [slug]);

  const fetchAudio = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/calculator-media/${slug}`, {
        params: { type: "audio" },
      });

      if (res.data?.status) {
        setData(res.data.data || []);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PLAY ================= */
  const handlePlay = (item, index) => {
    playAudio(item, data, index);
    setAudioList(data);
    setCurrentIndex(index);
  };

  const handleToggle = (e, item, index) => {
    e.stopPropagation();

    if (currentAudio?.id === item.id) {
      togglePlay();
    } else {
      handlePlay(item, index);
    }
  };

  const totalMinutes = data.length * 5;
  const currentIndex = data.findIndex((i) => i.id === currentAudio?.id);

  return (
    <div className="bg-white min-h-screen px-5 pt-6 pb-28 font-sans">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowLeft
          className="w-6 h-6 text-gray-800 cursor-pointer"
          onClick={() => window.history.back()}
        />
        <h1 className="text-xl text-gray-900">Audio Insights</h1>
      </div>

      {/* ================= TOP ================= */}
      <div className="flex flex-col items-start">

        {/* IMAGE */}
        <div className="w-full flex justify-center mb-6">
          <div className="bg-[#e8f1fc] rounded-[32px] p-4 w-48 h-48 flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full bg-gray-200 rounded-2xl animate-pulse" />
            ) : (
              <img
                src="/images/CalculatorAudio.png"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900 capitalize">
          {loading ? (
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            slug?.replace(/_/g, " ")
          )}
        </h2>

        {/* STATS */}
        <div className="flex items-center gap-5 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            {loading ? (
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              `${data.length} Lessons`
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            {loading ? (
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              `Total: ${totalMinutes} min`
            )}
          </div>
        </div>

        {/* BUTTON */}
        {loading ? (
          <div className="h-12 w-full bg-gray-200 rounded-xl mt-4 animate-pulse" />
        ) : (
          data.length > 0 && (
            <button
              onClick={() => handlePlay(data[0], 0)}
              className="mt-4 w-full bg-[#1e2330] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold active:scale-95"
            >
              <Play size={16} />
              Listen Now
            </button>
          )
        )}
      </div>

      {/* ================= LIST ================= */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Learning Modules
        </h3>
        <div className="h-px bg-gray-200 mb-2" />

        <div className="flex flex-col">

          {(loading ? Array.from({ length: 4 }) : data).map((item, index) => {
            const isActive = currentAudio?.id === item?.id;

            return (
              <div
                key={index}
                onClick={() => !loading && handlePlay(item, index)}
                className={`py-4 flex items-start gap-4 border-b border-gray-100 ${
                  isActive ? "bg-blue-50 px-4 rounded-xl -mx-4" : ""
                }`}
              >
                {/* NUMBER */}
                <span className="text-blue-600 font-semibold">
                  {loading ? (
                    <div className="w-4 h-5 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </span>

                {/* CONTENT */}
                <div className="flex-1">
                  {loading ? (
                    <>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                    </>
                  ) : (
                    <>
                      <p
                        className={`font-semibold ${
                          isActive ? "text-blue-600" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>

                      {/* PROGRESS */}
                      {isActive && (
                        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                  {loading ? (
                    <div className="w-10 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="text-xs text-gray-500">
                        {item.duration || "04:30"}
                      </span>

                      <button
                        onClick={(e) => handleToggle(e, item, index)}
                        className="bg-[#1e2330] text-white p-2 rounded-full"
                      >
                        {isActive && isPlaying ? (
                          <Pause size={12} />
                        ) : (
                          <Play size={12} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ================= MINI PLAYER ================= */}
      {currentAudio && (
        <div
          onClick={() => router.visit("/audio-player")}
          className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl p-4 flex justify-between items-center shadow-lg border cursor-pointer"
        >
          <div className="flex-1">
            <p className="text-blue-600 font-semibold truncate">
              {currentAudio.title}
            </p>

            <div className="w-full bg-gray-200 h-1 mt-2 rounded-full">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="bg-[#1e2330] text-white p-3 rounded-full ml-3"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
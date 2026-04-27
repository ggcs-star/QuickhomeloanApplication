import { useEffect, useState, useRef } from "react";
import api from "@/api";
import { ArrowLeft, Play, Pause } from "lucide-react";
import AppLayout from "../Layouts/AppLayout";

export default function AudioDetails() {
  const [module, setModule] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const audioRef = useRef(null);

  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    fetchModule();

    return () => {
      stopAudio();
    };
  }, []);

  const fetchModule = async () => {
    try {
      const res = await api.get("/education/audio");
      const found = res.data.data.find((m) => m.id === id);
      setModule(found);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 AUDIO LOGIC (same as your first file)
  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.play();
    audioRef.current = audio;
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handlePlay = (item) => {
    if (playingId === item.id) {
      stopAudio();
      setPlayingId(null);
      return;
    }

    playAudio(item.file_url);
    setPlayingId(item.id);
    setCurrentAudio(item);
  };

  const totalDuration = module?.contents?.reduce(
    (sum, item) => sum + parseInt(item.duration || 0),
    0
  );

  if (!module) return <div className="p-5">Loading...</div>;

  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      <div className="px-4 py-5 bg-gray-100 min-h-screen pb-24">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => window.history.back()}>
            <ArrowLeft size={22} />
          </button>
        </div>

        {/* TOP CARD */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="w-full aspect-[16/9]">
            <img
              src={module.image_url}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-5">
          <h3 className="text-xl font-semibold capitalize">
            {module.title}
          </h3>

          <div className="flex gap-4 text-sm text-gray-500 mt-2">
            <span>📘 {module.contents.length} lessons</span>
            <span>⏱ {totalDuration} min</span>
          </div>

          {/* START BUTTON */}
          <button
            onClick={() => handlePlay(module.contents[0])}
            className="w-full mt-4 bg-[#1E293B] text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Play size={18} /> Listen Now
          </button>
        </div>

        {/* LIST */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">
            Learning Modules
          </h4>

          <div className="space-y-2">

            {module.contents.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handlePlay(item)}
                className={`p-4 rounded-xl flex justify-between items-center cursor-pointer
                ${
                  playingId === item.id
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-white border"
                }`}
              >

                {/* LEFT */}
                <div className="flex gap-3">
                  <span className="text-blue-600 font-semibold">
                    {index + 1}
                  </span>

                  <div>
                    <p
                      className={`font-medium ${
                        playingId === item.id
                          ? "text-blue-600"
                          : ""
                      }`}
                    >
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  <span className="text-sm text-gray-500">
                    {item.duration}:00
                  </span>

                  {playingId === item.id ? (
                    <div className="bg-black text-white p-2 rounded-full">
                      <Pause size={14} />
                    </div>
                  ) : (
                    <div className="bg-gray-200 p-2 rounded-full">
                      <Play size={14} />
                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        </div>

        {/* MINI PLAYER */}
        {currentAudio && (
          <div className="fixed bottom-4 left-4 right-4 bg-blue-200 rounded-2xl p-4 flex justify-between items-center shadow">

            <div>
              <p className="font-semibold">{currentAudio.title}</p>
              <p className="text-sm">{currentAudio.description}</p>
            </div>

            <button
              onClick={() => handlePlay(currentAudio)}
              className="bg-black text-white p-3 rounded-full"
            >
              {playingId ? <Pause size={16} /> : <Play size={16} />}
            </button>

          </div>
        )}

      </div>
    </AppLayout>
  );
}
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useGlobalAudio } from "@/Context/GlobalAudioContext";
import {
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaEllipsisV,
  FaQuestionCircle
} from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function AudioPlayer() {
  const { props } = usePage();


  const {
    currentAudio,
    audioList,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    progress,
    togglePlay,
    handleNext,
    handlePrev,
    seekTo,
    playAudio,
  } = useGlobalAudio();

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
    if (props?.audio) {
      playAudio(
        props.audio,
        props.audioList || [],
        props.currentIndex || 0,
        props.currentTime || 0
      );
    }
  }, []);


  if (!currentAudio) {
    return (
      <AppLayout showTopNav={false} showBottomNav={false}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No audio selected</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 text-blue-600 hover:underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      <div className="min-h-screen bg-gray-100 px-4 py-5 max-w-lg mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-700 text-lg" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <FaEllipsisV className="text-gray-700 text-lg" />
          </button>
        </div>

        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden mb-5 shadow-lg">
          <img
            src={currentAudio.thumbnail_url || '/placeholder-image.jpg'}
            className="w-full h-52 object-cover"
            alt={currentAudio.title}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        {/* TITLE */}
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {currentAudio.title}
          </h2>
          <p className="text-sm text-gray-500">
            Track {currentIndex + 1} of {audioList.length} • Basics | 2026
          </p>
        </div>

        {/* PROGRESS */}
        <div className="px-2 mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              const time = (value / 100) * duration;
              seekTo(time);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
            style={{
              background: `linear-gradient(to right, #1E293B 0%, #1E293B ${progress}%, #E5E7EB ${progress}%, #E5E7EB 100%)`
            }}
          />
        </div>

        {/* TIME */}
        <div className="flex justify-between text-xs text-gray-500 mb-6 px-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <button
            onClick={handlePrev}
            className="p-3 hover:bg-gray-200 rounded-full transition-colors"
            disabled={currentIndex === 0}
          >
            <FaStepBackward
              className={`text-xl ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-700'}`}
            />
          </button>

          <button
            onClick={togglePlay}
            className="bg-[#1E293B] text-white p-5 rounded-full shadow-lg hover:bg-[#2d3a4f] transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 hover:bg-gray-200 rounded-full transition-colors"
            disabled={currentIndex === audioList.length - 1}
          >
            <FaStepForward
              className={`text-xl ${currentIndex === audioList.length - 1 ? 'text-gray-300' : 'text-gray-700'}`}
            />
          </button>
        </div>

        {/* FAQ */}
        {currentAudio.faqs && currentAudio.faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-4 mt-6 border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                <FaQuestionCircle className="text-gray-600 text-base" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Related FAQs
              </h3>
            </div>

            <div className="space-y-3">
              {currentAudio.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl shadow-sm border overflow-hidden"
                >
                  <summary className="cursor-pointer list-none flex justify-between items-center p-4 text-gray-800 font-medium">
                    <span className="pr-3">{faq.title}</span>
                    <ChevronDown
                      size={18}
                      className="text-gray-500 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t">
                    {faq.description}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {(!currentAudio.faqs || currentAudio.faqs.length === 0) && (
          <div className="text-center text-gray-400 text-sm py-10">
            No FAQs available for this track
          </div>
        )}
      </div>
    </AppLayout>
  );
}
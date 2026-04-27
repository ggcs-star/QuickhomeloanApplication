import { useEffect, useRef } from "react";
import { useGlobalVideo } from "@/Context/GlobalVideoContext";
import { Play, Pause, X, Maximize2, Loader } from "lucide-react";

export default function GlobalMiniVideoPlayer({ onExpandClick }) {
  const {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    progress,
    showMiniPlayer,
    isLoading,
    registerVideo,
    togglePlay,
    closeMiniPlayer,
  } = useGlobalVideo();

  const miniVideoRef = useRef(null);

  // ✅ Register this video element
  useEffect(() => {
    if (miniVideoRef.current && currentVideo && showMiniPlayer) {
      const video = miniVideoRef.current;
      
      // Set source
      if (video.src !== currentVideo.file_url) {
        video.src = currentVideo.file_url;
        video.load();
      }
      
      video.currentTime = currentTime;
      video.muted = false;
      
      // Register this video element as active
      registerVideo(video);
      
      // Sync play state
      if (isPlaying && video.paused) {
        video.play().catch(() => {});
      } else if (!isPlaying && !video.paused) {
        video.pause();
      }
    }
  }, [currentVideo?.id, showMiniPlayer]);

  if (!currentVideo || !showMiniPlayer) return null;

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    if (onExpandClick) onExpandClick();
  };

  return (
    <div className="fixed bottom-20 right-4 w-72 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl z-40 border border-gray-700">
      {/* Video */}
      <div className="relative bg-black aspect-video">
        <video
          ref={miniVideoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="auto"
        />
        
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader size={24} className="text-white animate-spin" />
          </div>
        )}
        
        {/* Overlay buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleExpand}
            className="bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
            title="Full Screen"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMiniPlayer();
            }}
            className="bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Info & Controls */}
      <div className="p-3">
        <p className="text-white text-sm font-medium truncate mb-2">
          {currentVideo.title}
        </p>

        {/* Progress */}
        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>

        {/* Time & Play */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs tabular-nums">
            {formatTime(currentTime)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="text-white hover:text-blue-400 transition-colors p-1"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
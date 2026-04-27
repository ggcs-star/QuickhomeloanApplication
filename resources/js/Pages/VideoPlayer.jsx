import { useEffect, useRef, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { useGlobalVideo } from "@/Context/GlobalVideoContext";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader,
} from "lucide-react";

export default function VideoPlayer() {
  const {
    currentVideo,
    videoList,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isLoading,
    registerVideo,
    togglePlay,
    seekTo,
    handleNext,
    handlePrev,
    changeVolume,
    toggleMiniPlayer,
    closeMiniPlayer,
  } = useGlobalVideo();

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);
  const controlsTimeoutRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // ✅ Main video setup - Exactly like MiniPlayer approach
  useEffect(() => {
    if (!videoRef.current || !currentVideo) return;

    const video = videoRef.current;
    console.log("VideoPlayer: Setting up video", currentVideo.file_url);

    setLocalLoading(true);
    setError(null);

    // Set source and load
    video.src = currentVideo.file_url;
    video.volume = volume;
    video.muted = false;
    
    // Set current time if available
    if (currentTime > 0) {
      video.currentTime = currentTime;
    }

    video.load();

    // Register with global context - THIS IS KEY
    registerVideo(video);
    hasInitializedRef.current = true;

    // Sync play state
    if (isPlaying) {
      video.play().catch(err => console.log("Auto-play prevented:", err));
    }

    // Event handlers
    const handleCanPlay = () => {
      console.log("VideoPlayer: Video can play");
      setLocalLoading(false);
      if (isPlaying && video.paused) {
        video.play().catch(() => {});
      }
    };

    const handlePlaying = () => {
      console.log("VideoPlayer: Video playing");
      setLocalLoading(false);
    };

    const handleWaiting = () => {
      console.log("VideoPlayer: Video buffering");
      setLocalLoading(true);
    };

    const handleError = (e) => {
      console.error("VideoPlayer: Video error", e);
      setError("Failed to load video. Please try again.");
      setLocalLoading(false);
    };

    const handleEnded = () => {
      console.log("VideoPlayer: Video ended");
      // Global context will handle next video
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    return () => {
      console.log("VideoPlayer: Cleaning up video events");
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentVideo?.file_url, isPlaying]);

  // ✅ Keep video element registered
  useEffect(() => {
    if (videoRef.current && currentVideo && !hasInitializedRef.current) {
      console.log("VideoPlayer: Re-registering video");
      registerVideo(videoRef.current);
      hasInitializedRef.current = true;
      
      // Sync state
      if (currentTime > 0) {
        videoRef.current.currentTime = currentTime;
      }
      videoRef.current.volume = volume;
      
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, []);

  // ✅ Sync play state from global context
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else if (!isPlaying && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // ✅ Sync current time from global context
  useEffect(() => {
    if (videoRef.current && currentTime > 0) {
      const diff = Math.abs(videoRef.current.currentTime - currentTime);
      if (diff > 2) { // Only seek if difference is significant
        videoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
          e.preventDefault();
          seekTo(Math.max(0, currentTime - 10));
          break;
        case "arrowright":
          e.preventDefault();
          seekTo(Math.min(duration, currentTime + 10));
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          changeVolume(volume === 0 ? 1 : 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, seekTo, changeVolume, volume, currentTime, duration]);

  // ✅ Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  // ✅ Fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // ✅ Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ✅ Retry loading
  const handleRetry = () => {
    if (videoRef.current && currentVideo) {
      setError(null);
      setLocalLoading(true);
      videoRef.current.src = currentVideo.file_url;
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // ✅ Handle back button
  const handleBack = () => {
    // Don't close mini player when going back to list
    window.history.back();
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentVideo) {
    return (
      <AppLayout showTopNav={false} showBottomNav={false}>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">No video selected</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
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
      <div
        ref={containerRef}
        className="fixed inset-0 bg-black z-50"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          if (e.target === containerRef.current) {
            togglePlay();
          }
        }}
      >
        {/* HEADER */}
        <div
          className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBack();
              }}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={22} />
            </button>

            <h2 className="text-white font-medium text-base truncate mx-4 flex-1 text-center">
              {currentVideo?.title || "Video Player"}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMiniPlayer();
              }}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              title="Toggle Mini Player"
            >
              <Minimize size={20} />
            </button>
          </div>
        </div>

        {/* VIDEO ELEMENT */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
          preload="auto"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        />

        {/* LOADING OVERLAY */}
        {(localLoading || isLoading) && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center">
              <Loader size={48} className="text-white animate-spin mx-auto mb-4" />
              <p className="text-white/70 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* ERROR OVERLAY */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center p-8 bg-gray-900/90 rounded-2xl backdrop-blur-sm">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* CENTER PLAY BUTTON */}
        {!isPlaying && !localLoading && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="pointer-events-auto bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
            >
              <Play size={40} className="text-white ml-1" fill="white" />
            </button>
          </div>
        )}

        {/* BOTTOM CONTROLS */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* PROGRESS BAR */}
          <div className="mb-4 px-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={(e) => {
                const time = (parseFloat(e.target.value) / 100) * duration;
                seekTo(time);
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progress}%, rgba(75,85,99,0.5) ${progress}%, rgba(75,85,99,0.5) 100%)`,
                accentColor: "#3B82F6",
              }}
            />
          </div>

          {/* CONTROLS ROW */}
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="text-white/80 hover:text-white p-1.5 transition-colors disabled:opacity-30"
                disabled={currentIndex === 0}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 p-1.5 transition-colors"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="text-white/80 hover:text-white p-1.5 transition-colors disabled:opacity-30"
                disabled={currentIndex >= videoList.length - 1}
              >
                <SkipForward size={20} />
              </button>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <button
                  onClick={() => changeVolume(volume === 0 ? 1 : 0)}
                  className="text-white/80 hover:text-white p-1.5 transition-colors"
                >
                  {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: "#3B82F6" }}
                />
              </div>

              {/* Time */}
              <span className="text-white/80 text-sm ml-2 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs hidden md:block">
                {currentIndex + 1} / {videoList.length}
              </span>
              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white p-1.5 transition-colors"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
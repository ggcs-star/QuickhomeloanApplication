import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

const GlobalVideoContext = createContext(null);

export function GlobalVideoProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeVideoRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const eventListenersRef = useRef({});

  // ✅ Clean up event listeners
  const cleanupListeners = useCallback((videoElement) => {
    if (!videoElement || !eventListenersRef.current[videoElement]) return;
    
    const listeners = eventListenersRef.current[videoElement];
    videoElement.removeEventListener("timeupdate", listeners.timeupdate);
    videoElement.removeEventListener("play", listeners.play);
    videoElement.removeEventListener("pause", listeners.pause);
    videoElement.removeEventListener("ended", listeners.ended);
    videoElement.removeEventListener("loadedmetadata", listeners.loadedmetadata);
    videoElement.removeEventListener("waiting", listeners.waiting);
    videoElement.removeEventListener("canplay", listeners.canplay);
    
    delete eventListenersRef.current[videoElement];
  }, []);

  // ✅ Register active video element
  const registerVideo = useCallback((videoElement) => {
    if (!videoElement) return;
    
    // Clean up previous video element
    if (activeVideoRef.current && activeVideoRef.current !== videoElement) {
      cleanupListeners(activeVideoRef.current);
      const prevVideo = activeVideoRef.current;
      if (prevVideo) {
        prevVideo.pause();
        prevVideo.removeAttribute('src');
      }
    }
    
    activeVideoRef.current = videoElement;
    
    // Create event handlers
    const handlers = {
      timeupdate: () => {
        const time = videoElement.currentTime;
        if (!isNaN(time)) {
          setCurrentTime(time);
          if (videoElement.duration && !isNaN(videoElement.duration)) {
            setProgress((time / videoElement.duration) * 100);
            setDuration(videoElement.duration);
          }
        }
      },
      play: () => {
        setIsPlaying(true);
        setShowMiniPlayer(true);
      },
      pause: () => {
        setIsPlaying(false);
      },
      ended: () => {
        setIsPlaying(false);
        // Auto play next video
        if (currentIndex < videoList.length - 1) {
          const nextVideo = videoList[currentIndex + 1];
          handleNext();
        }
      },
      loadedmetadata: () => {
        setDuration(videoElement.duration);
        setIsLoading(false);
      },
      waiting: () => {
        setIsLoading(true);
      },
      canplay: () => {
        setIsLoading(false);
      }
    };

    // Store listeners reference
    eventListenersRef.current[videoElement] = handlers;

    // Add event listeners
    videoElement.addEventListener("timeupdate", handlers.timeupdate);
    videoElement.addEventListener("play", handlers.play);
    videoElement.addEventListener("pause", handlers.pause);
    videoElement.addEventListener("ended", handlers.ended);
    videoElement.addEventListener("loadedmetadata", handlers.loadedmetadata);
    videoElement.addEventListener("waiting", handlers.waiting);
    videoElement.addEventListener("canplay", handlers.canplay);

    // Sync video element with current state
    if (currentVideo?.file_url && videoElement.src !== currentVideo.file_url) {
      videoElement.src = currentVideo.file_url;
      videoElement.load();
    }
    
    videoElement.volume = volume;
    
    if (currentTime > 0) {
      videoElement.currentTime = currentTime;
    }
  }, [currentVideo, currentTime, volume, cleanupListeners, videoList, currentIndex]);

  // ✅ Play video function
  const playVideo = useCallback((videoData, listData = [], index = 0, startTime = 0) => {
    if (!videoData?.file_url) {
      console.error("No video URL provided");
      return;
    }

    const video = activeVideoRef.current;
    
    // Same video - just toggle play
    if (currentVideo?.id === videoData.id && video && !video.paused) {
      return;
    }

    if (currentVideo?.id === videoData.id && video) {
      if (startTime > 0 && Math.abs(video.currentTime - startTime) > 2) {
        video.currentTime = startTime;
      }
      video.play().catch(err => console.log("Play error:", err));
      return;
    }

    // New video
    setCurrentVideo(videoData);
    setVideoList(listData);
    setCurrentIndex(index);
    setCurrentTime(startTime);
    setProgress(0);
    setIsPlaying(true);
    setShowMiniPlayer(true);
    setIsLoading(true);

    if (video) {
      // Clean up old source
      video.pause();
      video.removeAttribute('src');
      
      // Set new source
      video.src = videoData.file_url;
      video.load();
      
      const handleCanPlay = () => {
        if (startTime > 0) {
          video.currentTime = startTime;
        }
        video.play().catch(err => console.log("Play error:", err));
        video.removeEventListener("canplay", handleCanPlay);
      };
      
      video.addEventListener("canplay", handleCanPlay);
    }
  }, [currentVideo]);

  // ✅ Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => console.log("Play error:", err));
    } else {
      video.pause();
    }
  }, []);

  // ✅ Seek
  const seekTo = useCallback((time) => {
    const video = activeVideoRef.current;
    if (video && !isNaN(time)) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // ✅ Next/Prev
  const handleNext = useCallback(() => {
    if (videoList.length === 0) return;
    const newIndex = currentIndex + 1;
    if (newIndex >= videoList.length) return;
    playVideo(videoList[newIndex], videoList, newIndex);
  }, [playVideo, videoList, currentIndex]);

  const handlePrev = useCallback(() => {
    if (videoList.length === 0) return;
    const newIndex = Math.max(0, currentIndex - 1);
    playVideo(videoList[newIndex], videoList, newIndex);
  }, [playVideo, videoList, currentIndex]);

  // ✅ Volume
  const changeVolume = useCallback((newVolume) => {
    const video = activeVideoRef.current;
    const vol = Math.max(0, Math.min(1, newVolume));
    
    if (video) {
      video.volume = vol;
    }
    setVolume(vol);
    
    // Update all video elements
    document.querySelectorAll('video').forEach(v => {
      v.volume = vol;
    });
  }, []);

  // ✅ Mini Player
  const toggleMiniPlayer = useCallback(() => {
    setShowMiniPlayer(prev => !prev);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    setShowMiniPlayer(false);
  }, []);

  // ✅ Save state periodically
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      if (isPlaying && currentVideo) {
        try {
          localStorage.setItem("global_video_state", JSON.stringify({
            currentVideo,
            videoList,
            currentIndex,
            currentTime,
            volume,
            isPlaying
          }));
        } catch (err) {
          console.error("Error saving video state:", err);
        }
      }
    }, 3000);
    
    return () => {
      clearInterval(saveIntervalRef.current);
    };
  }, [isPlaying, currentVideo, videoList, currentIndex, currentTime, volume]);

  // ✅ Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("global_video_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentVideo) setCurrentVideo(parsed.currentVideo);
        if (parsed.videoList) setVideoList(parsed.videoList);
        if (parsed.currentIndex !== undefined) setCurrentIndex(parsed.currentIndex);
        if (parsed.currentTime) setCurrentTime(parsed.currentTime);
        if (parsed.volume !== undefined) setVolume(parsed.volume);
      }
    } catch (err) {
      console.error("Error loading video state:", err);
    }
  }, []);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeVideoRef.current) {
        cleanupListeners(activeVideoRef.current);
        activeVideoRef.current.pause();
      }
      clearInterval(saveIntervalRef.current);
    };
  }, [cleanupListeners]);

  const value = {
    currentVideo,
    videoList,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    showMiniPlayer,
    isLoading,
    
    registerVideo,
    playVideo,
    togglePlay,
    handleNext,
    handlePrev,
    seekTo,
    changeVolume,
    toggleMiniPlayer,
    closeMiniPlayer,
    setVideoList,
    setCurrentIndex,
    setCurrentVideo,
  };

  return (
    <GlobalVideoContext.Provider value={value}>
      {children}
    </GlobalVideoContext.Provider>
  );
}

export function useGlobalVideo() {
  const context = useContext(GlobalVideoContext);
  if (!context) {
    throw new Error("useGlobalVideo must be used within GlobalVideoProvider");
  }
  return context;
}
import { useEffect, useState, useRef } from "react";
import AppLayout from "../Layouts/AppLayout";
import api from "@/api";
import { ArrowLeft, Eye, Heart, MessageCircle, Play, Volume2, VolumeX } from "lucide-react";
import ReelComments from "@/Components/ReelComments";

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [mutedStates, setMutedStates] = useState({});
  const viewedReels = useRef(new Set());
  const [showSoundIcon, setShowSoundIcon] = useState({});
  const hideTimers = useRef({});
  const videoRefs = useRef([]);
  const containerRef = useRef();
  const actionButtonClicked = useRef(false);
  const scrollTimeout = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    fetchReels(page);
  }, [page]);

  const fetchReels = async (pageNumber) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await api.get(`/reels?page=${pageNumber}`);

      const newData = res.data.data.map((item) => ({
        ...item,
        is_liked: item.is_liked ?? false,
      }));

      setReels((prev) =>
        pageNumber === 1 ? newData : [...prev, ...newData]
      );

      setMutedStates((prev) => {
        const newMutedStates = { ...prev };
        newData.forEach((item) => {
          newMutedStates[item.id] = false;
        });
        return newMutedStates;
      });

      setShowSoundIcon((prev) => {
        const updated = { ...prev };
        newData.forEach((item) => {
          updated[item.id] = true;
        });
        return updated;
      });

      setLastPage(res.data.pagination.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || loadingMore) return;
    
    // Prevent multiple rapid scroll events
    if (isScrolling.current) return;
    isScrolling.current = true;
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set a timeout to enable scroll check again
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      
      // Check if we need to load more
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
        if (page < lastPage) {
          setPage((prev) => prev + 1);
        }
      }
    }, 150); // 150ms debounce
  };

  const trackView = async (reelId) => {
    if (!viewedReels.current.has(reelId)) {
      try {
        await api.post(`/reels/view/${reelId}`);
        viewedReels.current.add(reelId);

        setReels((prev) =>
          prev.map((reel) =>
            reel.id === reelId
              ? { ...reel, views: (reel.views || 0) + 1 }
              : reel
          )
        );
      } catch (err) {
        console.error("Failed to track view:", err);
      }
    }
  };

  useEffect(() => {
    Object.keys(showSoundIcon).forEach((reelId) => {
      if (showSoundIcon[reelId] && !mutedStates[reelId]) {
        if (hideTimers.current[reelId]) {
          clearTimeout(hideTimers.current[reelId]);
        }

        hideTimers.current[reelId] = setTimeout(() => {
          setShowSoundIcon((prev) => ({
            ...prev,
            [reelId]: false,
          }));
        }, 3000);
      }
    });

    return () => {
      Object.keys(hideTimers.current).forEach((reelId) => {
        if (hideTimers.current[reelId]) {
          clearTimeout(hideTimers.current[reelId]);
        }
      });
    };
  }, [showSoundIcon, mutedStates]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const reelId = video.dataset.reelId;

          if (entry.isIntersecting) {
            video.muted = mutedStates[reelId] ?? true;
            video.play().catch(() => {});

            if (reelId) {
              trackView(reelId);
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels, mutedStates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleReelTap = (reelId, index, e) => {
    const target = e.target;
    const isActionButton = target.closest('.action-button');
    const isSoundButton = target.closest('.sound-button');
    
    if (isActionButton || isSoundButton) {
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rightThreshold = rect.width - 60;
    
    if (x > rightThreshold) {
      return;
    }

    toggleSound(reelId, index);
  };

  const toggleSound = (reelId, index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;

    setMutedStates((prev) => ({
      ...prev,
      [reelId]: newMutedState,
    }));

    setShowSoundIcon((prev) => ({
      ...prev,
      [reelId]: true,
    }));

    if (hideTimers.current[reelId]) {
      clearTimeout(hideTimers.current[reelId]);
    }

    if (!newMutedState) {
      hideTimers.current[reelId] = setTimeout(() => {
        setShowSoundIcon((prev) => ({
          ...prev,
          [reelId]: false,
        }));
      }, 2000);
    }

    video.play().catch(() => {});
  };

  const handleLike = async (id, index) => {
    try {
      actionButtonClicked.current = true;
      
      await api.post(`/reels/like/${id}`);

      setReels((prev) => {
        const updated = [...prev];
        const reel = updated[index];

        if (reel.is_liked) {
          reel.likes_count -= 1;
        } else {
          reel.likes_count += 1;
        }

        reel.is_liked = !reel.is_liked;
        return updated;
      });
      
      setTimeout(() => {
        actionButtonClicked.current = false;
      }, 100);
    } catch (err) {
      console.error(err);
      actionButtonClicked.current = false;
    }
  };

  const ReelSkeleton = ({ index }) => (
    <div className="h-[100dvh] w-full snap-start flex-shrink-0 relative flex items-end bg-gray-950"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 text-white z-10">
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>
      </div>

      <div className="absolute bottom-6 left-4">
        <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        /* Mobile tap highlight removal */
        .reel-container {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        /* Smooth transitions for sound icon */
        .sound-icon-wrapper {
          transition: opacity 0.3s ease-in-out;
        }
        
        .sound-icon-wrapper.visible {
          opacity: 1;
        }
        
        .sound-icon-wrapper.hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        /* Ensure action buttons are always clickable */
        .action-button {
          position: relative;
          z-index: 30;
          pointer-events: auto !important;
        }
        
        /* Force snap points */
        .snap-scroll-container {
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
          overflow-y: scroll;
          scroll-behavior: smooth;
        }
        
        .snap-scroll-container > * {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
      `}</style>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[100dvh] w-full snap-scroll-container bg-black"
        style={{
          height: '100dvh',
          width: '100%',
        }}
      >
        {/* HEADER */}
        <div className="fixed top-0 left-4 z-50 text-white"
          style={{
            top: 'calc(env(safe-area-inset-top) + 20px)',
          }}
        >
          <ArrowLeft
            onClick={() => window.history.back()}
            className="font-bold stroke-[2.5]"
          />
        </div>

        {/* SKELETON LOADER */}
        {loading &&
          [...Array(3)].map((_, i) => (
            <ReelSkeleton key={i} index={i} />
          ))}

        {/* REELS LIST */}
        {reels.map((item, index) => (
          <div
            key={item.id}
            className="h-[100dvh] w-full relative flex-shrink-0 flex items-end reel-container"
            style={{
              height: '100dvh',
              width: '100%',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={(e) => handleReelTap(item.id, index, e)}
          >
            {/* VIDEO */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.reel_url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              data-reel-id={item.id}
            />

            {/* SOUND BUTTON - Centered but only covers the button area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                className={`sound-icon-wrapper ${showSoundIcon[item.id] ? 'visible' : 'hidden'}`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleSound(item.id, index);
                  }}
                  className="sound-button pointer-events-auto group cursor-pointer"
                >
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full 
                    bg-white/10 backdrop-blur-xl border border-white/20 
                    shadow-lg shadow-black/40 transition-all duration-300 
                    group-hover:scale-110 group-active:scale-95">

                    <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-30" />

                    {mutedStates[item.id] ? (
                      <VolumeX size={28} className="text-white" />
                    ) : (
                      <Volume2 size={28} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* TEXT */}
            <div className="relative z-10 p-4 text-white w-full pointer-events-none translate-y-[-15px]">
              <h2 className="text-2xl font-bold">
                {item.title || "Your EMI Secret Nobody Told You"}
              </h2>
              <p className="text-sm mt-2 text-gray-300">
                {item.description}
              </p>
            </div>

            {/* ACTION BAR - Added z-index and pointer-events */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 text-white z-30 translate-y-[-30px]">
              {/* LIKE */}
              <div className="flex flex-col items-center action-button">
                <Heart
                  size={28}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleLike(item.id, index);
                  }}
                  className={`cursor-pointer transition ${item.is_liked
                    ? "text-red-500 scale-110"
                    : "text-white"
                    }`}
                />
                <span className="text-xs mt-1">
                  {item.likes_count}
                </span>
              </div>

              {/* COMMENTS */}
              <div className="flex flex-col items-center action-button">
                <MessageCircle
                  size={28}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedReel(item.id);
                  }}
                  className="cursor-pointer"
                />
                <span className="text-xs mt-1">
                  {item.comments_count}
                </span>
              </div>

              {/* VIEWS */}
              <div className="flex flex-col items-center action-button">
                <Eye size={28} />
                <span className="text-xs mt-1">
                  {item.views}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* COMMENTS MODAL */}
        {selectedReel && (
          <ReelComments
            reelId={selectedReel}
            onClose={() => setSelectedReel(null)}
          />
        )}

        {/* LOAD MORE */}
        {loadingMore && (
          <div className="h-20 flex items-center justify-center text-white text-sm gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>Loading more reels...</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
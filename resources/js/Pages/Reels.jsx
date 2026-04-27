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
  const viewedReels = useRef(new Set()); // Track which reels have been viewed

  const videoRefs = useRef([]);
  const containerRef = useRef();

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
        is_liked: false,
      }));

      setReels((prev) =>
        pageNumber === 1 ? newData : [...prev, ...newData]
      );

      // Initialize mute states for new reels
      setMutedStates((prev) => {
        const newMutedStates = { ...prev };
        newData.forEach((item) => {
          // Start with sound ON (not muted) for better UX
          newMutedStates[item.id] = false;
        });
        return newMutedStates;
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

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      if (page < lastPage) {
        setPage((prev) => prev + 1);
      }
    }
  };

  // Track reel views
  const trackView = async (reelId) => {
    // Only track view if not already viewed in this session
    if (!viewedReels.current.has(reelId)) {
      try {
        await api.post(`/reels/view/${reelId}`);
        viewedReels.current.add(reelId);

        // Update the view count locally
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const reelId = video.dataset.reelId;

          if (entry.isIntersecting) {
            // Set muted based on user's preference for this video
            video.muted = mutedStates[reelId] ?? false; // Default to unmuted
            video.play().catch(() => { });

            // Track view when reel becomes visible
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
  }, [reels, mutedStates]); // Added mutedStates dependency

  const toggleSound = (reelId, index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;

    // Update state
    setMutedStates((prev) => ({
      ...prev,
      [reelId]: newMutedState,
    }));

    video.play().catch(() => { });
  };

  // ==============================
  // LIKE TOGGLE (FIXED)
  // ==============================
  const handleLike = async (id, index) => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // SKELETON LOADER COMPONENT
  // ==============================
  const ReelSkeleton = ({ index }) => (
    <div className="h-screen w-full relative snap-start flex items-end bg-gray-950">
      {/* Simulated video background with gradient and pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse">


        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />




      {/* Action buttons skeleton */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 text-white z-10">
        {/* Like button skeleton */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>

        {/* Comment button skeleton */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>

        {/* View button skeleton */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-6 h-3 bg-gray-700/50 rounded animate-pulse mt-1" />
        </div>
      </div>

      {/* Sound button skeleton */}
      <div className="absolute bottom-6 left-4">
        <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse" />
      </div>

      {/* Loading indicator */}

    </div>
  );

  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      {/* Custom CSS for shimmer animation */}
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
      `}</style>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
      >
        {/* HEADER */}
        <div className="fixed top-4 left-4 z-50 text-white">
          <ArrowLeft onClick={() => window.history.back()} />
        </div>

        {/* ============================= */}
        {/* SKELETON LOADER */}
        {/* ============================= */}
        {loading &&
          [...Array(3)].map((_, i) => (
            <ReelSkeleton key={i} index={i} />
          ))}

        {/* ============================= */}
        {/* REELS LIST */}
        {/* ============================= */}
        {reels.map((item, index) => (
          <div
            key={item.id}
            className="h-screen w-full relative snap-start flex items-end"
          >
            {/* VIDEO - Added data-reel-id for tracking */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.reel_url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              data-reel-id={item.id}
            // Remove default muted - now controlled by state
            />

            {/* SOUND BUTTON - Fixed to show correct state */}
            <div
              onClick={() => toggleSound(item.id, index)}
              className="absolute bottom-6 left-4 bg-black/50 px-3 py-1 rounded text-white text-xs cursor-pointer flex items-center gap-1"
            >
              {mutedStates[item.id] ? (
                <>
                  <VolumeX size={14} />
                  <span>Tap for Sound</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  <span>Tap to Mute</span>
                </>
              )}
            </div>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* TEXT */}
            <div className="relative z-10 p-4 text-white w-full">
              <h2 className="text-2xl font-bold">
                {item.title || "Your EMI Secret Nobody Told You"}
              </h2>

              <p className="text-sm mt-2 text-gray-300">
                {item.description}
              </p>
            </div>

            {/* ACTION BAR */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 text-white z-10">
              {/* LIKE */}
              <div className="flex flex-col items-center">
                <Heart
                  size={28}
                  onClick={() => handleLike(item.id, index)}
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
              <div className="flex flex-col items-center">
                <MessageCircle
                  size={28}
                  onClick={() => setSelectedReel(item.id)}
                  className="cursor-pointer"
                />
                <span className="text-xs mt-1">
                  {item.comments_count}
                </span>
              </div>

              {/* VIEWS */}
              <div className="flex flex-col items-center">
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
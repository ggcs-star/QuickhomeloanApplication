import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

const GlobalAudioContext = createContext(null);

let globalAudioElement = null;
let globalAudioState = {
    currentAudio: null,
    audioList: [],
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
};

const loadSavedState = () => {
    try {
        const saved = localStorage.getItem("global_audio_state");
        if (saved) {
            const parsed = JSON.parse(saved);
            globalAudioState = { ...globalAudioState, ...parsed };
        }
    } catch (err) {
        console.error("Error loading audio state:", err);
    }
};

const saveState = () => {
    try {
        localStorage.setItem("global_audio_state", JSON.stringify({
            currentAudio: globalAudioState.currentAudio,
            audioList: globalAudioState.audioList,
            currentIndex: globalAudioState.currentIndex,
            isPlaying: globalAudioState.isPlaying,
            currentTime: globalAudioState.currentTime,
        }));
    } catch (err) {
        console.error("Error saving audio state:", err);
    }
};

if (typeof window !== "undefined") {
    loadSavedState();
}

const updateMediaSession = (audioData) => {
    if (typeof window !== "undefined" && "mediaSession" in navigator && audioData) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: audioData.title || "Audio Track",
            artist: "QuickHomeLoan",
            album: "Learning Modules",
            artwork: [
                {
                    src: audioData.image_url || "/logo.png",
                    sizes: "512x512",
                    type: "image/png",
                },
                {
                    src: audioData.image_url || "/logo.png",
                    sizes: "256x256",
                    type: "image/png",
                },
                {
                    src: audioData.image_url || "/logo.png",
                    sizes: "128x128",
                    type: "image/png",
                },
            ],
        });
    }
};

export function GlobalAudioProvider({ children }) {
    const [currentAudio, setCurrentAudio] = useState(globalAudioState.currentAudio);
    const [audioList, setAudioList] = useState(globalAudioState.audioList);
    const [currentIndex, setCurrentIndex] = useState(globalAudioState.currentIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(globalAudioState.currentTime);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleNext = useCallback(() => {
        if (globalAudioState.audioList.length === 0) return;
        const newIndex = globalAudioState.currentIndex + 1;
        if (newIndex >= globalAudioState.audioList.length) return;

        const nextAudio = globalAudioState.audioList[newIndex];
        playAudio(nextAudio, globalAudioState.audioList, newIndex);
    }, []);

    const handlePrev = useCallback(() => {
        if (globalAudioState.audioList.length === 0) return;
        const newIndex = Math.max(0, globalAudioState.currentIndex - 1);
        const prevAudio = globalAudioState.audioList[newIndex];
        playAudio(prevAudio, globalAudioState.audioList, newIndex);
    }, []);

    const setupMediaSessionHandlers = useCallback((audioElement) => {
        if (typeof window !== "undefined" && "mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", async () => {
                if (audioElement) {
                    await audioElement.play();
                }
            });

            navigator.mediaSession.setActionHandler("pause", () => {
                if (audioElement) {
                    audioElement.pause();
                }
            });

            navigator.mediaSession.setActionHandler("previoustrack", () => {
                handlePrev();
            });

            navigator.mediaSession.setActionHandler("nexttrack", () => {
                handleNext();
            });

            navigator.mediaSession.setActionHandler("seekbackward", () => {
                if (audioElement) {
                    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
                }
            });

            navigator.mediaSession.setActionHandler("seekforward", () => {
                if (audioElement && audioElement.duration) {
                    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
                }
            });

            navigator.mediaSession.setActionHandler("seekto", (details) => {
                if (audioElement && details.seekTime !== undefined) {
                    audioElement.currentTime = details.seekTime;
                }
            });
        }
    }, [handlePrev, handleNext]);

    const getAudioElement = useCallback(() => {
        if (!globalAudioElement && typeof window !== "undefined") {
            globalAudioElement = new Audio();
             window.globalAudioElement = globalAudioElement;
            globalAudioElement.addEventListener("timeupdate", () => {
                const time = globalAudioElement.currentTime;
                globalAudioState.currentTime = time;
                setCurrentTime(time);
                if (globalAudioElement.duration) {
                    const prog = (time / globalAudioElement.duration) * 100;
                    globalAudioState.progress = prog;
                    setProgress(prog);
                }

                if (Math.floor(time) !== Math.floor(globalAudioState._lastSavedTime || 0)) {
                    globalAudioState._lastSavedTime = time;
                    saveState();
                }
            });

            globalAudioElement.addEventListener("loadedmetadata", () => {
                const dur = globalAudioElement.duration;
                globalAudioState.duration = dur;
                setDuration(dur);
            });

            globalAudioElement.addEventListener("play", () => {
                globalAudioState.isPlaying = true;
                setIsPlaying(true);
                saveState();
            });

            globalAudioElement.addEventListener("pause", () => {
                globalAudioState.isPlaying = false;
                setIsPlaying(false);
                saveState();
            });

            globalAudioElement.addEventListener("ended", () => {
                setIsPlaying(false);
                globalAudioState.isPlaying = false;

                const nextIndex = globalAudioState.currentIndex + 1;
                if (nextIndex < globalAudioState.audioList.length) {
                    const nextAudio = globalAudioState.audioList[nextIndex];
                    globalAudioState.currentIndex = nextIndex;
                    globalAudioState.currentAudio = nextAudio;
                    setCurrentIndex(nextIndex);
                    setCurrentAudio(nextAudio);
                    globalAudioElement.src = nextAudio.file_url;
                    globalAudioElement.play();
                    updateMediaSession(nextAudio);
                    saveState();
                }
            });

            globalAudioElement.addEventListener("error", (e) => {
                console.error("Audio error:", e);
                setIsPlaying(false);
            });

            setupMediaSessionHandlers(globalAudioElement);
        }
        return globalAudioElement;
    }, [setupMediaSessionHandlers]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            console.log("=== MEDIA SESSION DEBUG ===");
            console.log("User Agent:", navigator.userAgent);
            console.log("Media Session exists:", 'mediaSession' in navigator);
            console.log("Secure Context:", window.isSecureContext);
            console.log("Protocol:", window.location.protocol);
            
            if ('mediaSession' in navigator) {
                console.log("✅ Media Session API is available!");
            } else {
                console.log("❌ Media Session API NOT available - NativePHP WebView limitation");
            }
        }
        if (typeof window === "undefined") return;

        const audio = getAudioElement();

        if (globalAudioState.currentAudio?.file_url && !audio.src) {
            audio.src = globalAudioState.currentAudio.file_url;
            if (globalAudioState.currentTime > 0) {
                audio.currentTime = globalAudioState.currentTime;
            }

            if (globalAudioState.isPlaying) {
                audio.play().catch(err => {
                    console.log("Autoplay prevented:", err);
                    setIsPlaying(false);
                });
            }
            
            updateMediaSession(globalAudioState.currentAudio);
        }

        setIsInitialized(true);

        return () => {
            if (typeof window !== "undefined" && "mediaSession" in navigator) {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
                navigator.mediaSession.setActionHandler("seekbackward", null);
                navigator.mediaSession.setActionHandler("seekforward", null);
                navigator.mediaSession.setActionHandler("seekto", null);
            }
        };
    }, [getAudioElement]);

    useEffect(() => {
    const stopAudio = () => {
        if (globalAudioElement && !globalAudioElement.paused) {
            globalAudioElement.pause();
            globalAudioState.isPlaying = false;
            setIsPlaying(false);
        }
    };

    const handleBeforeNavigate = () => stopAudio();
    const handlePageHide = () => stopAudio();
    const handleVisibilityChange = () => {
        if (document.hidden) {
            stopAudio();
        }
    };
    
    document.addEventListener('inertia:before', handleBeforeNavigate);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
        document.removeEventListener('inertia:before', handleBeforeNavigate);
        window.removeEventListener('pagehide', handlePageHide);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, []);

    const playAudio = useCallback((audioData, listData = [], index = 0, startTime = 0) => {
        const audio = getAudioElement();
        if (!audio || !audioData?.file_url) return;

        if (globalAudioState.currentAudio?.id === audioData.id && audio.src) {
            if (!audio.paused) return;
            if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 2) {
                audio.currentTime = startTime;
            }
            audio.play().catch(err => console.log("Play error:", err));
            return;
        }

        globalAudioState.currentAudio = audioData;
        globalAudioState.audioList = listData;
        globalAudioState.currentIndex = index;
        globalAudioState.currentTime = startTime;
        globalAudioState.isPlaying = true;

        setCurrentAudio(audioData);
        setAudioList(listData);
        setCurrentIndex(index);
        setCurrentTime(startTime);
        setProgress(0);

        audio.src = audioData.file_url;
        audio.load();

        updateMediaSession(audioData);

        const onCanPlay = () => {
            if (startTime > 0) {
                audio.currentTime = startTime;
            }
            audio.play().catch(err => console.log("Play error:", err));
            audio.removeEventListener("canplay", onCanPlay);
        };

        audio.addEventListener("canplay", onCanPlay);
        saveState();
    }, [getAudioElement]);

    const togglePlay = useCallback(() => {
        const audio = getAudioElement();
        if (!audio || !audio.src) return;

        if (audio.paused) {
            audio.play().catch(err => console.log("Play error:", err));
        } else {
            audio.pause();
        }
    }, [getAudioElement]);

    const seekTo = useCallback((time) => {
        const audio = getAudioElement();
        if (audio) {
            audio.currentTime = time;
            setCurrentTime(time);
            globalAudioState.currentTime = time;
            saveState();
        }
    }, [getAudioElement]);

    const pauseAudio = useCallback(() => {
        const audio = getAudioElement();
        if (audio && !audio.paused) {
            audio.pause();
        }
    }, [getAudioElement]);
    window.pauseGlobalAudio = () => {
    if (globalAudioElement && !globalAudioElement.paused) {
        globalAudioElement.pause();
        globalAudioState.isPlaying = false;
        setIsPlaying(false);
    }
};

    const resumeAudio = useCallback(() => {
        const audio = getAudioElement();
        if (audio && audio.paused && audio.src) {
            audio.play().catch(err => console.log("Play error:", err));
        }
    }, [getAudioElement]);

    const value = {
        currentAudio,
        audioList,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        progress,
        isInitialized,

        playAudio,
        togglePlay,
        pauseAudio,
        resumeAudio,
        handleNext,
        handlePrev,
        seekTo,
        setAudioList,
        setCurrentIndex,
    };

    return (
        <GlobalAudioContext.Provider value={value}>
            {children}
        </GlobalAudioContext.Provider>
    );
}

export function useGlobalAudio() {
    const context = useContext(GlobalAudioContext);
    if (!context) {
        throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
    }
    return context;
}
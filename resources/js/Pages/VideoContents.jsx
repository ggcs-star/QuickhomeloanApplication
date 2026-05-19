import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import api from "@/api";
import AppLayout from "../Layouts/AppLayout";
import { useGlobalVideo } from "@/Context/GlobalVideoContext";
import GlobalMiniVideoPlayer from "@/Components/GlobalMiniVideoPlayer";
import {
    ArrowLeft,
    Play,
    Pause,
    Clock,
    BookOpen,
} from "lucide-react";

export default function VideoContents() {
    const { moduleId } = usePage().props;

    const {
        currentVideo,
        isPlaying,
        progress,
        playVideo,
        togglePlay,
        setVideoList,
        setCurrentIndex,
    } = useGlobalVideo();

    const [contents, setContents] = useState([]);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);

    useEffect(() => {
        if (currentVideo && isPlaying) {
            setPlayingId(currentVideo.id);
        } else if (!isPlaying) {
            setPlayingId(null);
        }
    }, [currentVideo, isPlaying]);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/contents/${moduleId}?type=video`);
            setContents(res.data.data);
            setModule(res.data.module);
            setVideoList(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = (item, index) => {
        playVideo(item, contents, index);
        setPlayingId(item.id);
        setVideoList(contents);
        setCurrentIndex(index);
    };

    const handleToggle = (e, item, index) => {
        e.stopPropagation();
        if (currentVideo?.id === item.id) {
            togglePlay();
            setPlayingId(isPlaying ? null : item.id);
        } else {
            handlePlayVideo(item, index);
        }
    };

    const openFullPlayer = () => {
        router.visit('/video-player');
    };

    const totalMinutes = contents.reduce(
        (sum, item) => sum + parseInt(item.duration || 0),
        0
    );

    return (
        <AppLayout showTopNav={false} showBottomNav={false}>
            <div className="min-h-screen bg-gray-50 pb-28">

                {/* HEADER */}
               <div className="px-4 pt-4 pb-2">
                    <button
                        onClick={() => window.history.back()}
                        className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition mt-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#081c4b]" strokeWidth={2} />
                    </button>
                </div>

                {/* BANNER */}
                {module && (
                    <div className="px-4 mb-4">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <img
                                src={module.image_url}
                                className="w-full h-44 object-cover"
                                alt={module.title}
                            />
                        </div>
                    </div>
                )}

                {/* TITLE & STATS */}
                <div className="px-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {module?.title}
                    </h2>
                    <div className="flex items-center gap-5 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-blue-600" />
                            <span>{contents.length} Videos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            <span>{totalMinutes} min</span>
                        </div>
                    </div>
                </div>

                {/* PLAY ALL BUTTON */}
                {contents.length > 0 && (
                    <div className="px-4 mt-5">
                        <button
                            onClick={() => handlePlayVideo(contents[0], 0)}
                            className="w-full bg-[#1E293B] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-medium active:scale-[0.98] transition-transform hover:bg-[#2d3a4f]"
                        >
                            <Play size={18} fill="white" />
                            Watch Now
                        </button>
                    </div>
                )}

                {/* LESSONS LIST */}
                <div className="px-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Learning Modules
                    </h3>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse flex items-center gap-3 py-4">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {contents.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePlayVideo(item, index)}
                                    className={`flex items-center gap-3 py-4 cursor-pointer transition-colors hover:bg-gray-50 rounded-lg px-2 -mx-2 ${
                                        currentVideo?.id === item.id ? "bg-blue-50/50" : ""
                                    }`}
                                >
                                    {/* Number */}
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                                        currentVideo?.id === item.id
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>
                                        {currentVideo?.id === item.id && isPlaying ? (
                                            <span className="flex gap-0.5">
                                                <span className="w-0.5 h-2 bg-white rounded animate-pulse"></span>
                                                <span className="w-0.5 h-2 bg-white rounded animate-pulse" style={{animationDelay: "0.2s"}}></span>
                                                <span className="w-0.5 h-2 bg-white rounded animate-pulse" style={{animationDelay: "0.4s"}}></span>
                                            </span>
                                        ) : (
                                            index + 1
                                        )}
                                    </span>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${
                                            currentVideo?.id === item.id ? "text-blue-600" : "text-gray-900"
                                        }`}>
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {item.description || `${item.duration} min`}
                                        </p>
                                        {/* Progress bar */}
                                        {currentVideo?.id === item.id && (
                                            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                                <div
                                                    className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration & Play Button */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-sm text-gray-400">
                                            {item.duration}:00
                                        </span>
                                        <button
                                            onClick={(e) => handleToggle(e, item, index)}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                                currentVideo?.id === item.id
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {currentVideo?.id === item.id && isPlaying ? (
                                                <Pause size={14} />
                                            ) : (
                                                <Play size={14} className="ml-0.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MINI PLAYER */}
                <GlobalMiniVideoPlayer onExpandClick={openFullPlayer} />
            </div>
        </AppLayout>
    );
}
import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import api from "@/api";
import AppLayout from "../Layouts/AppLayout";
import { useGlobalAudio } from "@/Context/GlobalAudioContext";
import {
    FaArrowLeft,
    FaPlay,
    FaClock,
    FaBookOpen,
    FaPause,
} from "react-icons/fa";

export default function AudioContents() {
    const { moduleId } = usePage().props;

    const {
        currentAudio,
        isPlaying,
        currentTime,
        progress,
        playAudio,
        togglePlay,
        setAudioList,
        setCurrentIndex,
    } = useGlobalAudio();

    const [contents, setContents] = useState([]);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);

    useEffect(() => {
        if (currentAudio && isPlaying) {
            setPlayingId(currentAudio.id);
        } else if (!isPlaying) {
            setPlayingId(null);
        }
    }, [currentAudio, isPlaying]);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/contents/${moduleId}?type=audio`);
            setContents(res.data.data);
            setModule(res.data.module);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (item, index) => {
        playAudio(item, contents, index);
        setPlayingId(item.id);
        setAudioList(contents);
        setCurrentIndex(index);
    };

    const handleToggle = (e, item, index) => {
        e.stopPropagation();

        if (currentAudio?.id === item.id) {
            togglePlay();
            if (isPlaying) {
                setPlayingId(null);
            } else {
                setPlayingId(item.id);
            }
        } else {
            handlePlay(item, index);
        }
    };

    const totalMinutes = contents.reduce(
        (sum, item) => sum + parseInt(item.duration || 0),
        0
    );

    const navigateToAudioPlayer = () => {
        router.visit('/audio-player', {
            preserveState: true,
            preserveScroll: true,
            only: [],
            headers: {
                'X-Inertia-Partial-Data': '',
                'X-Inertia-Partial-Component': 'AudioPlayer',
            },
        });
    };

    return (
        <AppLayout showTopNav={false} showBottomNav={false}>
            <div className="min-h-screen bg-gray-100 px-4 py-5 pb-28 ">
                <button
                    onClick={() => {
                        if (window.globalAudioElement) {
                            window.globalAudioElement.pause();
                        }
                        window.history.back();
                    }}
                    className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition mb-4 mt-4"
                >
                    <FaArrowLeft className="w-5 h-5 text-[#081c4b]" />
                </button>

                {loading && (
                    <div className="animate-pulse space-y-4">
                        <div className="bg-gray-200 w-full h-40 rounded-2xl"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="flex gap-4">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-12 bg-gray-300 rounded-xl"></div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between py-4 border-b">
                                <div className="space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-4 w-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && (
                    <>
                        {module && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                                <div className="w-full aspect-[16/9]">
                                    <img
                                        src={module.image_url}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                            {module?.title}
                        </h2>

                        <div className="flex items-center gap-5 text-sm text-gray-500 mt-2 mb-5">
                            <div className="flex items-center gap-2">
                                <FaBookOpen className="text-blue-600" />
                                <span>{contents.length} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-blue-600" />
                                <span>Total: {totalMinutes} min</span>
                            </div>
                        </div>

                        {contents.length > 0 && (
                            <button
                                onClick={() => handlePlay(contents[0], 0)}
                                className="w-full bg-[#1E293B] text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-6 text-sm font-medium"
                            >
                                <FaPlay />
                                Listen Now
                            </button>
                        )}

                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Learning Modules
                        </h3>

                        <div className="divide-y">
                            {contents.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePlay(item, index)}
                                    className={`py-4 flex items-center justify-between cursor-pointer
                                        ${currentAudio?.id === item.id ? "bg-blue-50 px-3 rounded-xl" : ""}`}
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="text-blue-600 font-semibold">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className={`font-medium ${currentAudio?.id === item.id ? "text-blue-600" : "text-gray-800"
                                                }`}>
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.description}
                                            </p>

                                            {currentAudio?.id === item.id && (
                                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                                    <div
                                                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-3">
                                        <span className="text-sm text-gray-500">
                                            {item.duration}:00
                                        </span>
                                        <button
                                            onClick={(e) => handleToggle(e, item, index)}
                                            className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                                        >
                                            {currentAudio?.id === item.id && isPlaying ? (
                                                <FaPause size={12} />
                                            ) : (
                                                <FaPlay size={12} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentAudio && (
                    <div
                        onClick={navigateToAudioPlayer}
                        className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl p-4 flex justify-between items-center shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow z-50"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-blue-600 truncate">
                                {currentAudio.title}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                                {currentAudio.description}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div
                                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                                setPlayingId(isPlaying ? null : currentAudio.id);
                            }}
                            className="bg-[#1E293B] text-white p-3 rounded-full ml-3 hover:bg-gray-800 transition-colors flex-shrink-0"
                        >
                            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
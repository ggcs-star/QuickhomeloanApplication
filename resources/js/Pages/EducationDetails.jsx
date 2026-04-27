import AppLayout from "../Layouts/AppLayout";
// import { audioLibraryData } from "../AudioData/audioLibraryData";
import { router, usePage } from "@inertiajs/react";
import {
    FaArrowLeft,
    FaPlay,
    FaPause,
    FaClock,
    FaBookOpen,
    FaRegImage,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Capacitor } from '@capacitor/core';

export default function EducationDetails() {
    const { props } = usePage();
    const category = props.category;

    const BASE_URL = import.meta.env.VITE_APP_URL;

    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);

    const audioRef = useRef(null);

    const filteredAudios = audioLibraryData.filter(
        (item) => item.category === category
    );

    const totalMinutes = filteredAudios.reduce((sum, item) => {
        const [min, sec] = item.duration.split(":").map(Number);
        return sum + min + sec / 60;
    }, 0);

    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);



    
 const playAudio = async (url) => {
    window.AudioService.play(url);
};

const pauseAudio = async () => {
    window.AudioService.pause();
};
    const stopAudio = async () => {
        const plugin = window.Capacitor?.Plugins?.AudioPlugin;

        if (!plugin) return;

        try {
            await plugin.stop();
        } catch (e) {
            console.log("Stop error:", e);
        }
    };

   
    const handlePlay = (audio) => {
        try {
            const url = `${BASE_URL}${audio.file}`;

            if (playingId === audio.id) {
                stopAudio();
                setPlayingId(null);
                return;
            }

            playAudio(url);

            setCurrentAudio(audio);
            setPlayingId(audio.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppLayout showBottomNav={false}>
            <div className="min-h-screen bg-gray-100 px-4 py-6 pb-28">

                {/* BACK */}
                <button
                    onClick={() => {
                        stopAudio();
                        router.visit("/education");
                    }}
                    className="mb-4 text-gray-700"
                >
                    <FaArrowLeft size={18} />
                </button>

                {/* TITLE */}
                <h1 className="text-xl font-bold text-gray-900">
                    {category.replace(/^\d+\.\s*/, "")}
                </h1>

                {/* STATS */}
                <div className="flex items-center gap-5 text-sm text-gray-500 mt-2 mb-6">

                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md">
                            <FaBookOpen size={12} />
                        </div>
                        <span>{filteredAudios.length} lessons</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md">
                            <FaClock size={12} />
                        </div>
                        <span>Total: {Math.round(totalMinutes)} min</span>
                    </div>

                </div>

                {/* START BUTTON */}
                <button
                    onClick={() => handlePlay(filteredAudios[0])}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 mb-6 shadow"
                >
                    <FaPlay />
                    Start Learning
                </button>

                {/* LIST */}
                <div className="space-y-3">
                    {filteredAudios.map((audio, index) => (
                        <div
                            key={audio.id}
                            onClick={() => handlePlay(audio)}
                            className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-between
              ${playingId === audio.id
                                    ? "bg-blue-50 border-blue-200"
                                    : "border-gray-200"
                                }`}
                        >

                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 w-5 text-sm">
                                    {index + 1}
                                </span>

                                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                                    <FaRegImage size={14} />
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {audio.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {audio.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    {audio.duration}
                                </span>

                                {playingId === audio.id ? (
                                    <div className="bg-black p-2 rounded-full">
                                        <FaPause size={12} className="text-white" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        <FaPlay size={12} className="text-gray-700" />
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>

                {/* MINI PLAYER */}
                {currentAudio && (
                    <div className="fixed bottom-4 left-4 right-4 bg-blue-200 rounded-2xl p-4 flex justify-between items-center">

                        <div>
                            <p className="font-semibold">{currentAudio.title}</p>
                            <p className="text-sm">{currentAudio.desc}</p>
                        </div>

                        <button
                            onClick={() => handlePlay(currentAudio)}
                            className="bg-black text-white p-3 rounded-full"
                        >
                            {playingId ? <FaPause /> : <FaPlay />}
                        </button>

                    </div>
                )}

            </div>
        </AppLayout>
    );
}
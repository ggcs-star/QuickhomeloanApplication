import { useEffect, useState } from "react";
import { Play, Clock, Headphones, X } from "lucide-react";
import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

export default function PodcastPage() {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPodcast, setSelectedPodcast] = useState(null);

    useEffect(() => {
        fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/podcasts');
            const podcastsData = response.data.data.data || response.data.data || [];
            setPodcasts(podcastsData);
        } catch (error) {
            console.error('Error fetching podcasts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThumbnailUrl = (podcast) => {
        if (podcast.thumbnail_url && podcast.thumbnail_url !== 'null') {
            return podcast.thumbnail_url;
        }
        
        const videoId = getYouTubeId(podcast.youtube_url);
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        
        return null;
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const getEmbedUrl = (url) => {
        const videoId = getYouTubeId(url);
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        return url;
    };

    const openPlayer = (podcast) => {
        setSelectedPodcast(podcast);
    };

    const closePlayer = () => {
        setSelectedPodcast(null);
    };

    if (loading) {
        return (
            <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
                <div className="min-h-screen bg-white">
                    <div className="max-w-[640px] mx-auto bg-white min-h-screen">
                        <div className="p-4 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-xl mb-3"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
            <div className="min-h-screen bg-white">
                <div className="max-w-[640px] mx-auto bg-white min-h-screen pb-24">
                    {/* Header */}
                    <div className="px-4 py-4 sticky top-0 bg-white z-20 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => window.history.back()} 
                                className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Podcast</h1>
                        </div>
                    </div>

                    {/* Hero Section */}
                    {/* <div className="relative h-56 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                        <div className="text-center text-white">
                            <Headphones size={52} className="mx-auto mb-3" />
                            <h2 className="text-2xl font-bold">Smart Loan Talks</h2>
                            <p className="text-purple-100 text-sm mt-1">Learn on-the-go with expert insights</p>
                        </div>
                    </div> */}

                    {/* Podcasts List */}
                    <div className="p-4 space-y-5">
                        {podcasts.map((podcast) => (
                            <div 
                                key={podcast.id} 
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                <div className="relative h-52 bg-gray-900 cursor-pointer" onClick={() => openPlayer(podcast)}>
                                    {getThumbnailUrl(podcast) ? (
                                        <img 
                                            src={getThumbnailUrl(podcast)} 
                                            alt={podcast.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/images/podcast-placeholder.jpg";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center">
                                            <Play size={48} className="text-white opacity-60" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Play size={28} className="text-purple-600 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {podcast.title}
                                    </h3>
                                    <div className="flex items-center gap-5 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Headphones size={14} />
                                            <span>{podcast.episodes_count || 0} Episodes</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>Total: {podcast.total_duration || '0 min'}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => openPlayer(podcast)}
                                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition active:scale-98"
                                    >
                                        Listen Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {podcasts.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <Headphones size={56} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800">No podcasts yet</h3>
                            <p className="text-sm text-gray-500 text-center mt-1">
                                Check back soon for new episodes!
                            </p>
                        </div>
                    )}

                    {/* Video Player Modal */}
                    {selectedPodcast && (
                        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4" onClick={closePlayer}>
                            <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    onClick={closePlayer}
                                    className="absolute -top-12 right-0 text-white p-2 hover:text-gray-300 transition z-10"
                                >
                                    <X size={28} />
                                </button>
                                <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <iframe
                                        src={getEmbedUrl(selectedPodcast.youtube_url)}
                                        title={selectedPodcast.title}
                                        className="w-full aspect-video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="mt-4 text-white">
                                    <h3 className="font-bold text-lg">{selectedPodcast.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {selectedPodcast.episodes_count} Episodes • {selectedPodcast.total_duration}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
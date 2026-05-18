import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, BookOpen, Video, Mic, MessageSquare, Calculator, Calendar, Building, ArrowRight, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageSkeleton from "@/components/Skeleton/PageSkeleton";
import api from "@/api";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeType, setActiveType] = useState("all");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);
    const searchDebounceTimer = useRef(null);

    const types = [
        { id: "all", label: "All", icon: Search },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "reels", label: "Reels", icon: Video },
        { id: "podcasts", label: "Podcasts", icon: Mic },
        { id: "community", label: "Community", icon: MessageSquare },
        { id: "calculators", label: "Calculators", icon: Calculator },
        { id: "events", label: "Events", icon: Calendar },
        { id: "lenders", label: "Lenders", icon: Building },
    ];

    useEffect(() => {
        const saved = localStorage.getItem("recent_searches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const type = urlParams.get("type");
        
        if (type && type !== "all") {
            setActiveType(type);
        }
        
        if (q) {
            setQuery(q);
            performSearch(q, type || "all");
        }
        
        inputRef.current?.focus();
    }, []);

    const deleteRecentSearch = useCallback((searchTerm, e) => {
        e.stopPropagation();
        const updated = recentSearches.filter(s => s !== searchTerm);
        setRecentSearches(updated);
        localStorage.setItem("recent_searches", JSON.stringify(updated));
    }, [recentSearches]);

    const clearAllRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.setItem("recent_searches", JSON.stringify([]));
    }, []);

    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await api.get(`/search/suggestions?q=${searchQuery}`);
                setSuggestions(res.data.data || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error(error);
            }
        }, 300);
    }, []);

    const performSearch = useCallback(async (searchQuery, type = activeType) => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recent_searches", JSON.stringify(updated));
        
        const newUrl = `/search?q=${encodeURIComponent(searchQuery)}&type=${type}`;
        window.history.pushState({}, "", newUrl);
        
        try {
            const res = await api.get(`/search?q=${searchQuery}&type=${type}`);
            setResults(res.data.data.results || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [activeType, recentSearches]);

    const handleSuggestionClick = (suggestionTitle) => {
        setShowSuggestions(false);
        setQuery(suggestionTitle);
        performSearch(suggestionTitle);
    };

    const handleRecentClick = useCallback((term) => {
        setQuery(term);
        setShowSuggestions(false);
        performSearch(term);
    }, [performSearch]);

    const handleTypeChange = useCallback((typeId) => {
        setActiveType(typeId);
        if (query) {
            performSearch(query, typeId);
        } else {
            window.history.pushState({}, "", `/search?type=${typeId}`);
        }
    }, [query, performSearch]);

    const clearSearch = useCallback(() => {
        setQuery("");
        setResults([]);
        setSuggestions([]);
        setShowSuggestions(false);
        window.history.pushState({}, "", "/search");
        inputRef.current?.focus();
    }, []);

    const getIcon = (iconName) => {
        const icons = {
            BookOpen: BookOpen,
            Video: Video,
            Mic: Mic,
            MessageSquare: MessageSquare,
            Calculator: Calculator,
            Calendar: Calendar,
            Building: Building,
        };
        const Icon = icons[iconName] || Search;
        return <Icon size={18} />;
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (searchDebounceTimer.current) {
                clearTimeout(searchDebounceTimer.current);
            }
            performSearch(query);
        }
    }, [query, performSearch]);

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setQuery(value);
        fetchSuggestions(value);
        
        if (searchDebounceTimer.current) {
            clearTimeout(searchDebounceTimer.current);
        }
        
        if (value.trim().length >= 2) {
            searchDebounceTimer.current = setTimeout(() => {
                performSearch(value);
            }, 500);
        } else if (value.length === 0) {
            setResults([]);
        }
    }, [fetchSuggestions, performSearch]);

    if (loading) {
        return (
            <AppLayout showBottomNav={true} showTopNav={false}>
                <PageSkeleton>
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </PageSkeleton>
            </AppLayout>
        );
    }

    return (
        <AppLayout showBottomNav={true} showTopNav={false}>
            <div className="min-h-screen bg-gray-50">
                <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.visit("/")} 
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex-1 relative">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search for loans, tools, courses, reels, podcasts..."
                                    className="w-full h-12 pl-10 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    autoFocus
                                />
                                {query && (
                                    <button 
                                        onClick={clearSearch} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
                                    >
                                        <X size={16} className="text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto sticky top-[73px] z-10">
                    <div className="flex gap-2">
                        {types.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => handleTypeChange(type.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2
                                        ${activeType === type.id 
                                            ? "bg-blue-600 text-white shadow-md" 
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <Icon size={14} />
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 max-w-4xl mx-auto">
                    {!query && recentSearches.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                    <Clock size={14} /> Recent Searches
                                </h3>
                                <button
                                    onClick={clearAllRecentSearches}
                                    className="text-xs text-red-500 hover:text-red-600 transition flex items-center gap-1"
                                >
                                    <Trash2 size={12} /> Clear All
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {recentSearches.map((s, i) => (
                                    <div
                                        key={i}
                                        className="group flex items-center gap-2 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                                    >
                                        <button
                                            onClick={() => handleRecentClick(s)}
                                            className="flex-1 px-4 py-3 text-left flex items-center gap-3"
                                        >
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{s}</span>
                                        </button>
                                        <button
                                            onClick={(e) => deleteRecentSearch(s, e)}
                                            className="px-3 py-3 text-gray-400 hover:text-red-500 transition"
                                            title="Remove from recent searches"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {query && showSuggestions && suggestions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                                <Search size={14} /> Suggestions
                            </h3>
                            <div className="flex flex-col gap-2">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(s.title)}
                                        className="group px-4 py-3 bg-white rounded-xl border border-gray-100 text-left hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Search size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{s.title}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query && (
                        <>
                            {results.length > 0 && !loading && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                                </p>
                            )}
                            
                            {results.length === 0 && !loading && query && suggestions.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Search size={32} className="text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 text-lg">No results found for "{query}"</p>
                                    <p className="text-sm text-gray-400 mt-1">Try different keywords or check your spelling</p>
                                </div>
                            )}
                            
                            <div className="space-y-3">
                                {results.map((result, i) => (
                                    <div
                                        key={i}
                                        onClick={() => router.visit(result.url)}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">
                                                {getIcon(result.icon)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                        {result.type}
                                                    </span>
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {result.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                    {result.description}
                                                </p>
                                            </div>
                                            <ArrowRight size={18} className="text-gray-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
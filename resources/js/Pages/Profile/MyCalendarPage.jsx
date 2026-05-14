import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, CheckSquare, Clock, Bell } from "lucide-react";
import { router } from "@inertiajs/react";
import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

export default function MyCalendarPage() {
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("events");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            const allData = response.data.data || [];
            setEvents(allData.filter(item => item.type === 'event'));
            setTasks(allData.filter(item => item.type === 'task'));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (datetime) => {
        if (!datetime) return '';
        const date = new Date(datetime);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (item) => {
        if (item.is_all_day) return "All Day";
        const date = new Date(item.start_datetime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const currentData = activeTab === 'events' ? events : tasks;
    const currentCount = currentData.length;

    if (loading) {
        return (
            <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-[640px] mx-auto bg-gray-50 min-h-screen">
                        <div className="px-4 py-4 sticky top-0 bg-gray-50 z-20 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-[640px] mx-auto bg-gray-50 min-h-screen pb-24">
                    {/* Header */}
                    <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 border-b border-gray-100">
                        <div className="px-4 py-4">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => router.visit("/profile")} 
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition active:scale-95"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">My Calendar</h1>
                            </div>
                        </div>

                        {/* Tabs - Events & Tasks */}
                        <div className="px-4 pb-3">
                            <div className="flex gap-2 bg-gray-100/80 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab("events")}
                                    className={`
                                        flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${activeTab === "events" 
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar size={16} />
                                        <span>Events</span>
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded-full
                                            ${activeTab === "events" 
                                                ? 'bg-white/20 text-white' 
                                                : 'bg-gray-200 text-gray-600'
                                            }
                                        `}>
                                            {events.length}
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("tasks")}
                                    className={`
                                        flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${activeTab === "tasks" 
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckSquare size={16} />
                                        <span>Tasks</span>
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded-full
                                            ${activeTab === "tasks" 
                                                ? 'bg-white/20 text-white' 
                                                : 'bg-gray-200 text-gray-600'
                                            }
                                        `}>
                                            {tasks.length}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* List Content */}
                    <div className="p-4 space-y-3">
                        {currentCount > 0 ? (
                            currentData.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className={`
                                            flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
                                            ${item.type === "event" 
                                                ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
                                                : 'bg-gradient-to-br from-yellow-100 to-yellow-200'
                                            }
                                        `}>
                                            {item.type === "event" ? (
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            ) : (
                                                <CheckSquare className="w-6 h-6 text-yellow-600" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`
                                                    text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full
                                                    ${item.type === "event" 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }
                                                `}>
                                                    {item.type === "event" ? "EVENT" : "TASK"}
                                                </span>
                                                {item.repeat_type !== "none" && (
                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {item.repeat_type}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-semibold text-gray-900 text-base mb-1">
                                                {item.title}
                                            </h3>

                                            {item.description && (
                                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(item.start_datetime)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(item)}
                                                    </span>
                                                </div>
                                                {item.reminder_time && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Bell size={12} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            Reminder at {formatTime({ ...item, start_datetime: item.reminder_time })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                    {activeTab === "events" ? (
                                        <Calendar className="w-12 h-12 text-gray-400" />
                                    ) : (
                                        <CheckSquare className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    No {activeTab === "events" ? "Events" : "Tasks"} yet
                                </h3>
                                <p className="text-sm text-gray-500 text-center">
                                    Create a new {activeTab === "events" ? "event" : "task"} to get started
                                </p>
                                <button
                                    onClick={() => router.visit("/tools/calendar")}
                                    className="mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition active:scale-95"
                                >
                                    + Create {activeTab === "events" ? "Event" : "Task"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
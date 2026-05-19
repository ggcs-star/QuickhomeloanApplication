import { useEffect, useState, useCallback, useMemo } from "react";
import { Bell, CheckCircle, Inbox, ArrowLeft, Circle } from "lucide-react";
import { router } from "@inertiajs/react";
import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [updatingIds, setUpdatingIds] = useState(new Set());

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user-notifications');
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = useCallback(async (notificationId) => {
        if (updatingIds.has(notificationId)) return;

        try {
            setUpdatingIds(prev => new Set(prev).add(notificationId));
            
            const notification = notifications.find(n => n.id === notificationId);
            if (notification?.is_read) return;

            setNotifications(prev => prev.map(n => 
                n.id === notificationId ? { ...n, is_read: true } : n
            ));

            await api.post(`/user-notifications/read/${notificationId}`);
            window.dispatchEvent(new CustomEvent('notificationRead'));
            
        } catch (error) {
            setNotifications(prev => prev.map(n => 
                n.id === notificationId ? { ...n, is_read: false } : n
            ));
            console.error('Error marking notification as read:', error);
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        }
    }, [notifications, updatingIds]);

    const formatRelativeTime = useCallback((dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return `just now`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const getNotificationType = (title) => {
        if (title?.includes('Event')) return 'event';
        if (title?.includes('Task')) return 'task';
        if (title?.includes('📅')) return 'event';
        if (title?.includes('✅')) return 'task';
        return 'default';
    };

    const filteredNotifications = useMemo(() => {
        switch (activeTab) {
            case "unread":
                return notifications.filter(n => !n.is_read);
            case "read":
                return notifications.filter(n => n.is_read);
            default:
                return notifications;
        }
    }, [notifications, activeTab]);

    const tabs = [
        { id: "all", label: "All", count: notifications.length },
        { id: "unread", label: "Unread", count: notifications.filter(n => !n.is_read).length },
        { id: "read", label: "Read", count: notifications.filter(n => n.is_read).length }
    ];

    if (loading) {
        return (
            <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
                <div className="min-h-screen bg-[#f5f7fd]">
                    <div className="max-w-[640px] mx-auto bg-[#f5f7fd] min-h-screen">
                        <div className="sticky top-0 bg-white z-20 border-b border-[#edf1f7]">
                            <div className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-2xl border border-[#edf1f7] p-4 shadow-sm animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20"></div>
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
            <div className="min-h-screen bg-[#f5f7fd]">
                <div className="max-w-[640px] mx-auto bg-[#f5f7fd] min-h-screen pb-24">
                    
                    {/* Header - Exactly like Calendar */}
                    <div className="sticky top-0 bg-white z-20 border-b border-[#edf1f7]">
                        <div className="px-4 py-4">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => router.visit("/")} 
                                    className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm transition active:scale-95"
                                >
                                    <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
                                </button>
                                <h1 className="text-xl font-bold text-[#081c4b]">Notifications</h1>
                            </div>
                        </div>

                        {/* Tabs - Same style as Calendar Events/Tasks tabs */}
                        <div className="px-4 pb-3">
                            <div className="flex gap-2 bg-[#f5f7fd] p-1 rounded-xl">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                            ${activeTab === tab.id 
                                                ? 'bg-[#001B5E] text-white shadow-md' 
                                                : 'text-gray-600 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span>{tab.label}</span>
                                            {tab.count > 0 && (
                                                <span className={`
                                                    text-xs px-2 py-0.5 rounded-full
                                                    ${activeTab === tab.id 
                                                        ? 'bg-white/20 text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                    }
                                                `}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications List - Same card style as Calendar */}
                    <div className="p-4 space-y-3">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                    className={`
                                        bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                                        ${!notification.is_read 
                                            ? 'border-l-4 border-l-[#001B5E] border-[#edf1f7]' 
                                            : 'border-[#edf1f7]'
                                        }
                                    `}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon - Same style as Calendar */}
                                        <div className={`
                                            flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
                                            ${!notification.is_read 
                                                ? 'bg-blue-50' 
                                                : 'bg-gray-50'
                                            }
                                        `}>
                                            <Bell className={`
                                                w-6 h-6
                                                ${!notification.is_read ? 'text-[#001B5E]' : 'text-gray-400'}
                                            `} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className={`
                                                    font-semibold text-[#081c4b] text-base
                                                    ${!notification.is_read ? 'font-bold' : ''}
                                                `}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.is_read && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-[#001B5E] rounded-full"></div>
                                                    </div>
                                                )}
                                                {notification.is_read && (
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-500 leading-relaxed mb-2">
                                                {notification.body}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {formatRelativeTime(notification.created_at)}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#001B5E]">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            {/* Admin vs User Tag - Same style as Calendar type tags */}
                                            {(notification.title?.includes('Admin') || notification.title?.includes('Broadcast')) ? (
                                                <div className="mt-2">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-100 text-[#001B5E]">
                                                        Admin
                                                    </span>
                                                </div>
                                            ) : notification.title?.includes('Event') || notification.title?.includes('📅') ? (
                                                <div className="mt-2">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#001B5E]">
                                                        Event
                                                    </span>
                                                </div>
                                            ) : notification.title?.includes('Task') || notification.title?.includes('✅') ? (
                                                <div className="mt-2">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-100 text-[#001B5E]">
                                                        Task
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="mt-2">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                        Reminder
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State - Same as Calendar */
                            <div className="flex flex-col items-center justify-center py-20 px-4">
                                <div className="w-24 h-24 bg-[#f5f7fd] rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-12 h-12 text-[#001B5E]/40" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                    No notifications
                                </h3>
                                <p className="text-sm text-gray-500 text-center">
                                    {activeTab === "all" 
                                        ? "You don't have any notifications yet" 
                                        : activeTab === "unread"
                                        ? "You've read all your notifications"
                                        : "No read notifications found"}
                                </p>
                                {activeTab === "unread" && notifications.filter(n => !n.is_read).length === 0 && notifications.length > 0 && (
                                    <button 
                                        onClick={() => setActiveTab("all")}
                                        className="mt-4 px-6 py-2.5 bg-[#001B5E] text-white rounded-xl text-sm font-medium hover:bg-[#002a8a] transition active:scale-95"
                                    >
                                        View all notifications
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
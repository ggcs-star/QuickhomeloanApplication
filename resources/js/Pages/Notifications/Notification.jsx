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
            <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-[640px] mx-auto bg-gray-50 min-h-screen">
                        <div className="sticky top-0 bg-gray-50 z-20 border-b border-gray-100">
                            <div className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="px-4 pb-3">
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
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
        <AppLayout showBottomNav={true} showTopNav={false} showFooter={false}>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-[640px] mx-auto bg-gray-50 min-h-screen pb-24">
                    {/* Sticky Header */}
                    <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 border-b border-gray-100">
                        <div className="px-4 py-4">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => router.visit("/")} 
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition active:scale-95"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-4 pb-3">
                            <div className="flex gap-2 bg-gray-100/80 p-1 rounded-xl">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                            ${activeTab === tab.id 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span>{tab.label}</span>
                                            {tab.count > 0 && (
                                                <span className={`
                                                    text-xs px-2 py-0.5 rounded-full font-medium
                                                    ${activeTab === tab.id 
                                                        ? 'bg-gray-100 text-gray-700' 
                                                        : 'bg-gray-200 text-gray-600'
                                                    }
                                                `}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </div>
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="px-4 py-3 space-y-3">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => {
                                const type = getNotificationType(notification.title);
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                                        className={`
                                            bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 active:scale-[0.98]
                                            ${!notification.is_read 
                                                ? 'border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md' 
                                                : 'border border-gray-100 hover:border-gray-200 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`
                                                flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
                                                ${!notification.is_read 
                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                                                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                                                }
                                            `}>
                                                <Bell className={`
                                                    w-6 h-6
                                                    ${!notification.is_read ? 'text-white' : 'text-gray-500'}
                                                `} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className={`
                                                        text-sm font-medium
                                                        ${!notification.is_read ? 'text-gray-900 font-semibold' : 'text-gray-700'}
                                                    `}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.is_read && (
                                                        <div className="flex-shrink-0">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        </div>
                                                    )}
                                                    {notification.is_read && (
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                                    {notification.body}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">
                                                        {formatRelativeTime(notification.created_at)}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Admin vs User Tag */}
                                                {notification.title?.includes('Admin') || notification.title?.includes('Broadcast') ? (
                                                    <div className="mt-2">
                                                        <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                                            Admin
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2">
                                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                            Reminder
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    No notifications
                                </h3>
                                <p className="text-sm text-gray-500 text-center max-w-xs">
                                    {activeTab === "all" 
                                        ? "You don't have any notifications yet" 
                                        : activeTab === "unread"
                                        ? "You've read all your notifications"
                                        : "No read notifications found"}
                                </p>
                                {activeTab === "unread" && notifications.filter(n => !n.is_read).length === 0 && notifications.length > 0 && (
                                    <button 
                                        onClick={() => setActiveTab("all")}
                                        className="mt-4 text-sm text-blue-600 font-medium"
                                    >
                                        View all notifications →
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
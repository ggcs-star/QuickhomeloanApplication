import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, Clock } from "lucide-react";
import { router } from "@inertiajs/react";
import api from "@/api";
import AppLayout from "@/Layouts/AppLayout";
import AddEventModal from "../../Components/Calendar/AddEventModal";

export default function CalendarPage() {
    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <Calendar />
        </AppLayout>
    );
}

/* =====================================================
   🔹 MAIN CALENDAR COMPONENT
===================================================== */
function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selected, setSelected] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    /* ---------- FETCH EVENTS ---------- */
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/events");

            if (res.data.status) {
                setAllEvents(res.data.data);
            }
        } catch (err) {
            console.error("Event API error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- FILTER EVENTS LOCALLY (MULTI-DAY SUPPORT) ---------- */
    const events = useMemo(() => {
        const formatted = {};

        allEvents.forEach((item) => {
            if (!item.start_datetime) return;

            // Start aur End dates nikalo
            const startDate = new Date(item.start_datetime);
            // Agar end date nahi hai (jaise task me), toh usko start date ke barabar maan lo
            const endDate = item.end_datetime ? new Date(item.end_datetime) : startDate;

            // Dates ko normalize karo (taaki sirf date compare ho, time nahi)
            let currentDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const lastDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

            // Loop chalao: Start date se le kar End date tak
            while (currentDay <= lastDay) {
                // Agar ye din current view wale month/year me aata hai, toh isko calendar me daalo
                if (currentDay.getMonth() === month && currentDay.getFullYear() === year) {
                    const day = currentDay.getDate();
                    if (!formatted[day]) formatted[day] = [];
                    
                    // Duplicate check (taaki ek hi event ek din me do baar na dikhe)
                    if (!formatted[day].some(e => e.id === item.id)) {
                        formatted[day].push(item);
                    }
                }
                // Next day par jao
                currentDay.setDate(currentDay.getDate() + 1);
            }
        });

        return formatted;
    }, [allEvents, month, year]);

    /* ---------- CALENDAR GENERATION ---------- */
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Monday as first day (0 = Monday, 6 = Sunday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];

    // Previous month days
    for (let i = startDay; i > 0; i--) {
        days.push({ day: prevMonthDays - i + 1, current: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, current: true });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, current: false });
    }

    /* ---------- NAVIGATION ---------- */
    const prevMonth = () => setCurrentDate(new Date(year, month - 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1));

    const monthName = currentDate.toLocaleString("default", { month: "long" });

    /* ---------- HELPERS ---------- */
    const isToday = (day) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const selectedEvents = selected ? events[selected] || [] : [];

    // Helper function to format time - FIXED (No extra offset)
const formatEventTime = (event) => {
    if (event.is_all_day) return "All Day";

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const start = formatTime(event.start_datetime);
    const end = formatTime(event.end_datetime);

    if (event.type === "task") return start;
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    return "";
};
    
    const handleGoBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-gray-100">
                <div className="px-4 py-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="px-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                        <div className="grid grid-cols-7 gap-3">
                            {[...Array(42)].map((_, i) => (
                                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full mx-auto" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-10">
            <div className="px-4 py-4 flex items-center justify-between">
                {/* LEFT: BACK */}
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition text-gray-700"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* RIGHT: ADD BUTTON */}
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1f2a44] text-white rounded-lg shadow-sm hover:bg-[#172033] transition"
                >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Add</span>
                </button>
            </div>

            {/* MODAL */}
            {open && <AddEventModal onClose={() => setOpen(false)} onSuccess={fetchEvents} />}

            {/* CALENDAR CARD */}
            <div className="px-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronLeft className="text-gray-600" size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 uppercase">
                            {monthName}, {year}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronRight className="text-gray-600" size={20} />
                        </button>
                    </div>

                    {/* WEEK DAYS */}
                    <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                            <div key={i} className="pb-2">{d}</div>
                        ))}
                    </div>

                    {/* DAYS GRID */}
                    <div className="grid grid-cols-7 gap-y-4 text-center">
                        {days.map((d, i) => {
                            const isSelected = selected === d.day && d.current;
                            const hasEvent = events[d.day];

                            return (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        onClick={() => d.current && setSelected(d.day)}
                                        className={`
                                            w-10 h-10 flex items-center justify-center
                                            text-sm font-medium transition-all duration-200
                                            ${!d.current
                                                ? "text-gray-300 cursor-default"
                                                : "cursor-pointer hover:bg-gray-900 hover:text-white rounded-lg"
                                            }
                                            ${isSelected ? "bg-gray-900 text-white rounded-lg shadow-md" : ""}
                                            ${isToday(d.day) && !isSelected ? "border-2 border-blue-500 rounded-full" : ""}
                                            ${isToday(d.day) && isSelected ? "ring-2 ring-blue-500 ring-offset-2 rounded-lg" : ""}
                                        `}
                                    >
                                        {d.day}
                                    </div>

                                    {/* EVENT DOTS */}
                                    {hasEvent && d.current && (
                                        <div className="flex gap-1 mt-1">
                                            {events[d.day].slice(0, 3).map((e, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full ${e.type === "event" ? "bg-blue-500" : "bg-yellow-500"}`}
                                                />
                                            ))}
                                            {events[d.day].length > 3 && (
                                                <span className="text-[10px] leading-none text-gray-400">+</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* EVENT LIST */}
                    {selected && (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Events on {selected} {monthName}
                                </h3>
                                <button onClick={() => setSelected(null)} className="text-xs text-gray-500 hover:text-gray-700">
                                    Close
                                </button>
                            </div>

                            {selectedEvents.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">No events for this day</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedEvents.map((e, i) => (
                                        <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${e.type === 'event' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                                        {e.type || "EVENT"}
                                                    </span>
                                                    <p className="font-semibold text-sm text-gray-800">
                                                        {e.title}
                                                    </p>
                                                    {e.description && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {e.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm shrink-0">
                                                    <Clock size={12} />
                                                    {formatEventTime(e)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
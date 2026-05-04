import { X, Calendar, Clock, AlignLeft, Type, Repeat, Bell, CheckSquare } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/api";

export default function AddEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: "event",
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    reminder_time: "",
    repeat_type: "none",
    is_all_day: false, // Naya state
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ---------- PREVENT BODY SCROLL WHEN OPEN ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  /* ---------- FORMAT DATETIME FOR BACKEND ---------- */
  const formatDateTime = (date, time) => {
    if (!date) return null;
    const validTime = time ? time : "00:00";
    return `${date} ${validTime}:00`;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors({});

      let payload = {
        type: form.type,
        title: form.title,
        start_datetime: formatDateTime(
          form.start_date,
          form.type === "event" && !form.is_all_day ? form.start_time : "00:00"
        ),
        reminder_time: form.reminder_time ? formatDateTime(form.start_date, form.reminder_time) : null,
      };

      // 🔹 EVENT PAYLOAD
      if (form.type === "event") {
        payload = {
          ...payload,
          description: form.description,
          end_datetime: form.end_date
            ? formatDateTime(form.end_date, form.is_all_day ? "23:59" : form.end_time)
            : null,
          is_all_day: form.is_all_day,
          repeat_type: "none", // Event me repeat nahi hai
        };
      }

      // 🔹 TASK PAYLOAD
      if (form.type === "task") {
        payload = {
          ...payload,
          description: form.description, // Task me bhi description bhej sakte hain agar backend allow kare, otherwise remove.
          end_datetime: null, // Tasks ke liye usually end time nahi hota aapke form logic ke hisaab se
          is_all_day: false,
          repeat_type: form.repeat_type || "none", // Task me repeat hai
        };
      }

      await api.post("/events", payload);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || "Failed to create event");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reusable styling
  const inputStyles =
    "w-full border border-gray-200 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 text-sm sm:text-base outline-none transition-all focus:border-[#1f2a44] focus:bg-white focus:ring-1 focus:ring-[#1f2a44] appearance-none";
  const labelStyles = "block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">

      {/* MODAL CONTAINER */}
      <div className="w-full sm:max-w-md bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">

        {/* MOBILE DRAG INDICATOR */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* HEADER */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-[2rem] sm:rounded-t-2xl shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {form.type === "event" ? "New Event" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-gray-50 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE FORM AREA */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* TYPE TOGGLE */}
            <div className="flex p-1 bg-gray-100/80 rounded-xl">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "event" })}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${form.type === "event" ? "bg-white shadow-sm text-[#1f2a44]" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <Calendar size={16} /> Event
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "task" })}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${form.type === "task" ? "bg-white shadow-sm text-[#1f2a44]" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <CheckSquare size={16} /> Task
              </button>
            </div>

            {/* TITLE */}
            <div>
              <label className={labelStyles}>
                <Type size={14} className="text-gray-400" /> Title
              </label>
              <input
                name="title"
                placeholder="E.g., Team Sync, Doctor Appointment..."
                value={form.title}
                onChange={handleChange}
                className={`${inputStyles} ${errors.title ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelStyles}>
                <AlignLeft size={14} className="text-gray-400" /> Description
              </label>
              <textarea
                name="description"
                placeholder="Add some details..."
                rows="2"
                value={form.description}
                onChange={handleChange}
                className={`${inputStyles} resize-none`}
              />
            </div>

            {/* --- SINGLE DATE FOR TASK --- */}
            {form.type === "task" && (
              <div>
                <label className={labelStyles}>
                  <Calendar size={14} className="text-gray-400" /> Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={`${inputStyles} ${errors.start_datetime ? "border-red-400" : ""}`}
                />
                {errors.start_datetime && <p className="text-red-500 text-xs mt-1.5">{errors.start_datetime}</p>}
              </div>
            )}

            {/* --- START DATE & TIME (ONLY EVENT) --- */}
            {form.type === "event" && (
              <div className="space-y-4">
                {/* ALL DAY TOGGLE */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_all_day"
                    name="is_all_day"
                    checked={form.is_all_day}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1f2a44] border-gray-300 rounded focus:ring-[#1f2a44]"
                  />
                  <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700">
                    All Day Event
                  </label>
                </div>

                <div className={`grid ${form.is_all_day ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4`}>
                  <div>
                    <label className={labelStyles}>
                      <Calendar size={14} className="text-gray-400" /> Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className={`${inputStyles} ${errors.start_datetime ? "border-red-400" : ""}`}
                    />
                  </div>
                  {!form.is_all_day && (
                    <div>
                      <label className={labelStyles}>
                        <Clock size={14} className="text-gray-400" /> Start Time
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleChange}
                        className={inputStyles}
                      />
                    </div>
                  )}
                  {errors.start_datetime && <p className="text-red-500 text-xs col-span-full">{errors.start_datetime}</p>}
                </div>
              </div>
            )}

            {/* --- END DATE & TIME (ONLY EVENT) --- */}
            {form.type === "event" && (
              <div className={`grid ${form.is_all_day ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4`}>
                <div>
                  <label className={labelStyles}>
                    <Calendar size={14} className="text-gray-400" /> End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className={`${inputStyles} ${errors.end_datetime ? "border-red-400" : ""}`}
                  />
                </div>
                {!form.is_all_day && (
                  <div>
                    <label className={labelStyles}>
                      <Clock size={14} className="text-gray-400" /> End Time
                    </label>
                    <input
                      type="time"
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                      className={inputStyles}
                    />
                  </div>
                )}
                {errors.end_datetime && <p className="text-red-500 text-xs col-span-full">{errors.end_datetime}</p>}
              </div>
            )}

            {/* REMINDER & REPEAT */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelStyles}>
                  <Bell size={14} className="text-gray-400" /> Reminder Time
                </label>
                <input
                  type="time"
                  name="reminder_time"
                  value={form.reminder_time}
                  onChange={handleChange}
                  className={`${inputStyles} ${errors.reminder_time ? "border-red-400" : ""}`}
                />
                {errors.reminder_time && <p className="text-red-500 text-xs mt-1.5">{errors.reminder_time}</p>}
              </div>

              {/* REPEAT ONLY FOR TASKS */}
              {form.type === "task" && (
                <div>
                  <label className={labelStyles}>
                    <Repeat size={14} className="text-gray-400" /> Repeat
                  </label>
                  <select
                    name="repeat_type"
                    value={form.repeat_type}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="none">No Repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* FOOTER BUTTON */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-white sm:rounded-b-2xl shrink-0 pb-8 sm:pb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1f2a44] hover:bg-[#151c2e] text-white text-sm sm:text-base font-semibold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-[#1f2a44]/20 focus:ring-2 focus:ring-offset-2 focus:ring-[#1f2a44] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save " + (form.type === "event" ? "Event" : "Task")
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
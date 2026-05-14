import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Send,
    Headphones,
    X,
    CheckCircle,
} from "lucide-react";

import { useState } from "react";
import api from "@/api";

export default function HelpSupport() {
    console.log(api.defaults.baseURL);

    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success"); // success or error
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const showMessage = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const payload = {
                full_name: form.name,
                email: form.email,
                subject: form.subject,
                message: form.message,
            };
            const res = await api.post("/contact", payload);
            
            // Show success message UI
            showMessage("✅ Message sent successfully! Our team will get back to you within 24 hours.");
            
            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.log(error);
            // Show error message UI
            showMessage(
                error?.response?.data?.message || "❌ Something went wrong. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        {
            title: "Phone Support",
            icon: Phone,
            details: "+91 98765 43210",
            subtext: "Mon - Sat, 9 AM - 6 PM",
            bg: "from-[#2563EB] to-[#1D4ED8]",
        },
        {
            title: "Email Us",
            icon: Mail,
            details: "support@quickhomeloan.in",
            subtext: "Usually responds within 24 hours",
            bg: "from-[#0F766E] to-[#115E59]",
        },
        {
            title: "Our Office",
            icon: MapPin,
            details: "4th Floor, The Grand Emporio, Motera Stadium Rd",
            subtext: "Motera, Ahmedabad, Gujarat 380005",
            bg: "from-[#7C3AED] to-[#6D28D9]",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7fd] pb-24 relative">

            {/* TOAST MESSAGE - Custom UI Alert */}
            {showToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg ${
                        toastType === "success" 
                            ? "bg-gradient-to-r from-green-500 to-green-600" 
                            : "bg-gradient-to-r from-red-500 to-red-600"
                    } text-white max-w-[90vw] md:max-w-md`}>
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <p className="text-[13px] font-medium">{toastMessage}</p>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="ml-2 hover:opacity-80 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER - Sticky Top Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-[#edf1f7] px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-10 h-10 rounded-full bg-white border border-[#edf1f7] flex items-center justify-center shadow-sm active:scale-95 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#081c4b]" />
                    </button>
                    <div>
                        <h1 className="text-[24px] font-black tracking-[-0.5px] text-[#081c4b] leading-tight">
                            Help & Support
                        </h1>
                        <p className="text-[12px] text-gray-500 mt-[2px]">
                            We're always here to help you
                        </p>
                    </div>
                </div>
            </div>

            {/* HERO SECTION with house.png image */}
            <div className="px-4 mt-4">
                <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#001B5E] to-[#0038b8] px-5 py-5 text-white">
                    <div className="relative z-10 max-w-[70%]">
                        <p className="text-[11px] opacity-90 font-medium">24/7 Support Available</p>
                        <h2 className="text-[28px] leading-[30px] font-black mt-2 tracking-[-1px]">
                            We're Always Here to Help You
                        </h2>
                        <p className="text-[12px] opacity-90 mt-2 leading-5">
                            Have a question, feedback, or partnership idea? Let's connect — we'll get back to you within 24 hours.
                        </p>
                    </div>
                    <img
                        src="/images/house.png"
                        alt="house"
                        className="absolute right-0 bottom-0 h-[120px] object-contain"
                    />
                </div>
            </div>

            {/* CONTACT CARDS - 3 Column Grid */}
            <div className="px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm transition-all hover:shadow-md"
                        >
                            <div className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${method.bg} flex items-center justify-center shadow-md mt-4 ml-4`}>
                                <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                            </div>
                            <div className="p-4 pt-3">
                                <h3 className="text-[18px] leading-[24px] font-bold text-[#081c4b]">
                                    {method.title}
                                </h3>
                                <div className="h-px bg-[#edf1f7] my-3"></div>
                                <p className="text-[14px] font-semibold text-gray-800 mb-1 break-all">
                                    {method.details}
                                </p>
                                <p className="text-[12px] text-gray-500">
                                    {method.subtext}
                                </p>
                            </div>
                            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.06] bg-gradient-to-br ${method.bg}`} />
                        </div>
                    );
                })}
            </div>

            {/* FORM SECTION */}
            <div className="px-4 mt-6">
                <div className="relative overflow-hidden rounded-[20px] bg-white border border-[#edf1f7] shadow-sm">
                    <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md mt-4 ml-4">
                        <Send className="w-7 h-7 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="p-5 pt-2">
                        <h3 className="text-[20px] leading-[28px] font-bold text-[#081c4b] text-center">
                            Send Us a Message
                        </h3>
                        <p className="text-[12px] text-gray-500 text-center mt-1 mb-6">
                            Fill out the form below and our support team will reach out soon.
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* ROW */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* NAME */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#081c4b] mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full h-11 px-4 rounded-[14px] border border-[#edf1f7] bg-[#fafbfc] outline-none focus:border-[#2563EB] text-[14px] transition"
                                        required
                                    />
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#081c4b] mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full h-11 px-4 rounded-[14px] border border-[#edf1f7] bg-[#fafbfc] outline-none focus:border-[#2563EB] text-[14px] transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#081c4b] mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Message subject"
                                    className="w-full h-11 px-4 rounded-[14px] border border-[#edf1f7] bg-[#fafbfc] outline-none focus:border-[#2563EB] text-[14px] transition"
                                    required
                                />
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#081c4b] mb-2">
                                    Message *
                                </label>
                                <textarea
                                    rows={5}
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-3 rounded-[14px] border border-[#edf1f7] bg-[#fafbfc] outline-none focus:border-[#2563EB] text-[14px] resize-none transition"
                                    required
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="text-center pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 h-11 rounded-full text-[14px] font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.05] bg-gradient-to-br from-[#EA580C] to-[#C2410C]" />
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="px-4 mt-6">
                <div className="bg-gradient-to-r from-[#001B5E] to-[#0038b8] rounded-[20px] p-5 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Headphones className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[18px] font-bold">Ready to take the next step?</h4>
                                <p className="text-[11px] opacity-90">Our team will help you find the best plan for your dream home.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = "https://quickhomeloan.in/apply-loan"}
                            className="bg-white text-[#001B5E] px-6 py-2.5 rounded-full text-[13px] font-semibold shadow-md hover:opacity-90 transition"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Add custom animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                .animate-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
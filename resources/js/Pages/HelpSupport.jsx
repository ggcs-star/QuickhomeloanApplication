import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";

import { useState } from "react";
import api from "@/api";

export default function HelpSupport() {
        console.log(api.defaults.baseURL);

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });

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

const res = await api.post(
    "/contact",
    payload
);

            alert(
                res.data.message ||
                "Inquiry submitted successfully"
            );

            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">

            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">

                <button
                    onClick={() =>
                        window.history.back()
                    }
                    className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-[#111827]" />
                </button>

                <h1 className="text-[15px] font-semibold text-[#111827]">
                    Help & Support
                </h1>

            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* HERO */}
                <div className="text-center mb-16">

                    <h1 className="text-[30px] md:text-[48px] leading-[48px] md:leading-[74px] font-bold text-[#111827] mb-6">
                        We’re Always Here to Help You
                    </h1>

                    <p className="text-[15px] leading-7 text-gray-600 max-w-4xl mx-auto">
                        Have a question, feedback,
                        or partnership idea?
                        Let’s connect — we’ll get
                        back to you within
                        24 hours.
                    </p>

                </div>

                {/* CONTACT CARDS */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">

                    {/* PHONE */}
                    <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center shadow-sm">

                        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">

                            <Phone className="w-8 h-8 text-[#111827]" />

                        </div>

                        <h3 className="text-[28px] font-bold text-[#111827] mb-4">
                            Phone Support
                        </h3>

                        <p className="text-[14px] font-medium text-gray-800 mb-2">
                            +91 98765 43210
                        </p>

                        <p className="text-[14px] text-gray-500">
                            Mon - Sat, 9 AM - 6 PM
                        </p>

                    </div>

                    {/* EMAIL */}
                    <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center shadow-sm">

                        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">

                            <Mail className="w-8 h-8 text-[#111827]" />

                        </div>

                        <h3 className="text-[28px] font-bold text-[#111827] mb-4">
                            Email Us
                        </h3>

                        <p className="text-[22px] font-medium text-gray-800 mb-2 break-all">
                            support@quickhomeloan.in
                        </p>

                        <p className="text-[14px] text-gray-500">
                            Usually responds within 24 hours
                        </p>

                    </div>

                    {/* OFFICE */}
                    <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center shadow-sm">

                        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">

                            <MapPin className="w-8 h-8 text-[#111827]" />

                        </div>

                        <h3 className="text-[28px] font-bold text-[#111827] mb-4">
                            Our Office
                        </h3>

                        <p className="text-[15px] font-medium leading-9 text-gray-800 mb-2">
                            4th Floor, The Grand Emporio,
                            Motera Stadium Rd
                        </p>

                        <p className="text-[14px] text-gray-500">
                            Motera, Ahmedabad,
                            Gujarat 380005
                        </p>

                    </div>

                </div>

                {/* FORM */}
                <div className="bg-white border border-gray-200 rounded-[28px] p-6 md:p-12 shadow-sm mb-20 max-w-5xl mx-auto">

                    <div className="text-center mb-12">

                        <h2 className="text-[28px] md:text-[38px] font-bold text-[#111827] mb-4">
                            Send Us a Message
                        </h2>

                        <p className="text-[15px] text-gray-600">
                            Fill out the form below and our support team
                            will reach out soon.
                        </p>

                    </div>

                    <form
                        className="space-y-8"
                        onSubmit={handleSubmit}
                    >

                        {/* ROW */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* NAME */}
                            <div>

                                <label className="block text-[14px] font-semibold text-[#111827] mb-3">
                                    Full Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full h-12 px-5 rounded-2xl border border-gray-300 outline-none focus:border-black text-[14px]"
                                    required
                                />

                            </div>

                            {/* EMAIL */}
                            <div>

                                <label className="block text-[14px] font-semibold text-[#111827] mb-3">
                                    Email Address *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full h-12 px-5 rounded-2xl border border-gray-300 outline-none focus:border-black text-[14px]"
                                    required
                                />

                            </div>

                        </div>

                        {/* SUBJECT */}
                        <div>

                            <label className="block text-[14px] font-semibold text-[#111827] mb-3">
                                Subject *
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Message subject"
                                className="w-full h-12 px-5 rounded-2xl border border-gray-300 outline-none focus:border-black text-[14px]"
                                required
                            />

                        </div>

                        {/* MESSAGE */}
                        <div>

                            <label className="block text-[14px] font-semibold text-[#111827] mb-3">
                                Message *
                            </label>

                            <textarea
                                rows={6}
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                className="w-full px-5 py-4 rounded-2xl border border-gray-300 outline-none focus:border-black text-[14px] resize-none"
                                required
                            />

                        </div>

                        {/* BUTTON */}
                        <div className="text-center pt-2">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-10 h-12 rounded-2xl text-[15px] font-semibold hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send Message"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* CTA */}
                <div className="rounded-[32px] bg-gradient-to-r from-black via-[#1f1f1f] to-[#3a3a3a] p-8 md:p-14 text-center text-white">

                    <h2 className="text-[26px] md:text-[38px] font-bold mb-5">
                        Let’s Simplify Your Home Loan Journey
                    </h2>

                    <p className="text-[15px] leading-8 text-gray-300 max-w-3xl mx-auto mb-10">
                        Ready to take the next step?
                        Our team will help you find
                        the best plan for your dream home.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

                       <button
    onClick={() =>
        window.location.href =
        "https://quickhomeloan.in/apply-loan"
    }
    className="px-8 h-12 rounded-2xl bg-white text-black font-semibold text-[14px] hover:opacity-90 transition"
>
    Apply Now
</button>

                        {/* <button className="px-8 h-12 rounded-2xl border border-white text-white font-semibold text-[14px] hover:bg-white hover:text-black transition">
                            View FAQs
                        </button> */}

                    </div>

                </div>

            </div>

        </div>
    );
}
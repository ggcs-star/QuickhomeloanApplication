import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, ChevronRight, AlertCircle } from "lucide-react";
import api from "@/api";

/* =====================================================
   🔹 SKELETON FOR FORM AREA ONLY
===================================================== */
function FormSkeleton() {
    return (
        <div className="animate-pulse space-y-4 sm:space-y-5">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 sm:w-1/4" />
                    <div className="h-11 sm:h-12 bg-gray-200 rounded-xl" />
                </div>
            ))}
            <div className="h-12 bg-gray-300 rounded-xl mt-4 sm:mt-6" />
        </div>
    );
}

export default function SmartProfileSetup() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    // Naye states error handling ke liye
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const [form, setForm] = useState({
        pan: "",
        name: "",
        dob: "",
        city: "",
        employment: "",
        income: "",
        existing_emi: "",
        loan_amount: "",
        property_stage: "",
    });

    /* =====================================================
       🔹 FETCH EXISTING APPLICATION (RESUME)
    ===================================================== */
    useEffect(() => {
        fetchApplication();
    }, []);

    const fetchApplication = async () => {
        try {
            const res = await api.get("/loan/submit-form");

            if (res.data.success && res.data.data) {
                const app = res.data.data;
                const d = app.data || {};

                // ✅ Step detection
                if (app.step_completed >= 3) {
                    setStep(3);
                } else {
                    setStep(app.step_completed + 1);
                }

                // ✅ Prefill data
                setForm((prev) => ({
                    ...prev,
                    pan: d.pan || "",
                    name: d.full_name || "",
                    dob: d.dob || "",
                    city: d.city || "",
                    employment: d.employment_type || "",
                    income: d.income || "",
                    existing_emi: d.existing_emi || "",
                    loan_amount: d.loan_amount || "",
                    property_stage: d.property_stage || "",
                }));
            }
        } catch (err) {
            console.log("Resume API error:", err);
        } finally {
            setInitialLoading(false);
        }
    };

    /* =====================================================
       🔹 INPUT CHANGE
    ===================================================== */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Error clear karo jab user type karna start kare
        setErrors({ ...errors, [e.target.name]: "" });
        setGeneralError(""); 
    };

    /* =====================================================
       🔹 SUBMIT
    ===================================================== */
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});
            setGeneralError("");

            let payload = { step };

            if (step === 1) {
                payload = {
                    ...payload,
                    pan: form.pan,
                    full_name: form.name,
                    dob: form.dob,
                    city: form.city,
                    employment_type: form.employment,
                };
            }

            if (step === 2) {
                const income = parseInt(form.income, 10);
                const emi = parseInt(form.existing_emi, 10) || 0; 
                const loan = parseInt(form.loan_amount, 10);

                
                if (!income || income < 10000) {
                    setErrors({ income: "Minimum ₹10,000 required" });
                    setLoading(false);
                    return;
                }

                if (emi < 0) {
                    setErrors({ existing_emi: "Invalid EMI amount" });
                    setLoading(false);
                    return;
                }

                if (!loan || loan < 100000) {
                    setErrors({ loan_amount: "Minimum ₹1,00,000 required" });
                    setLoading(false);
                    return;
                }

                payload = {
                    ...payload,
                    income,
                    existing_emi: emi,
                    loan_amount: loan,
                };
            }

            if (step === 3) {
                payload = {
                    ...payload,
                    property_stage: form.property_stage,
                };
            }

            const res = await api.post("/loan/submit-form", payload);
            const { success, message, data } = res.data;

            if (success) {
                if (message?.includes("already completed")) {
                    setStep((prev) => prev + 1);
                    return;
                }

                if (step < 3) {
                    setStep((prev) => prev + 1);
                } else {
                    alert("Application Completed 🎉");
                    console.log(data);
                }
            } else {
                setGeneralError(message || "Something went wrong.");
            }

        } catch (err) {
            console.error("Submit error:", err);

            if (err.response?.data?.errors) {
                // Laravel/API bhejta hai: { pan: ["Invalid PAN"] }
                // Isko format karke string me convert karenge taaki UI me sahi dikhe
                const backendErrors = err.response.data.errors;
                const formattedErrors = {};
                for (const key in backendErrors) {
                    formattedErrors[key] = Array.isArray(backendErrors[key]) 
                        ? backendErrors[key][0] 
                        : backendErrors[key];
                }
                setErrors(formattedErrors);
            } else if (err.response?.data?.message) {
                // General message jaise "Server Error" ya "Unauthorized"
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       🔹 STEP RENDERERS
    ===================================================== */

    const renderStep1 = () => (
        <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="PAN Number" name="pan" value={form.pan} onChange={handleChange} error={errors.pan} placeholder="ABCDE1234F" />
                <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.full_name} placeholder="Enter full name" />
            </div>

            <InputDate label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} error={errors.dob} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    options={[
                        { label: "Ahmedabad", value: "Ahmedabad" },
                        { label: "Surat", value: "Surat" },
                        { label: "Vadodara", value: "Vadodara" },
                        { label: "Rajkot", value: "Rajkot" }
                    ]}
                    error={errors.city}
                />

                <Select
                    label="Employment Type"
                    name="employment"
                    value={form.employment}
                    onChange={handleChange}
                    options={[
                        { label: "Salaried", value: "Salaried" },
                        { label: "Self Employed", value: "Self Employed" }
                    ]}
                    error={errors.employment_type}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4 sm:space-y-5">
            <Input
                label="Monthly Income (₹)"
                type="number"
                name="income"
                value={form.income}
                onChange={handleChange}
                error={errors.income}
                placeholder="Enter monthly income"
            />
            <Input
                label="Existing EMI (₹)"
                type="number"
                name="existing_emi"
                value={form.existing_emi}
                onChange={handleChange}
                error={errors.existing_emi}
                placeholder="Enter existing EMI amount (if any)"
            />
            <Input
                label="Loan Amount (₹)"
                type="number"
                name="loan_amount"
                value={form.loan_amount}
                onChange={handleChange}
                error={errors.loan_amount}
                placeholder="Enter required loan amount"
            />
        </div>
    );

    const renderStep3 = () => (
        <Select
            label="Property Stage"
            name="property_stage"
            value={form.property_stage}
            onChange={handleChange}
            options={[
                { label: "Under Construction", value: "under_construction" },
                { label: "Ready Property", value: "ready_property" },
                { label: "Plot", value: "plot" }
            ]}
            error={errors.property_stage}
        />
    );

    /* =====================================================
       🔹 MAIN UI
    ===================================================== */

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Container with max-width for larger screens */}
            <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <button
                        onClick={() => (step === 1 ? window.history.back() : setStep(step - 1))}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </button>
                    <div>
                        <h1 className="text-base sm:text-lg font-semibold">Smart Profile Setup</h1>
                    </div>
                </div>

                {/* STEP INDICATOR */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center w-full max-w-md">

                        {[1, 2, 3].map((s, i) => (
                            <div key={i} className="flex items-center flex-1">
                                {/* STEP */}
                                <div className="flex flex-col items-center w-full">
                                    <div
                                        className={`
                                            w-10 h-10 flex items-center justify-center
                                            rounded-full text-sm font-semibold
                                            transition-all duration-300
                                            ${s === step
                                                ? "bg-[#1f2a44] text-white shadow-lg"
                                                : s < step
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-200 text-gray-500"
                                            }
                                        `}
                                    >
                                        {s < step ? "✓" : s}
                                    </div>
                                    {/* LABEL */}
                                    <span className="text-xs mt-2 text-gray-500 text-center">
                                        {s === 1 ? "Personal" : s === 2 ? "Financial" : "Property"}
                                    </span>
                                </div>

                                {/* CONNECTOR */}
                                {i < 2 && (
                                    <div className="flex-1 h-[2px] mx-2 bg-gray-200 relative">
                                        <div
                                            className={`absolute top-0 left-0 h-[2px] transition-all duration-300 ${s < step ? "bg-green-500 w-full" : "w-0"
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 relative">

                    {/* GENERAL ERROR BANNER */}
                    {generalError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{generalError}</span>
                        </div>
                    )}

                    {initialLoading ? (
                        <FormSkeleton />
                    ) : (
                        <>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-[#1f2a44] hover:bg-[#2a3a5c] text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl mt-6 sm:mt-8 
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base
                                    flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : step === 3 ? (
                                    <>
                                        Submit Application
                                        <ChevronRight size={18} />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

/* =====================================================
   🔹 REUSABLE INPUT
===================================================== */
function Input({ label, name, value, onChange, error, type = "text", placeholder = "" }) {
    return (
        <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1f2a44]/20 focus:border-[#1f2a44]
                    placeholder:text-gray-400 transition-all ${error ? "border-red-400" : "border-gray-200"}`}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}

/* =====================================================
   🔹 REUSABLE DATE INPUT
===================================================== */
function InputDate({ label, name, value, onChange, error }) {
    return (
        <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    type="date"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-[#1f2a44]/20 focus:border-[#1f2a44]
                        transition-all pr-10 ${error ? "border-red-400" : "border-gray-200"}`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}

/* =====================================================
   🔹 REUSABLE SELECT
===================================================== */
function Select({ label, name, value, onChange, options = [], error }) {
    return (
        <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-[#1f2a44]/20 focus:border-[#1f2a44]
                    bg-white transition-all cursor-pointer ${error ? "border-red-400" : "border-gray-200"}`}
            >
                <option value="" className="text-gray-400">Select {label}</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}
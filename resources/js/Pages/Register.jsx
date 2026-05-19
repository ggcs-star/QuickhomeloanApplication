import { useState } from "react";
import api from "../api";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import GuestLayout from "../Layouts/GuestLayout";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    channel_name: "",
    channel_url: "",
    email: "",
    address: "",
    mobile_number: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrors({});

    if (!form.full_name || !form.email || !form.password) {
      toast.error("Required fields missing");
      return;
    }

    if (form.password !== form.password_confirmation) {
      toast.error("Password does not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/register", form);

      toast.success(res.data?.message || "Register Successful 🎉");

      setTimeout(() => {
        router.visit("/login");
      }, 800);

    } catch (err) {
      const response = err.response?.data;

      if (response?.errors) {
        setErrors(response.errors);
      }

      toast.error(response?.message || "Register Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <GuestLayout>
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px",
      }}
    >

      {/* TOP */}
    <div
      style={{
        flex: 1,
        overflow: "hidden",
      }}
    >

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/images/quick.svg"
            alt="Quick Logo"
            className="w-40 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium text-gray-700 mb-1">
          Welcome to{" "}
          <span className="font-bold text-black">Quickhome Loan</span>
        </h2>

        <div className="w-16 h-1 bg-gray-200 rounded-full mb-6"></div>

        <h3 className="text-2xl font-bold text-black mb-6">
          Create your account
        </h3>

        {/* Full Name */}
        <div className="mb-4">
          <input
            className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Full Name"
            onChange={(e) => {
              setForm({ ...form, full_name: e.target.value });
              setErrors({ ...errors, full_name: null });
            }}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.full_name[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email Address"
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: null });
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email[0]}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <input
            className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Mobile Number"
            onChange={(e) => {
              setForm({ ...form, mobile_number: e.target.value });
              setErrors({ ...errors, mobile_number: null });
            }}
          />
          {errors.mobile_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mobile_number[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Password"
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setErrors({ ...errors, password: null });
            }}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password[0]}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <input
            type="password"
            className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm Password"
            onChange={(e) => {
              setForm({
                ...form,
                password_confirmation: e.target.value,
              });
              setErrors({
                ...errors,
                password_confirmation: null,
              });
            }}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

      </div>

      {/* BOTTOM */}
      <div>

       

        <button
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg active:scale-95 transition"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Register"}
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-black font-semibold cursor-pointer border-b border-black"
            onClick={() => router.visit("/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  </GuestLayout>
);
}
import GuestLayout from "../Layouts/GuestLayout";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import api from "../api";
import { router } from "@inertiajs/react";
import { useAuth } from "@/Context/AuthContext";
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { refreshAuth } = useAuth();

  const handleLogin = async () => {
    setErrors({});

    if (!form.email || !form.password) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/login", form);

      const data = res.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Saved User:", data.user);

      toast.success(data.message || "Login Successful");
      await refreshAuth();
      setTimeout(() => {
        router.visit("/");
      }, 800);

    } catch (err) {
      const response = err.response?.data;

      if (response?.errors) {
        setErrors(response.errors);
      }

      toast.error(response?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-white px-5 py-6 flex flex-col justify-between">

        {/* TOP */}
        <div>

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
            Welcome to <span className="font-bold text-black">Quickhome Loan</span>
          </h2>

          <div className="w-16 h-1 bg-gray-200 rounded-full mb-6"></div>

          <h3 className="text-2xl font-bold text-black mb-6">
            Enter your details
          </h3>

          {/* Email */}
          <div className="mb-4">
            <input
              className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
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

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type="password"
              className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
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

        </div>

        {/* BOTTOM */}
        <div>



          <button
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg active:scale-95 transition"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{" "}
            <span
              className="text-black font-semibold underline cursor-pointer"
              onClick={() => router.visit("/register")}
            >
              Register
            </span>
          </p>
        </div>

      </div>
    </GuestLayout>
  );
}
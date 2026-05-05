import { useEffect } from "react";
import { isAuthenticated } from "../auth";
import { router } from "@inertiajs/react";

export default function GuestLayout({ children }) {
  useEffect(() => {
    if (isAuthenticated()) {
      router.visit("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
  <div className="w-full max-w-sm min-h-screen bg-white shadow-md">
    {children}
  </div>
</div>
  );
}
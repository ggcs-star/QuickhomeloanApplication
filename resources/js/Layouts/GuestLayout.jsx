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
    <div
      className="fixed inset-0 bg-gray-100 flex justify-center overflow-hidden"
    >
      <div
        className="w-full max-w-sm bg-white overflow-hidden"
        style={{
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
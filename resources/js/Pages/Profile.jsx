import { useEffect, useState } from "react";
import AppLayout from "../Layouts/AppLayout";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://backend.quickhomeloan.in/public/api/user", {
      headers: {
        Accept: "application/json",
        // Authorization: `Bearer TOKEN` (if needed)
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data?.data || data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen px-5 py-6 bg-gray-100">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-sm"
        >
          ← Back
        </button>

        {/* Profile Card */}
        <div className="p-4 bg-white rounded-2xl shadow border flex justify-between items-center mb-6">

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border flex items-center justify-center text-lg font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                {user?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-500">
                {user?.phone || user?.mobile || "-"}
              </p>
            </div>
          </div>

          <span>›</span>
        </div>

        {/* Settings */}
        <div className="p-4 bg-white rounded-2xl shadow border mb-6">

          <p className="text-xs text-gray-500 mb-3 font-semibold">
            SETTINGS
          </p>

          {/* Membership */}
          <div className="flex justify-between items-center py-3 border-t cursor-pointer active:scale-95 transition">
            <span>Membership</span>
            <span>›</span>
          </div>

          {/* PIN */}
          <div className="flex justify-between items-center py-3 border-t cursor-pointer active:scale-95 transition">
            <span>Change secure PIN</span>
            <span>›</span>
          </div>

          {/* Help */}
          <div className="flex justify-between items-center py-3 border-t cursor-pointer active:scale-95 transition">
            <span>Need help? Reach out</span>
            <span>›</span>
          </div>

        </div>

        {/* Logout */}
        <div className="p-4 bg-white rounded-2xl shadow border flex justify-between items-center cursor-pointer active:scale-95 transition text-red-500">
          <span>Logout</span>
          <span>›</span>
        </div>

      </div>
    </AppLayout>
  );
}
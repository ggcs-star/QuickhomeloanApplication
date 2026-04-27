import AppLayout from "../Layouts/AppLayout";
import api from "../api";
import { useEffect, useState } from "react";
import { logout } from "../auth";
import { router } from '@inertiajs/react';
export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4">
          Dashboard
        </h2>

        {user ? (
          <>
            <p>Welcome {user.name}</p>
            <p>{user.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}

        <button
          onClick={logout}
          className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </AppLayout>
  );
}
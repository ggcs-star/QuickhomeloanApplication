import AppLayout from "../Layouts/AppLayout";
import PageSkeleton from "../components/Skeleton/PageSkeleton";
import api from "../api";
import { useEffect, useState } from "react";
import { logout } from "../auth";
import { router } from '@inertiajs/react';
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true); 
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }finally {
    setLoading(false); 
   }
  };

  if (loading) {
  return (
    <PageSkeleton>
      <div className="p-5 space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </PageSkeleton>
  );
}
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
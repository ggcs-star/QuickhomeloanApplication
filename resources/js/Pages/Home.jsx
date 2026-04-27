import { router } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

export default function Home() {
  return (
    <AppLayout showTopNav={true} >
      <div className="flex flex-col items-center justify-center h-screen p-5">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to App 🚀
        </h1>

        <p className="text-gray-500 mb-6 text-center">
          Please login or register to continue
        </p>

     
      </div>
    </AppLayout>
  );
}
import { useEffect, useState } from "react";
import api from "@/api";
import AppLayout from "../Layouts/AppLayout";
import { ArrowLeft } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { type } = usePage().props;
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout showTopNav={false} showBottomNav={false}>
      <div className="px-4 py-5 bg-gray-100 min-h-screen space-y-5">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()}>
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-xl font-semibold">Courses</h2>
        </div>

        {/* LOADER */}
        {loading &&
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden"
            >
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                <div className="h-3 bg-gray-200 w-1/3 rounded"></div>
              </div>
            </div>
          ))}

        {/* COURSES LIST */}
        {!loading &&
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >

              {/* IMAGE */}
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={`https://admin.quickhomeloan.in/public/storage/${course.image}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="text-lg font-semibold text-gray-800">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {course.description}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    router.visit(`/courses/${course.id}/modules?type=${type}`)
                  }
                  className="mt-4 w-full bg-[#1E293B] text-white py-2.5 rounded-xl text-sm"
                >
                  View Modules
                </button>

              </div>

            </div>
          ))}

      </div>
    </AppLayout>
  );
}
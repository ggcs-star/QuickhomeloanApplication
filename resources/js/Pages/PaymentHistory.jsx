import React, { useEffect, useState } from "react";
import PageSkeleton from "@/components/Skeleton/PageSkeleton";

import {
  ArrowLeft,
  Crown,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";

function PaymentHistoryContent() {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
        setLoading(true); 

    try {

      const response = await fetch(
        "https://backend.quickhomeloan.in/public/api/payment-history",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      console.log("PAYMENT DATA", data);

      setPayments(
        data.data || []
      );

    } catch (error) {

      console.log(
        "Payment History Error",
        error
      );

    } finally {

      setLoading(false);

    }

  };

// Add skeleton loading
if (loading) {
  return (
    <PageSkeleton>
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-13 h-13 rounded-2xl bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageSkeleton>
  );
}
  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* HEADER */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b sticky top-0 z-20">

        <ArrowLeft
          className="w-5 h-5 cursor-pointer"
          onClick={() => window.history.back()}
        />

        <h1 className="text-xl font-bold text-gray-800">
          Payment History
        </h1>

      </div>

      {/* BODY */}
      <div className="p-4 space-y-5 max-w-3xl mx-auto">

        

        {!loading && payments.length === 0 && (

          <div className="bg-white rounded-3xl p-10 text-center border shadow-sm">

            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">

              <CreditCard
                size={32}
                className="text-gray-400"
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Payment History
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your purchased plans will appear here
            </p>

          </div>

        )}

        {payments.map((item, index) => (

          <div
            key={item.id || index}
            className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-4 mb-5">

              <div className="flex items-start gap-3 flex-1">

                <div className="min-w-[52px] w-13 h-13 rounded-2xl bg-yellow-100 flex items-center justify-center">

                  <Crown
                    size={24}
                    className="text-yellow-600"
                  />

                </div>

                <div className="flex-1">

                  <h2 className="text-[17px] font-bold text-gray-900">
                    Premium Membership
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Subscription ID
                  </p>

                  <p className="text-[12px] text-gray-700 break-all mt-1">
                    {item.subscription_id}
                  </p>

                </div>

              </div>

              <div
                className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap
                ${
                  item.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >

                <CheckCircle2 size={14} />

                {item.status}

              </div>

            </div>

            {/* AMOUNT CARD */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Amount Paid
                  </p>

                  <h3 className="text-3xl font-bold text-green-700 mt-1 flex items-center">

                    <IndianRupee size={24} />

                    {item.amount || 0}

                  </h3>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">

                  <CreditCard
                    className="text-green-600"
                    size={26}
                  />

                </div>

              </div>

            </div>

            {/* DETAILS */}
            <div className="bg-gray-50 rounded-2xl p-4 border space-y-4">

              {/* START DATE */}
              <div className="flex justify-between items-center text-sm gap-3">

                <span className="text-gray-500">
                  Start Date
                </span>

                <span className="font-medium text-gray-800 flex items-center gap-1 text-right">

                  <CalendarDays size={14} />

                  {item.start_date
                    ? new Date(
                        item.start_date
                      ).toLocaleDateString()
                    : "-"}

                </span>

              </div>

              {/* END DATE */}
              <div className="flex justify-between items-center text-sm gap-3">

                <span className="text-gray-500">
                  End Date
                </span>

                <span className="font-medium text-gray-800 flex items-center gap-1 text-right">

                  <CalendarDays size={14} />

                  {item.end_date
                    ? new Date(
                        item.end_date
                      ).toLocaleDateString()
                    : "-"}

                </span>

              </div>

              {/* PURCHASED */}
              <div className="flex justify-between items-center text-sm gap-3">

                <span className="text-gray-500">
                  Purchased On
                </span>

                <span className="font-medium text-gray-800 text-right">

                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString()
                    : "-"}

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default function PaymentHistory() {
  return (
    <AppLayout
      showTopNav={false}
      showBottomNav={false}
    >
      <PaymentHistoryContent />
    </AppLayout>
  );
}
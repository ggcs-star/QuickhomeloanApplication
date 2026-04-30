import { useState } from "react";
import api from "@/api";
import { CheckCircle, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function RazorpaySubscribeButton({
  amountText = "₹ 999/year",
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };


  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const res = await api.post("/create-subscription");
      const { subscription_id, key } = res.data;

      if (!subscription_id || !key) {
        alert("Invalid subscription data");
        return;
      }

      const options = {
        key: key,
        subscription_id: subscription_id,

        name: "Quick Home Loan",
        description: "Premium Membership",

        theme: {
          color: "#1e293b",
        },

        handler: function () {

          sessionStorage.setItem("is_pro_user", "true");
          sessionStorage.setItem("pro_checked", "true");


          setSuccess(true);


          window.dispatchEvent(
            new CustomEvent("subscriptionUpdated", {
              detail: { isPro: true },
            })
          );


          setTimeout(() => {
            router.visit("/");
          }, 1500);
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed bottom-4 left-4 right-4">

      {/* SUCCESS STATE */}
      {success ? (
        <div className="bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
          <CheckCircle size={18} />
          Payment Successful
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full bg-[#1e293b] text-white py-4 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 shadow-md transition ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-95"
            } ${className}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Processing...
            </>
          ) : (
            <>Become a Member at {amountText}</>
          )}
        </button>
      )}
    </div>
  );
}
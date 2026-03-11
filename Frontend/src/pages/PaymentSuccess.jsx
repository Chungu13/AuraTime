import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const { backendUrl } = useContext(AppContext);
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const session_id = params.get("session_id");

      if (!session_id) {
        setStatus("error");
        setMessage("Missing payment session information.");
        return;
      }

      try {
        const { data } = await axios.get(`${backendUrl}/api/user/verify-payment`, {
          params: { session_id },
        });

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Payment verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("An error occurred during payment verification.");
      }
    };

    if (backendUrl) {
      verifyPayment();
    }
  }, [backendUrl]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 transition-all scale-100 hover:scale-[1.01]">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-beige/20 border-t-beige rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            <CheckCircle size={64} className="text-green-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            <button
              onClick={() => navigate("/my-appointments")}
              className="w-full bg-beige text-white py-4 rounded-2xl font-bold hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
            >
              View My Appointments <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-6">
            <XCircle size={64} className="text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            <button
              onClick={() => navigate("/my-appointments")}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Back to Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

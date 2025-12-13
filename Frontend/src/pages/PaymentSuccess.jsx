// pages/PaymentSuccess.js
import React, { useEffect, useState } from "react";
import axios from "axios";



const PaymentSuccess = () => {
  const [message, setMessage] = useState("Verifying payment...");
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const session_id = params.get("session_id");
      const appointmentId = params.get("appointmentId");

      if (!session_id || !appointmentId) {
        setMessage("Missing payment info in URL.");
        return;
      }
      try {
        const res = await axios.get(`http://localhost:4000/api/user/verify-payment`, {
          params: { session_id, appointmentId },
        });

        if (res.data.success) {
          setMessage("✅ Payment successful and appointment marked as paid!");
          console.log("✅ DB updated");
        } else {
          setMessage("❌ Payment not completed.");
        }
      } catch (err) {
        console.error("Error:", err.message);
        setMessage("❌ Payment verification failed.");
      }
    };
    verifyPayment();
  }, []);









  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentSuccess;

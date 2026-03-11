import { useContext, useEffect, useState } from "react"; // Syncing casing
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { loadStripe } from "@stripe/stripe-js";

const MyAppointments = () => {
  const { backendUrl, token, getStaffsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const date = new Date(slotDate);
    const day = date.getDate();
    const month = months[date.getMonth() + 1]; // `months` array starts at index 1
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };


  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId, userId }, // include userId here
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getStaffsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };
  const deleteHistory = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/delete-history",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const clearAllHistory = async () => {
    // Confirmation before clear
    if (!window.confirm("Are you sure you want to clear your entire appointment history? This action cannot be undone.")) {
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/clear-all-history",
        {},
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };


  const handleStripePayment = async (appointmentId, payment_type = "deposit") => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-checkout-session`,
        { appointmentId, payment_type },
        { headers: { token } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create Stripe session: " + data.message);
      }
    } catch (err) {
      toast.error("Stripe payment failed to start");
    }
  };



  const handleNavigation = (staffId) => {
    navigate(`/appointment/${staffId}`);
  };

  const handleReschedule = (appointmentId, staffId) => {
    console.log("Navigating with staffId:", staffId, "and appointmentId:", appointmentId);

    navigate(`/appointment/${staffId}?appointmentId=${appointmentId}&reschedule=true`);
  };




  return (
    <div>
      <div className="flex justify-between items-center border-b pb-3 mt-12">
        <p className="font-medium text-zinc-700">
          My appointments
        </p>
        {appointments.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-sm bg-red-600 text-white px-5 py-2.5 rounded-2xl hover:bg-stone-800 transition-all duration-300 font-bold shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            Clear All History
          </button>
        )}
      </div>

      <MoveUpOnRender id="my-appointments">
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div onClick={() => handleNavigation(item?.businessData?._id)}>
              <img
                className="w-32 bg-indigo-50"
                src={item?.businessData?.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-500">
              <p className="text-neutral-800 font-semibold">
                {item?.businessData?.service_name}
              </p>
              {/* <p>{item?.businessData?.speciality}</p> */}
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item?.businessData?.address}</p>
              {/* <p className="text-xs">{item?.businessData?.address?.line1}</p> */}
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time :
                </span>
                {slotDateFormat(item?.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>

            <div className="flex flex-col gap-2 justify-end">
              {/* Deposit Status / Confirmed */}
              {!item.cancelled && item.bookingFeePaid && !item.isCompleted && (
                <button className={`text-sm text-center sm:min-w-48 py-2 border font-medium cursor-default rounded-lg ${item.depositAmount > 0 ? "text-green-600 border-green-200 bg-green-50" : "text-blue-600 border-blue-200 bg-blue-50"}`}>
                  {item.depositAmount > 0 ? `Deposit Paid ($${item.depositAmount})` : "Confirmed"}
                </button>
              )}

              {/* Pay Deposit Button */}
              {!item.cancelled && !item.bookingFeePaid && !item.isCompleted && (
                <button
                  onClick={() => handleStripePayment(item._id, "deposit")}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-beige hover:text-white transition duration-300 font-medium"
                >
                  Pay Deposit (${item.depositAmount})
                </button>
              )}

              {/* Remaining Balance Label/Button */}
              {!item.cancelled && item.isCompleted && !item.isPaidInFull && (
                <button
                  onClick={() => handleStripePayment(item._id, "full")}
                  className="text-sm text-white text-center sm:min-w-48 py-2 border bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 font-bold shadow-md shadow-indigo-100"
                >
                  Pay Remaining Balance (${item.amount - item.depositAmount})
                </button>
              )}

              {/* Paid in Full Status */}
              {!item.cancelled && item.isPaidInFull && (
                <button className="text-sm text-white text-center sm:min-w-48 py-2 border bg-green-600 rounded-lg cursor-default font-bold">
                  Paid in Full
                </button>
              )}

              {/* Cancel Button */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-600 hover:text-white transition duration-300"
                >
                  Cancel Appointment
                </button>
              )}

              {/* Reschedule Button */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => handleReschedule(item._id, item?.businessData?._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-beige hover:text-white transition duration-300"
                >
                  Reschedule
                </button>
              )}

              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded-lg text-red-500 bg-red-50 text-sm font-medium">
                  Appointment cancelled
                </button>
              )}

              {item.isCompleted && !item.isPaidInFull && (
                <div className="sm:min-w-48 py-2 border border-green-500 rounded-lg text-green-500 text-center bg-green-50 text-sm font-medium">
                  Service Completed
                </div>
              )}

              {/* Delete from History Button */}
              {(item.cancelled || item.isCompleted) && (
                <button
                  onClick={() => deleteHistory(item._id)}
                  className="text-sm text-neutral-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-neutral-100 transition duration-300 font-medium"
                >
                  Delete from History
                </button>
              )}
            </div>
          </div>


        ))}
      </MoveUpOnRender>
    </div>
  );
};

export default MyAppointments;

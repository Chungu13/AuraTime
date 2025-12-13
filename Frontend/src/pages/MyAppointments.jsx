import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
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



  const handleStripePayment = async (appointmentId, staffName, price) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-checkout-session`,
        { appointmentId, staffName, price },
        { headers: { token } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create Stripe session: " + data.error);
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
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>

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
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="text-sm text-white text-center sm:min-w-48 py-2 border bg-beige">
                  Paid
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() =>
                    handleStripePayment(
                      item._id,
                      item.businessData.name,
                      item.amount
                    )
                  }
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-beige hover:text-white transition duration-300"
                >
                  Pay Online
                </button>
              )}

              {/* {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white tranisal duration-300"
                >
                  Cancel Appointment
                </button>
              )} */}


              {!item.cancelled && !item.isCompleted && !item.payment && (
  <button
    onClick={() => cancelAppointment(item._id)}
    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white tranisal duration-300"
  >
    Cancel Appointment
  </button>
)}


  {/* <div className="flex flex-col gap-2 justify-end">
  
  {!item.cancelled && !item.isCompleted && (
    <button
      onClick={() => handleReschedule(item._id, item?.businessData?._id)} // Pass the appointment ID and staffId
      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-beige hover:text-white transition duration-300"
    >
      Reschedule
    </button>
  )}
</div> */}


<div className="flex flex-col gap-2 justify-end">

{!item.cancelled && !item.isCompleted && !item.payment && (
  <button
    onClick={() => handleReschedule(item._id, item?.businessData?._id)}
    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-beige hover:text-white transition duration-300"
  >
    Reschedule
  </button>
)}

</div>



              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded tex-red-500">
                  Appointment cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 ">
                  Completed
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

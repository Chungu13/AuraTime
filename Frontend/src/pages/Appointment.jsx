import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import SlotSelector from "../components/SlotSelector";

const Appointment = () => {
  const { staffId } = useParams(); // Get the doctor ID from the URL
  const location = useLocation(); // Get the URL query parameters
  const { staffs, currencySymbol, token, backendUrl, getStaffsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WEND", "THE", "FRI", "SAT"];
  const [staffInfo, setStaffInfo] = useState(null);
  const [staffSlots, setStaffSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [slotDate, setSlotDate] = useState(""); // Store the selected date for rescheduling
  const [existingAppointment, setExistingAppointment] = useState(null); // Store existing appointment if rescheduling
  const [serviceDuration, setServiceDuration] = useState(30); 
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Check if the user is rescheduling an appointment
  const isReschedule = new URLSearchParams(location.search).get("reschedule");
  const appointmentId = new URLSearchParams(location.search).get("appointmentId");

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [staffSlots]);

  useEffect(() => {
    fetchDocInfo();
  }, [staffs, staffId]);

  useEffect(() => {
    getAvailableSlots();
  }, [staffInfo]);

  // Fetch the existing appointment if rescheduling
  useEffect(() => {
    if (isReschedule && appointmentId) {
      fetchExistingAppointment(appointmentId);
    }
  }, [isReschedule, appointmentId]);

  // Fetch the doctor (staff) info
  // const fetchDocInfo = async () => {
  //   const staffInfo = staffs.find((doc) => doc._id === staffId);
  //   setStaffInfo(staffInfo);

  //   setServiceDuration(staffInfo.serviceDuration || 30);
  // };


  const fetchDocInfo = async () => {
  const staffInfo = staffs.find((doc) => doc._id === staffId);

  if (!staffInfo) {
    console.warn("No staff found for ID:", staffId);
    return; // stop the function early if not found
  }

  setStaffInfo(staffInfo);
  setServiceDuration(staffInfo.serviceDuration || 30);
};





  // Fetch existing appointment details for rescheduling
  const fetchExistingAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments/${appointmentId}`,
        { headers: { token } }
      );

      if (data.success) {
        setExistingAppointment(data.appointment); // Set existing appointment details
        setSlotTime(data.appointment.slotTime); // Pre-fill the time slot
        setSlotDate(data.appointment.slotDate); // Pre-fill the date slot
      }
    } catch (error) {
      toast.error("Failed to fetch appointment details");
    }
  };






  // Check if a slot is available
  const checkSlotAvailable = (staffInfo, slotDate, slotTime) => {
    if (!staffInfo || !staffInfo.slots_booked) return true; // If doctor info is null
    return !staffInfo.slots_booked?.[slotDate]?.includes(slotTime);
  };





//  // Get available slots
//   const getAvailableSlots = async () => {
//     setStaffSlots([]);

//     const today = new Date();
//     const generateSlotDate = (date) => date.toISOString(); // full ISO date (not used directly for slotKey)


//     for (let i = 0; i < 7; i++) {

//       const slotKey = currentDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
//       const isAvailable = checkSlotAvailable(staffInfo, slotKey, formattedTime);

      
//       currentDate.setDate(today.getDate() + i);

//       const endTime = new Date(currentDate);
//       endTime.setHours(21, 0, 0, 0);

//       if (i === 0) {
//         currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10, 0, 0, 0);
//       }

//       const timeSlots = [];
//       while (currentDate < endTime) {
//         const formattedTime = currentDate.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         const slotDate = generateSlotDate(currentDate);
//         const isAvailable = checkSlotAvailable(staffInfo, slotDate, formattedTime);

//         if (isAvailable) {
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime,
//           });
//         }

//         // **Use serviceDuration to adjust the slot intervals**
//         currentDate.setMinutes(currentDate.getMinutes() + serviceDuration); // Adjust the slot time by serviceDuration
//       }

//       if (timeSlots.length === 0) {
//         timeSlots.push({ datetime: new Date(currentDate), time: false });
//       }

//       setStaffSlots((prev) => [...prev, timeSlots]);
//     }
//   };




const getAvailableSlots = async () => {
  setStaffSlots([]);

  const today = new Date();
  const generateSlotDate = (date) => date.toISOString(); // new ISO formatter

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const endTime = new Date(currentDate);
    endTime.setHours(21, 0, 0, 0);

    if (i === 0) {
      currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    } else {
      currentDate.setHours(10, 0, 0, 0);
    }

    const timeSlots = [];
    while (currentDate < endTime) {
      const formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const slotKey = currentDate.toISOString().split("T")[0]; // match backend format
      const isAvailable = checkSlotAvailable(staffInfo, slotKey, formattedTime);

      if (isAvailable) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
      }

      currentDate.setMinutes(currentDate.getMinutes() + serviceDuration);
    }

    if (timeSlots.length === 0) {
      timeSlots.push({ datetime: new Date(currentDate), time: false });
    }

    setStaffSlots((prev) => [...prev, timeSlots]);
  }
};



const bookAppointment = async () => {
  if (!token) {
    toast.warn("Login to book appointment");
    return navigate("/login");
  }

  if (!slotTime) {
    return toast.error("Please select the slot time");
  }

  try {
    const date = staffSlots[slotIndex][0].datetime;
    const slotDate = date.toISOString().split("T")[0]; // ✅ "YYYY-MM-DD"

    console.log("Booking Slot Date:", slotDate);
    console.log("Booking Slot Time:", slotTime);

    const { data } = await axios.post(
      backendUrl + (isReschedule ? "/api/user/reschedule-appointment" : "/api/user/book-appointment"),
      {
        staffId,
        slotDate,
        slotTime,
        appointmentId: existingAppointment ? existingAppointment._id : null,
      },
      { headers: { token } }
    );

    if (data.success) {
      toast.success(data.message);
      getStaffsData();
      navigate("/my-appointments");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log("error:", error);
    toast.error(error.message);
  }
};


  // // Book an appointment (or reschedule an existing one)
  // const bookAppointment = async () => {
  //   if (!token) {
  //     toast.warn("Login to book appointment");
  //     return navigate("/login");
  //   }

  //   if (!slotTime) {
  //     return toast.error("Please select the slot time");
  //   }

  //   try {
  //     const date = staffSlots[slotIndex][0].datetime;
  //     const slotDate = date.toISOString(); // ✅ Sends slotDate as a real Date object


  //     console.log("Booking Slot Date:", slotDate); // Add a log to ensure slotDate is set correctly
  //     console.log("Booking Slot Time:", slotTime); // Add a log to ensure slotTime is set correctly

  //     const { data } = await axios.post(
  //       backendUrl + (isReschedule ? "/api/user/reschedule-appointment" : "/api/user/book-appointment"),
  //       {
  //         staffId,
  //         slotDate,
  //         slotTime,
  //         appointmentId: existingAppointment ? existingAppointment._id : null,
  //       },
  //       { headers: { token } }
  //     );

  //     if (data.success) {
  //       toast.success(data.message);
  //       getStaffsData();
  //       navigate("/my-appointments");
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.log("error:", error);
  //     toast.error(error.message);
  //   }
  // };



  return (
    staffInfo && (
      <div>
        {/* Staff Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-beige w-full sm:max-w-72 rounded-lg" src={staffInfo.image} alt="" />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {staffInfo.service_name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-black">
              <p>
                {staffInfo.speciality}
              </p>
             </div>
            <div className="flex items-center gap-2 text-sm mt-1 text-black">
              <p>
                {staffInfo.address}  
              </p>
              
            </div>
            {/* <div className="flex items-center gap-2 text-sm mt-1 text-black">
              <p>
                {staffInfo.therapist_staff_email}  {staffInfo.speciality}
              </p>
              
            </div> */}

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-black mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-black max-w-[700px] mt-1">{staffInfo.about}</p>
            </div>
            <p className="text-black font-medium mt-4">
              Appointment fee: <span className="text-gray-600">{currencySymbol}{staffInfo.fees}</span>
            </p>
            <p className="text-black font-medium mt-4">
              Service Duration: <span className="text-gray-600">{staffInfo.serviceDuration} minutes </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {staffSlots.length &&
              staffSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index ? "bg-beige text-white" : "border border-gray-700"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <SlotSelector
            staffSlots={staffSlots}
            slotIndex={slotIndex}
            slotTime={slotTime}
            setSlotTime={setSlotTime}
          />
          <button
            onClick={bookAppointment}
            className="bg-beige text-white text-sm font-light px-14 py-3  hover:bg-stone-700 rounded-full my-5"
          >
            {isReschedule ? "Reschedule Appointment" : "Book an appointment"}
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors staffId={staffId} speciality={staffInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;

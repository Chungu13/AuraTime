import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedServices from "../components/RelatedServices";
import { toast } from "sonner";
import axios from "axios";
import SlotSelector from "../components/SlotSelector";

const Appointment = () => {
  const { staffId } = useParams();
  const location = useLocation();
  const { staffs, currencySymbol, token, backendUrl, getStaffsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [staffInfo, setStaffInfo] = useState(null);
  const [staffSlots, setStaffSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [serviceDuration, setServiceDuration] = useState(30);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const isReschedule = new URLSearchParams(location.search).get("reschedule");
  const appointmentId = new URLSearchParams(location.search).get(
    "appointmentId",
  );

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

  useEffect(() => {
    if (isReschedule && appointmentId) {
      fetchExistingAppointment(appointmentId);
    }
  }, [isReschedule, appointmentId]);

  const fetchDocInfo = async () => {
    const staffInfo = staffs.find((doc) => doc._id === staffId);

    if (!staffInfo) {
      if (staffs.length > 0) {
        console.warn("No staff found for ID:", staffId);
      }
      return;
    }

    setStaffInfo(staffInfo);
    setServiceDuration(staffInfo.serviceDuration || 30);
  };

  const fetchExistingAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments/${appointmentId}`,
        { headers: { token } },
      );

      if (data.success) {
        setExistingAppointment(data.appointment);
        setSlotTime(data.appointment.slotTime);
        setSlotDate(data.appointment.slotDate);
      }
    } catch (error) {
      toast.error("Failed to fetch appointment details");
    }
  };

  const checkSlotAvailable = (staffInfo, slotDate, slotTime) => {
    if (!staffInfo || !staffInfo.slots_booked) return true;
    return !staffInfo.slots_booked?.[slotDate]?.includes(slotTime);
  };

  const getAvailableSlots = async () => {
    setStaffSlots([]);

    const today = new Date();

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

        const slotKey = currentDate.toISOString().split("T")[0];
        const isAvailable = checkSlotAvailable(
          staffInfo,
          slotKey,
          formattedTime,
        );

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

  const [isBooking, setIsBooking] = useState(false);
  const bookAppointment = async () => {
    console.log("🚀 bookAppointment triggered", { token: !!token, slotTime, slotIndex });
    if (!token) {
      console.log("❌ No token, redirecting to login");
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      console.log("❌ No slotTime selected");
      return toast.error("Please select the slot time");
    }

    setIsBooking(true);
    try {
      if (!staffSlots[slotIndex] || !staffSlots[slotIndex][0]) {
        throw new Error("Date information is missing for the selected slot.");
      }

      const date = staffSlots[slotIndex][0].datetime;
      const slotDate = date.toISOString().split("T")[0];
      console.log("📅 Slot Info:", { slotDate, slotTime, staffId });

      const { data } = await axios.post(
        backendUrl +
        (isReschedule
          ? "/api/user/reschedule-appointment"
          : "/api/user/book-appointment"),
        {
          staffId,
          slotDate,
          slotTime,
          appointmentId: existingAppointment ? existingAppointment._id : null,
        },
        { headers: { token } },
      );

      console.log("📦 Backend Response:", data);

      if (data.success) {
        if (data.url) {
          console.log("🔗 Redirecting to Stripe:", data.url);
          toast.info(data.message || "Redirecting to secure payment...");
          window.location.href = data.url;
        } else {
          toast.success(data.message || "Appointment booked successfully");
          getStaffsData();
          navigate("/my-appointments");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("🔥 Booking Error:", error);
      toast.error(error.response?.data?.message || error.message || "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    staffInfo && (
      <div>
        {/* Staff Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-beige w-full sm:max-w-72 rounded-lg"
              src={staffInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {staffInfo.service_name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-black">
              <p>{staffInfo.speciality}</p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-black mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-black max-w-[700px] mt-1">
                {staffInfo.about}
              </p>
            </div>
            <p className="text-black font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {staffInfo.fees}
              </span>
            </p>

            {staffInfo.bookingFee > 0 && (
              <p className="text-green-700 font-semibold mt-2 text-sm bg-green-50 px-3 py-1 rounded-md inline-block">
                Upfront Deposit: {currencySymbol}{staffInfo.bookingFee}
                <span className="font-normal text-xs block text-green-600 mt-0.5">
                  (Payable via Stripe to secure your slot)
                </span>
              </p>
            )}

            <p className="text-black font-medium mt-4">
              Service Duration:{" "}
              <span className="text-gray-600">
                {staffInfo.serviceDuration} minutes{" "}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 scrollbar-hide">
            {staffSlots.length > 0 &&
              staffSlots.map((item, index) => {
                const isSelected = slotIndex === index;
                const dayLabel = item[0] && daysOfWeek[item[0].datetime.getDay()];
                const dayNumber = item[0] && item[0].datetime.getDate();

                return (
                  <button
                    type="button"
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`flex min-w-[78px] shrink-0 flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center transition ${isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    <span
                      className={`text-[11px] font-semibold tracking-wide ${isSelected ? "text-white/80" : "text-slate-500"
                        }`}
                    >
                      {dayLabel}
                    </span>
                    <span className="mt-1 text-lg font-semibold">
                      {dayNumber}
                    </span>
                  </button>
                );
              })}
          </div>

          <SlotSelector
            staffSlots={staffSlots}
            slotIndex={slotIndex}
            slotTime={slotTime}
            setSlotTime={setSlotTime}
          />
          <button
            type="button"
            disabled={isBooking}
            onClick={bookAppointment}
            className={`text-white text-sm font-semibold px-14 py-4 rounded-full my-5 shadow-lg transition-all flex items-center justify-center gap-3 ${isBooking ? "bg-gray-400 cursor-not-allowed" : "bg-beige hover:bg-stone-700 hover:scale-[1.02] active:scale-95"}`}
          >
            {isBooking ? (
              <>
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Connecting to Stripe...
              </>
            ) : isReschedule ? (
              "Confirm Reschedule"
            ) : staffInfo.bookingFee > 0 ? (
              <>
                <span className="flex items-center gap-1">
                  Pay {currencySymbol}{staffInfo.bookingFee} Deposit
                </span>
                <span className="h-4 w-[1px] bg-white/30 hidden sm:block" />
                <span>Confirm Booking</span>
              </>
            ) : staffInfo.fees > 0 ? (
              <>
                <span className="flex items-center gap-1">
                  Pay {currencySymbol}{staffInfo.fees}
                </span>
                <span className="h-4 w-[1px] bg-white/30 hidden sm:block" />
                <span>Pay & Book Now</span>
              </>
            ) : (
              "Booking Unavailable"
            )}
          </button>
        </div>

        {/* Related Services */}
        <RelatedServices staffId={staffId} speciality={staffInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;

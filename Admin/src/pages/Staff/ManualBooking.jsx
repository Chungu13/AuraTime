import { useState, useEffect, useContext } from "react";
import { StaffContext } from "../../context/StaffContext";
import axios from "axios";
import { toast } from "react-toastify";

const ManualBookingForm = () => {
  const { staffs, getAllStaffs, bookedTimes, getBookedTimesForDate, dToken } = useContext(StaffContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");



  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };



  const generateAvailableTimes = () => {
    const times = [];
    let hour = 10;
    let minute = 0;
    let period = "AM";


    for (let i = 0; i < 16; i++) {
      const timeString = `${hour}:${minute === 0 ? "00" : "30"} ${period}`;
      times.push(timeString);


      minute = minute === 0 ? 30 : 0;
      if (minute === 0) {
        hour += 1;
      }


      if (hour >= 12) {
        period = "PM";
      }
    }

    return times;
  };

  const availableTimes = generateAvailableTimes();


  useEffect(() => {
    getAllStaffs();
  }, []);


  useEffect(() => {
    if (slotDate) {
      const formattedDate = formatDate(new Date(slotDate));
      getBookedTimesForDate(formattedDate);
    }
  }, [slotDate]);


  const handleServiceSelect = (e) => {
    const selectedServiceId = e.target.value;
    setServiceName(selectedServiceId);

    const selectedService = staffs.find(service => service._id === selectedServiceId);
    if (selectedService) {
      setAmount(selectedService.fees);
      setServiceImage(selectedService.image);
    }
  };

  const handleTimeSelect = (e) => {
    const selectedTime = e.target.value;
    if (bookedTimes.includes(selectedTime)) {
      toast.error("This time slot is already booked.");
    } else {
      setSlotTime(selectedTime);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const parsedAmount = parseFloat(amount);


    if (isNaN(parsedAmount)) {
      toast.error("Please provide a valid amount.");
      return;
    }


    const formattedDate = formatDate(new Date(slotDate));
    const selectedService = staffs.find(service => service._id === serviceName);
    const serviceNameToSend = selectedService ? selectedService.service_name : '';


    try {
      const { data } = await axios.post(
        backendUrl + "/api/staff/create-manual-appointment",
        {
          customerName,
          customerContact,
          email: customerEmail,
          slotDate: formattedDate,
          slotTime,
          serviceName: serviceNameToSend,
          amount: parsedAmount,
          image: serviceImage,
        },
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setCustomerName("");
        setCustomerContact("");
        setSlotDate("");
        setSlotTime("");
        setAmount("");
        setServiceName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error booking the appointment.");
      console.log(error);
    }
  };


  const availableTimeSlots = availableTimes.filter((time) => !bookedTimes.includes(time)); // Remove booked times

  return (
    <div className="w-full max-w-lg mx-auto p-5 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-5 text-center">Appointment Booking</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* Customer Name */}
        <label className="text-sm font-medium text-black">
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Full Name"
          />
        </label>


        {/* Customer Email */}
        <label className="text-sm font-medium text-black">
          Customer Email:
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="example@gmail.com"
          />
        </label>


        {/* Customer Contact */}
        <label className="text-sm font-medium text-black">
          Customer Contact:
          <input
            type="text"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="000000000000"
          />
        </label>

        {/* Appointment Date */}
        <label className="text-sm font-medium text-black">
          Appointment Date:
          <input
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </label>

        {/* Appointment Time */}
        <label className="text-sm font-medium text-black">
          Appointment Time:
          <select
            value={slotTime}
            onChange={handleTimeSelect}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-xs mx-auto"
          >
            <option value="">Select a time</option>
            {availableTimeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {bookedTimes.includes(slotTime) && (
            <p className="text-sm text-red-500 mt-1">This time slot is already booked.</p>
          )}
        </label>


        {/* Select Service */}
        <label className="text-sm font-medium text-black">
          Select Service:
          <select
            value={serviceName}
            onChange={handleServiceSelect}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-xs mx-auto"
          >
            <option value="">Select a service</option>
            {staffs.map((service) => (
              <option key={service._id} value={service._id}>
                {service.service_name}
              </option>
            ))}
          </select>
        </label>

        {/* Service Image Preview */}
        {serviceImage && (
          <div className="text-center mt-2">
            <img
              src={serviceImage}
              alt="Selected Service"
              className="w-32 h-32 object-cover mx-auto rounded border"
            />
            <p className="text-xs text-gray-500 mt-1">Service Preview</p>
          </div>
        )}


        {/* Amount */}
        <label className="text-sm font-medium text-black">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-beige text-white p-3 rounded-md hover:bg-white transition"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default ManualBookingForm;  
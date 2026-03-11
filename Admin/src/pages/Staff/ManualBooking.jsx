import { useState, useEffect, useContext } from "react";
import { StaffContext } from "../../context/StaffContext";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Phone, Calendar, Clock, Sparkles, DollarSign, CheckCircle2 } from "lucide-react";

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (hour > 12) {
        hour = 1;
      }
    }
    return times;
  };

  const availableTimes = generateAvailableTimes();

  useEffect(() => {
    getAllStaffs();
  }, [getAllStaffs]);

  useEffect(() => {
    if (slotDate) {
      const formattedDate = formatDate(new Date(slotDate));
      getBookedTimesForDate(formattedDate);
    }
  }, [slotDate, getBookedTimesForDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }
    if (!customerContact.trim()) newErrors.customerContact = "Contact number is required";
    if (!slotDate) newErrors.slotDate = "Please select a date";
    if (!slotTime) newErrors.slotTime = "Please select a time";
    if (!serviceName) newErrors.serviceName = "Please select a service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceSelect = (e) => {
    const selectedServiceId = e.target.value;
    setServiceName(selectedServiceId);
    if (errors.serviceName) setErrors(prev => ({ ...prev, serviceName: "" }));

    const selectedService = staffs.find(service => service._id === selectedServiceId);
    if (selectedService) {
      setAmount(selectedService.fees);
      setServiceImage(selectedService.image);
    }
  };

  const handleTimeSelect = (e) => {
    const selectedTime = e.target.value;
    setSlotTime(selectedTime);
    if (errors.slotTime) setErrors(prev => ({ ...prev, slotTime: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    const formattedDate = formatDate(new Date(slotDate));
    const selectedService = staffs.find(service => service._id === serviceName);
    const serviceNameToSend = selectedService ? selectedService.service_name : '';

    try {
      setIsSubmitting(true);
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
        toast.success("Appointment booked successfully");
        setCustomerName("");
        setCustomerContact("");
        setSlotDate("");
        setSlotTime("");
        setAmount("");
        setServiceName("");
        setCustomerEmail("");
        setServiceImage("");
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error booking the appointment.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTimeSlots = availableTimes.filter((time) => !bookedTimes.includes(time));

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl">
            <Calendar size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manual Appointment
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a direct booking for a customer in the system.
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Customer Name
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.customerName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <User size={18} className={`mr-3 transition-colors ${errors.customerName ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors(prev => ({ ...prev, customerName: "" }));
                    }}
                    placeholder="Full Name"
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.customerName && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.customerName}</p>}
              </div>

              {/* Customer Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Email Address
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.customerEmail ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Mail size={18} className={`mr-3 transition-colors ${errors.customerEmail ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.customerEmail) setErrors(prev => ({ ...prev, customerEmail: "" }));
                    }}
                    placeholder="name@example.com"
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.customerEmail && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.customerEmail}</p>}
              </div>

              {/* Customer Contact */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Phone Number
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.customerContact ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Phone size={18} className={`mr-3 transition-colors ${errors.customerContact ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => {
                      setCustomerContact(e.target.value);
                      if (errors.customerContact) setErrors(prev => ({ ...prev, customerContact: "" }));
                    }}
                    placeholder="e.g. 0123456789"
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.customerContact && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.customerContact}</p>}
              </div>

              {/* Select Service */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Choose Service
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.serviceName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Sparkles size={18} className={`mr-3 transition-colors ${errors.serviceName ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <select
                    value={serviceName}
                    onChange={handleServiceSelect}
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="">Select a service</option>
                    {staffs.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.serviceName && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.serviceName}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Appointment Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Date
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.slotDate ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Calendar size={18} className={`mr-3 transition-colors ${errors.slotDate ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => {
                      setSlotDate(e.target.value);
                      if (errors.slotDate) setErrors(prev => ({ ...prev, slotDate: "" }));
                    }}
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none cursor-pointer"
                  />
                </div>
                {errors.slotDate && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.slotDate}</p>}
              </div>

              {/* Appointment Time */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 font-medium">
                  Time Slot
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.slotTime ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Clock size={18} className={`mr-3 transition-colors ${errors.slotTime ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <select
                    value={slotTime}
                    onChange={handleTimeSelect}
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="">Select a time</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.slotTime && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.slotTime}</p>}
              </div>
            </div>

            {/* Service Preview Card */}
            {serviceImage && (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <img
                  src={serviceImage}
                  alt="Service"
                  className="h-20 w-20 rounded-xl object-cover shadow-sm border border-white"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Service</p>
                  <p className="text-sm font-bold text-slate-900">{staffs.find(s => s._id === serviceName)?.service_name}</p>
                  <div className="mt-1 flex items-center text-slate-600 font-bold">
                    <DollarSign size={14} />
                    <span className="text-lg">{amount}</span>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-4">
            <p className="text-center text-xs text-slate-400">
              This will create a confirmed appointment and notify the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualBookingForm;  
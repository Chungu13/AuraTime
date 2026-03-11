import { useState, useEffect, useContext } from "react";
import { StaffContext } from "../../context/StaffContext";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Phone, Calendar, Clock, Sparkles, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import MoveUpOnRender from "../../components/MoveUpOnRender";

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
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <MoveUpOnRender id="manual-booking">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-[#E8E8E1] overflow-hidden animate-cardIn">

          {/* Header Section */}
          <div className="bg-[#1A1A18] p-10 text-white text-center sm:text-left relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <Calendar size={24} className="text-beige" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Manual Booking</h1>
              </div>
              <p className="text-white/60 text-sm max-w-sm">Create a direct appointment for a walk-in or offline customer.</p>
            </div>
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-beige/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">

              {/* Customer Details Group */}
              <div className="space-y-6 sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-beige rounded-full" />
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C]">Customer Information</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Full Name</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.customerName ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <User className="text-[#9E9E8C]" size={18} />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName) setErrors(prev => ({ ...prev, customerName: "" }));
                        }}
                      />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.customerName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Email Address</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.customerEmail ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <Mail className="text-[#9E9E8C]" size={18} />
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          if (errors.customerEmail) setErrors(prev => ({ ...prev, customerEmail: "" }));
                        }}
                      />
                    </div>
                    {errors.customerEmail && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.customerEmail}</p>}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Phone Number</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.customerContact ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <Phone className="text-[#9E9E8C]" size={18} />
                      <input
                        type="text"
                        placeholder="e.g. 097#######"
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm"
                        value={customerContact}
                        onChange={(e) => {
                          setCustomerContact(e.target.value);
                          if (errors.customerContact) setErrors(prev => ({ ...prev, customerContact: "" }));
                        }}
                      />
                    </div>
                    {errors.customerContact && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.customerContact}</p>}
                  </div>
                </div>
              </div>

              {/* Appointment Details Group */}
              <div className="space-y-6 sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-beige rounded-full" />
                  <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C]">Appointment Details</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Choose Service</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.serviceName ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <Sparkles className="text-[#9E9E8C]" size={18} />
                      <select
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm appearance-none cursor-pointer"
                        value={serviceName}
                        onChange={handleServiceSelect}
                      >
                        <option value="">Select a service</option>
                        {staffs.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.service_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.serviceName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.serviceName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Preferred Date</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.slotDate ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <Calendar className="text-[#9E9E8C]" size={18} />
                      <input
                        type="date"
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm cursor-pointer"
                        value={slotDate}
                        onChange={(e) => {
                          setSlotDate(e.target.value);
                          if (errors.slotDate) setErrors(prev => ({ ...prev, slotDate: "" }));
                        }}
                      />
                    </div>
                    {errors.slotDate && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.slotDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A1A18] ml-1">Time Slot</label>
                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.slotTime ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                      <Clock className="text-[#9E9E8C]" size={18} />
                      <select
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm appearance-none cursor-pointer"
                        value={slotTime}
                        onChange={handleTimeSelect}
                        disabled={!slotDate}
                      >
                        <option value="">{slotDate ? "Select time" : "Choose date first"}</option>
                        {availableTimeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    {errors.slotTime && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.slotTime}</p>}
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              {serviceImage && (
                <div className="sm:col-span-2 bg-beige/5 border border-beige/20 rounded-3xl p-6 flex items-center gap-6 animate-fadeUp">
                  <div className="relative">
                    <img src={serviceImage} className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-4 ring-white" alt="Preview" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-beige mb-1">Booking Review</p>
                    <h3 className="text-xl font-bold text-[#1A1A18]">{staffs.find(s => s._id === serviceName)?.service_name}</h3>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[#6B6B5E] font-bold text-sm">
                        <DollarSign size={14} className="text-beige" />
                        <span>{amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="sm:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A18] text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-[#1A1A18]/20 disabled:bg-gray-300 disabled:shadow-none group"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm & Create Booking
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-bold text-[#9E9E8C] mt-4 uppercase tracking-[0.2em]">Walk-in Customer Registration</p>
              </div>

            </div>
          </form>
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default ManualBookingForm;
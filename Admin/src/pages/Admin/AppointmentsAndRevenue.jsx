import { useContext, useEffect, useMemo, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDays,
  Clock3,
  Search,
  CircleDollarSign,
  UserRound,
  BriefcaseMedical,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

const StatusBadge = ({ cancelled, isCompleted }) => {
  if (cancelled) {
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
        Cancelled
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        Completed
      </span>
    );
  }

  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
      Pending
    </span>
  );
};

const ManageAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    getAppointmentsByDate,
    completeAppointment,
    getAllProfessionalStaff,
    professionalStaffs,
    updateStaffForAppointment,
    payRemainingBalance,
    markAsPaid,
  } = useContext(AdminContext);

  const { currency, calculateAge } = useContext(AppContext);

  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (aToken && !selectedDate) getAllAppointments();
  }, [aToken, selectedDate]);

  useEffect(() => {
    if (aToken && professionalStaffs.length === 0) {
      getAllProfessionalStaff();
    }
  }, [aToken]);

  const baseAppointments = selectedDate ? filteredAppointments : appointments;

  const displayAppointments = useMemo(() => {
    return baseAppointments.filter((item) => {
      const name = item?.userData?.name?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();

      const matchesSearch = !term || name.includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && !item.cancelled && !item.isCompleted) ||
        (statusFilter === "completed" && item.isCompleted) ||
        (statusFilter === "cancelled" && item.cancelled);

      return matchesSearch && matchesStatus;
    });
  }, [baseAppointments, searchTerm, statusFilter]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    if (date) {
      const formatted = date.toLocaleDateString("en-CA");
      const apps = await getAppointmentsByDate(formatted);
      setFilteredAppointments(apps || []);
    } else {
      setFilteredAppointments([]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MoveUpOnRender id="admin-allappointment">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Manage Appointments
            </h1>
            <p className="text-sm text-gray-500">
              Assign staff, cancel or complete appointments.
            </p>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">

            <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search patient..."
                className="w-full outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
              <Filter size={16} className="text-gray-400 mr-2" />
              <select
                className="w-full outline-none text-sm bg-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Filter by date"
              className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
              isClearable
            />

          </div>

          {/* Appointment Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {displayAppointments.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* User Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item?.userData?.image}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${item.cancelled ? 'bg-red-400' : item.isCompleted ? 'bg-green-400' : 'bg-amber-400'}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
                      <p className="font-bold text-slate-900 leading-tight">
                        {item.userData?.name || "Unknown Customer"}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                        Age {calculateAge(item.userData.dob)}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    cancelled={item.cancelled}
                    isCompleted={item.isCompleted}
                  />
                </div>

                {/* Service Highlights */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={item?.businessData?.image}
                      className="w-10 h-10 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {item?.businessData?.service_name}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                        {item?.businessData?.speciality}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <CalendarDays size={12} className="text-slate-500" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.slotDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <Clock3 size={12} className="text-slate-500" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.slotTime}</span>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  < div className="mt-3 pt-3 border-t border-slate-200/50 space-y-1.5" >
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Deposit Paid</span>
                      <span className="text-green-600">-{currency}{item.depositAmount}</span>
                    </div>
                    {
                      item.isCompleted && !item.isPaidInFull && (
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-amber-500 uppercase tracking-widest">Balance Due</span>
                          <span className="text-amber-600">{currency}{item.amount - item.depositAmount}</span>
                        </div>
                      )
                    }
                  </div>
                </div>

                {/* Staff Assignment */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <UserRound size={12} /> Assigned Staff
                    </label>
                  </div>

                  {item.cancelled || item.isCompleted ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 italic text-xs">
                      {item.staffName || "No therapist assigned"}
                    </div>
                  ) : (
                    <div className="relative group">
                      <select
                        className={`w-full text-xs font-bold appearance-none bg-white border rounded-xl px-3 py-2.5 outline-none transition-all duration-200 cursor-pointer ${item.staffName ? 'border-indigo-100 bg-indigo-50/30 text-indigo-700 focus:border-indigo-300' : 'border-slate-200 text-slate-600 focus:border-slate-400 focus:ring-4 focus:ring-slate-50'}`}
                        value={professionalStaffs.find(s => s.name === item.staffName)?._id || ""}
                        onChange={(e) => updateStaffForAppointment(item._id, e.target.value)}
                      >
                        <option value="">Select Therapist</option>
                        {professionalStaffs.map((staff) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:rotate-180 transition-transform">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l4 4 4-4" /></svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quote & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    {item.isPaidInFull ? (
                      <div className="flex items-center gap-1 text-green-600 font-black">
                        <span className="text-[10px] uppercase">Paid Full</span>
                        <span className="text-sm">{currency}{item.amount}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-900 font-black">
                        <span className="text-[10px] uppercase text-slate-400">Total</span>
                        <span className="text-sm">{currency}{item.amount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!item.cancelled && !item.isCompleted && (
                      <>
                        <button
                          onClick={() => {
                            if (window.confirm("Cancel this appointment?")) cancelAppointment(item._id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
                        >
                          <CheckCircle2 size={14} /> Finish
                        </button>
                      </>
                    )}

                    {item.isCompleted && !item.isPaidInFull && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm("Mark as paid in cash?")) markAsPaid(item._id);
                          }}
                          className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                          <CircleDollarSign size={14} /> Paid Cash
                        </button>
                        <button
                          onClick={() => payRemainingBalance(item._id)}
                          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          <CircleDollarSign size={14} /> Link to Pay
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
            }

          </div >
        </div >
      </MoveUpOnRender >
    </div >
  );
};

export default ManageAppointments;
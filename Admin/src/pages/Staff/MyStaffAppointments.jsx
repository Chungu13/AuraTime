import { useContext, useEffect, useMemo, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDays,
  Clock3,
  Search,
  UserRound,
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

const StaffManageAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    getAppointmentsByDate,
    completeAppointment,
    getAllProfessionalStaff,
    professionalStaffs,
    updateStaffForAppointment,
  } = useContext(StaffContext);

  const { currency, calculateAge } = useContext(AppContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (dToken) {
      getAppointments();
      getAllProfessionalStaff();
      // Fetch today's appointments by default
      const formatted = new Date().toLocaleDateString("en-CA");
      getAppointmentsByDate(formatted).then(apps => setFilteredAppointments(apps || []));
    }
  }, [dToken]);

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
      <MoveUpOnRender id="staff-allappointment">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              My Appointments
            </h1>
            <p className="text-sm text-gray-500">
              Track and manage your scheduled sessions.
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
                        alt="User"
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

                {/* Service Details */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={item?.businessData?.image}
                      className="w-10 h-10 rounded-xl object-cover shadow-sm"
                      alt="Service"
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
                </div>

                {/* Assigned Staff Preview (Read only for staff) */}
                <div className="mb-6 space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 px-1">
                    <UserRound size={12} /> Assigned Staff
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs font-bold">
                    {item.staffName || "No staff assigned"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  {!item.cancelled && !item.isCompleted && (
                    <div className="flex gap-2">
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
                        onClick={() => {
                          if (window.confirm("Mark as completed?")) completeAppointment(item._id);
                        }}
                        className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <CheckCircle2 size={14} /> Complete
                      </button>
                    </div>
                  )}

                  {item.cancelled && (
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-[11px] uppercase tracking-wider">
                      <XCircle size={14} /> Session Cancelled
                    </div>
                  )}
                </div>

              </div>
            ))}

            {displayAppointments.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No appointments found matching your filters.</p>
              </div>
            )}

          </div>
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default StaffManageAppointments;   
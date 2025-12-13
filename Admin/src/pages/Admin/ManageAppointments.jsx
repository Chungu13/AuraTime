import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ✅ Updated slotDate formatter for ISO format
const slotDateFormat = (slotDate) => {
  try {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const dateObj = new Date(slotDate);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (error) {
    return slotDate; 
  }
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
  } = useContext(AdminContext);

  const { currency, calculateAge } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedStaffForAppointments, setSelectedStaffForAppointments] = useState({});
  const [staffAssignedStatus, setStaffAssignedStatus] = useState({});
  const [availableStaffsByAppointment, setAvailableStaffsByAppointment] = useState({});

  useEffect(() => {
    if (aToken && !selectedDate) {
      getAllAppointments();
    }
  }, [aToken, selectedDate]);

  useEffect(() => {
    if (aToken && professionalStaffs.length === 0) {
      getAllProfessionalStaff();
    }
  }, [aToken, professionalStaffs]);




useEffect(() => {
  const staffSelection = appointments.reduce((acc, item) => {
    const matchingStaff = professionalStaffs.find(staff => staff.name === item.staffName); // ✏️ compare by name now
    acc[item._id] = matchingStaff ? matchingStaff.name : "";
    return acc;
  }, {});
  setSelectedStaffForAppointments(staffSelection);
}, [appointments, professionalStaffs]);


useEffect(() => {
  const fetchAvailableStaff = async () => {
    const result = {};

    for (const appointment of appointments) {
      try {

        console.log("📤 Fetching staff for:", appointment._id, {
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime
        });
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/available?date=${appointment.slotDate}&time=${appointment.slotTime}`
        );
        const data = await res.json();
        result[appointment._id] = data.staff || [];
      } catch (err) {
        console.error("Error fetching available staff:", err);
        result[appointment._id] = []; // fallback to empty
      }
    }

    setAvailableStaffsByAppointment(result);
  };

  if (appointments.length > 0) {
    fetchAvailableStaff();
  }
}, [appointments]);


  const handleDateChange = async (date) => {
  setSelectedDate(date);
  if (date) {
    const formatted = date.toLocaleDateString("en-CA"); // <-- fixed
    const appointments = await getAppointmentsByDate(formatted);
    setFilteredAppointments(appointments || []);
  } else {
    setFilteredAppointments([]);
  }
};


const handleStaffChange = async (e, appointmentId) => {
  const staffId = e.target.value;
  const selectedStaff = professionalStaffs.find(staff => staff._id === staffId);

  setSelectedStaffForAppointments(prev => ({
    ...prev,
    [appointmentId]: selectedStaff?.name || ""
  }));

  await updateStaffForAppointment(appointmentId, staffId);

  // ✅ Refresh available staff for this appointment
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/available?date=${filteredAppointments.find(a => a._id === appointmentId)?.slotDate}&time=${filteredAppointments.find(a => a._id === appointmentId)?.slotTime}`
    );
    const data = await res.json();
    setAvailableStaffsByAppointment(prev => ({
      ...prev,
      [appointmentId]: data.staff || []
    }));
  } catch (err) {
    console.error("Failed to refresh available staff:", err);
  }

  setStaffAssignedStatus(prev => ({
    ...prev,
    [appointmentId]: true
  }));
};


// const handleStaffChange = async (e, appointmentId) => {
//   const staffId = e.target.value;
//   const selectedStaff = professionalStaffs.find(staff => staff._id === staffId);

//   // 1. Update staff mapping for display
//   setSelectedStaffForAppointments(prevState => ({
//     ...prevState,
//     [appointmentId]: selectedStaff?.name || ""
//   }));

//   // 2. Save to backend
//   await updateStaffForAppointment(appointmentId, staffId);

//   // 3. Mark this appointment as "assigned"
//   setStaffAssignedStatus(prevState => ({
//     ...prevState,
//     [appointmentId]: true
//   }));
// };



  const displayAppointments = (selectedDate ? filteredAppointments : appointments).slice().reverse();


  // const totalRevenue = displayAppointments.reduce((total, item) => {
  //   return !item.cancelled ? total + (item?.businessData?.fees || 0) : total;
  // }, 0);

  const completedAppointments = displayAppointments.filter(item => item.isCompleted);
const totalRevenue = completedAppointments.reduce((total, item) => {
  return total + (item?.businessData?.fees || 0);
}, 0);


  return (
    <div className="w-full max-w-7xl m-5">
      <MoveUpOnRender id="admin-allappointment">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <p className="text-lg font-medium text-black">All Appointments</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Select a date"
              className="border px-3 py-1 rounded w-full sm:w-60"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
            <p className="text-sm text-green-600 font-medium">
              Revenue: {currency}{totalRevenue}
            </p>
          </div>
        </div>

        {selectedDate && (
          <p className="text-sm text-gray-500 mb-2">
            Showing appointments for:{" "}
            <strong>{selectedDate.toDateString()}</strong>
          </p>
        )}


        <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
          <div className="hidden sm:grid grid-cols-[0.5fr_2fr_0.8fr_2fr_3fr_2fr_1fr_1fr] items-center py-3 px-6 border-b font-medium text-black bg-gray-50">
            <p>#</p>
            <p>User Name</p>
            <p>Age</p>
            <p>Appointment Time</p>
            <p>Service Name & Service Type</p>
            <p>Assigned Staff</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>

          {displayAppointments.length > 0 ? (
            displayAppointments.map((item, index) => {
              console.log("DEBUG slotDate:", item.slotDate, "slotTime:", item.slotTime);

              return (
                <div
                  className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_0.8fr_2fr_3fr_2fr_1fr_1fr] items-center text-black py-3 px-6 border-b hover:bg-light_beige"
                  key={index}
                >
                  <p className="max-sm:hidden">{index + 1}</p>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={item?.userData?.image}
                      alt="User"
                    />
                    <p className="capitalize">{item.userData.name}</p>
                  </div>

                  <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

                  {/* ✅ Safely format slotDate & slotTime */}
                  <p>
                    {item.slotDate ? slotDateFormat(item.slotDate) : "No date"},{" "}
                    {item.slotTime || "No time"}
                  </p>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover bg-gray-200"
                      src={item?.businessData?.image}
                      alt="Service"
                    />
                    <p>
                      {item?.businessData?.service_name}
                      <br />
                      {item?.businessData?.speciality}
                    </p>
                  </div>

                  {/* Assigned Staff Section
                  {selectedStaffForAppointments[item._id] ? (
                    <p className="text-gray-500">{selectedStaffForAppointments[item._id]}</p>
                  ) : (
                    <select
                      value={selectedStaffForAppointments[item._id] || ""}
                      onChange={(e) => handleStaffChange(e, item._id)}
                      className="border rounded px-2 py-1 w-28"
                    >
                      <option value="">Select Staff</option>
                      {professionalStaffs.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  )} */}

                  {/* {item.cancelled || item.isCompleted ? (
  // Show assigned staff name for cancelled or completed
  <p className="text-gray-500">
    {selectedStaffForAppointments[item._id] || "Not assigned"}
  </p>
) : (
  // Allow dropdown only if appointment is active
  <select
    value={selectedStaffForAppointments[item._id] || ""}
    onChange={(e) => handleStaffChange(e, item._id)}
    className="border rounded px-2 py-1 w-28"
    disabled={item.cancelled} // Disable dropdown if cancelled
  >
    <option value="">Select Staff</option>
    {professionalStaffs.map((staff) => (
      <option key={staff._id} value={staff._id}>
        {staff.name}
      </option>
    ))}
  </select>
)} */}



{/* 
{item.cancelled || item.isCompleted || staffAssignedStatus[item._id] ? (
  <p className="text-gray-500">
    {selectedStaffForAppointments[item._id] || "Not assigned"}
  </p>
) : (
  <select
    value={selectedStaffForAppointments[item._id] || ""}
    onChange={(e) => handleStaffChange(e, item._id)}
    className="border rounded px-2 py-1 w-28"
    disabled={item.cancelled}
  >
    <option value="">Select Staff</option>
    {professionalStaffs.map((staff) => (
      <option key={staff._id} value={staff._id}>
        {staff.name}
      </option>
    ))}
  </select>
)} */}


{/* {item.cancelled || item.isCompleted || staffAssignedStatus[item._id] ? (
  <p className="text-gray-500">
    {selectedStaffForAppointments[item._id] || "Not assigned"}
  </p>
) : (
  <select
    value={selectedStaffForAppointments[item._id] || ""}
    onChange={(e) => handleStaffChange(e, item._id)}
    className="border rounded px-2 py-1 w-28"
    disabled={item.cancelled}
  >
    <option value="">Select Staff</option>
    {(availableStaffsByAppointment[item._id] || []).map((staff) => (
      <option key={staff._id} value={staff._id}>
        {staff.name}
      </option>
    ))}
  </select>
)} */}





{item.cancelled || item.isCompleted || item.staffName ? (
  <p className="text-gray-500">
    {selectedStaffForAppointments[item._id] || "Not assigned"}
  </p>
) : (
  <select
    value={selectedStaffForAppointments[item._id] || ""}
    onChange={(e) => handleStaffChange(e, item._id)}
    className="border rounded px-2 py-1 w-28"
    disabled={item.cancelled}
  >
    <option value="">Select Staff</option>
    {(availableStaffsByAppointment[item._id] || []).map((staff) => (
      <option key={staff._id} value={staff._id}>
        {staff.name}
      </option>
    ))}
  </select>
)}







     




                  <p>{currency}{item?.businessData?.fees}</p>

                  <div className="flex gap-2 justify-between items-center">
                    {item.cancelled ? (
                      <p className="text-red-400 text-xs font-medium">Cancelled</p>
                    ) : item.isCompleted ? (
                      <p className="text-green-500 text-xs font-medium">Completed</p>
                    ) : (
                      <>
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          className="w-6 h-6 cursor-pointer"
                          src={assets.xbutton}
                          alt="Cancel"
                        />
                        <img
                          onClick={() => completeAppointment(item._id)}
                          className="w-6 h-6 cursor-pointer"
                          src={assets.accept}
                          alt="Complete"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-6">
              No appointments found for the selected date.
            </p>
          )}
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default ManageAppointments;   
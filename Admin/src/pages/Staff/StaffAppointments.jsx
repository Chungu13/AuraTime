import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const slotDateFormatter = (slotDate, fallback = "") => {
  try {
    if (!slotDate) return fallback;
    if (slotDate.includes("_")) {
      const [day, month, year] = slotDate.split("_");
      return `${day}/${month}/${year}`;
    }
    const dateObj = new Date(slotDate);
    if (!isNaN(dateObj)) {
      return dateObj.toLocaleDateString();
    }
    return fallback;
  } catch {
    return fallback;
  }
};




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

const formatDateToSlotDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}_${month}_${year}`;
};

const StaffAppointments = () => {
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

  const { calculateAge, currency } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedStaffForAppointments, setSelectedStaffForAppointments] = useState({});
  const [staffAssignedStatus, setStaffAssignedStatus] = useState({});




  useEffect(() => {
    if (dToken && !selectedDate) {
      getAppointments();
    }
  }, [dToken, selectedDate]);

  useEffect(() => {
    if (dToken && professionalStaffs.length === 0) {
      getAllProfessionalStaff();
    }
  }, [dToken, professionalStaffs]);




  useEffect(() => {
    const staffSelection = appointments.reduce((acc, item) => {
      const matchingStaff = professionalStaffs.find(staff => staff.name === item.staffName); // ✏️ compare by name now
      acc[item._id] = matchingStaff ? matchingStaff.name : "";
      return acc;
    }, {});
    setSelectedStaffForAppointments(staffSelection);
  }, [appointments, professionalStaffs]);



  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (date) {
      const formatted = date.toLocaleDateString("en-CA");
      const appointments = await getAppointmentsByDate(formatted);
      setFilteredAppointments(appointments || []);
    } else {
      setFilteredAppointments([]);
    }
  };







  const refreshData = async () => {
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString("en-CA");
      const updatedAppointments = await getAppointmentsByDate(formatted);
      setFilteredAppointments(updatedAppointments || []);
    } else {
      getAppointments();
    }
  };

  const handleStaffChange = async (e, appointmentId) => {
    const staffId = e.target.value;
    const selectedStaff = professionalStaffs.find(staff => staff._id === staffId);

    setSelectedStaffForAppointments(prevState => ({
      ...prevState,
      [appointmentId]: selectedStaff?.name || ""
    }));

    await updateStaffForAppointment(appointmentId, staffId);
    await refreshData();

    setStaffAssignedStatus(prevState => ({
      ...prevState,
      [appointmentId]: true
    }));
  };

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    await refreshData();
  };

  const handleComplete = async (id) => {
    await completeAppointment(id);
    await refreshData();
  };



  const displayAppointments = (selectedDate ? filteredAppointments : appointments)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(`${a.slotDate} ${a.slotTime}`);
      const dateB = new Date(`${b.slotDate} ${b.slotTime}`);
      return dateB - dateA;
    });




  const completedAppointments = displayAppointments.filter(item => item.isCompleted);
  const totalRevenue = completedAppointments.reduce((total, item) => {
    return total + (item?.businessData?.fees || 0);
  }, 0);


  return (
    <div className="w-full max-w-7xl m-5">
      <MoveUpOnRender id="admin-allappointment">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <p className="text-lg font-medium">All Appointments</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Select a date"
              className="border px-3 py-1 rounded w-full sm:w-60"
              dateFormat="yyyy-MM-dd"
              isClearable
            />

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
                          onClick={() => handleCancel(item._id)}
                          className="w-6 h-6 cursor-pointer"
                          src={assets.xbutton}
                          alt="Cancel"
                        />
                        <img
                          onClick={() => handleComplete(item._id)}
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
              No appointments found .
            </p>
          )}
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default StaffAppointments;  
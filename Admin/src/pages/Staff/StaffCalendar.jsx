import { useContext, useEffect, useMemo, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import CustomEvent from "../../components/Customevent";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    getAppointmentsByDate,
    getAllProfessionalStaff,
    professionalStaffs,
    updateStaffForAppointment,
  } = useContext(StaffContext);

  const { currency } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAppointment(null);
  };

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

  const displayAppointments = selectedDate ? filteredAppointments : appointments;

  const events = useMemo(() => {
    return displayAppointments
      .map((item) => {
        const date = new Date(item.slotDate);
        const [time, modifier] = item.slotTime.split(" ");
        const [hoursStr, minutesStr] = time.split(":");

        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const start = new Date(date);
        start.setHours(hours);
        start.setMinutes(minutes);
        start.setSeconds(0);

        const duration = item.businessData?.serviceDuration || 30;
        const end = new Date(start.getTime() + duration * 60000);

        return {
          id: item._id,
          title: `${item.staffName || "No Staff"} - ${item.businessData?.service_name || "No Service"}`,
          start,
          end,
          resource: item,
        };
      })
      .filter(Boolean);
  }, [displayAppointments]);


  const eventStyleGetter = (event) => {
    const { cancelled, isCompleted } = event.resource || {};
    let backgroundColor = "#598fe6ff";
    if (cancelled) backgroundColor = "#d17575ff";
    else if (isCompleted) backgroundColor = "#5fd8b0ff";

    return {
      style: {
        backgroundColor,
        color: "#fff",
        borderRadius: "10px",
        padding: "8px 10px",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderLeft: "5px solid rgba(255,255,255,0.7)",
      },
    };
  };





  const handleSelectEvent = (event) => {
    openModal(event.resource);
  };


  const completedAppointments = displayAppointments.filter((item) => item.isCompleted);
  const totalRevenue = completedAppointments.reduce((total, item) => {
    return total + (item?.businessData?.fees || 0);
  }, 0);

  return (
    <div className="w-full max-w-7xl m-5">
      <MoveUpOnRender id="admin-calendar">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <p className="text-lg font-medium text-black">Appointment Calendar View</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Filter by date"
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
            Showing appointments for: <strong>{selectedDate.toDateString()}</strong>
          </p>
        )}

        <div style={{ height: "80vh", backgroundColor: "#fff", borderRadius: "8px", padding: "10px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            views={["month", "week", "day"]}
            defaultView="week"
            popup
            style={{ height: "100%", fontSize: "14px" }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent,
            }}
          />

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Appointment Details"
            style={{
              content: {
                top: '20%',
                left: '20%',
                right: '20%',
                bottom: 'auto',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            }}
            ariaHideApp={false}

          >


            {selectedAppointment && (
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Details</h2>
                <p><strong>Therapist:</strong> {selectedAppointment.staffName}</p>
                <p><strong>Client:</strong> {selectedAppointment.userData?.name}</p>
                <p><strong>Service:</strong> {selectedAppointment.businessData?.service_name}</p>
                <p><strong>Date:</strong> {new Date(selectedAppointment.slotDate).toDateString()}</p>
                <p><strong>Time:</strong> {selectedAppointment.slotTime}</p>
                <p><strong>Duration:</strong> {selectedAppointment.businessData?.serviceDuration}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            )}
          </Modal>

        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default CalendarView;

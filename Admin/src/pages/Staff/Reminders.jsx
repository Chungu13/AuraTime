import { useContext, useState, useEffect } from "react";
import { StaffContext } from "../../context/StaffContext";
import { toast } from "react-toastify";
import axios from "axios";

const StaffReminder = () => {
  const { backendUrl, dToken } = useContext(StaffContext);
  const [appointments, setAppointments] = useState([]);



  useEffect(() => {
    console.log("useEffect triggered");
    if (dToken) {
      getNextDayAppointments();
    }
  }, [dToken]);

  const getNextDayAppointments = async () => {
    try {
      console.log("DToken:", dToken);

      const { data } = await axios.get(`${backendUrl}/api/staff/appointments-nextday`, {
        headers: { dToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error("No appointments found for tomorrow.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments.");
    }
  };



  const sendReminder = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/staff/send-reminder`, {
        appointmentId,
      }, {
        headers: { dToken }
      });

      if (data.success) {
        toast.success("Reminder sent successfully!");
      } else {
        toast.error("Failed to send reminder.");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Error sending reminder.");
    }
  };

  const slotDateFormat = (slotDate) => {
    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const dataArray = slotDate.split("_");
    return `${dataArray[0]} ${months[Number(dataArray[1])]} ${dataArray[2]}`;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border rounded shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4">Appointments for Tomorrow</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left border-b">Customer Name</th>
            <th className="p-3 text-left border-b">Specialty</th>
            <th className="p-3 text-left border-b">Appointment Time</th>
            <th className="p-3 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="p-3 border-b">{appointment.userData?.name}</td>
              <td className="p-3 border-b">{appointment.businessData?.speciality}</td>
              <td className="p-3 border-b">{slotDateFormat(appointment.slotDate)} at {appointment.slotTime}</td>
              <td className="p-3 border-b">
                <button
                  onClick={() => sendReminder(appointment._id)}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  Send Reminder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffReminder;

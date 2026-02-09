import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";

const ReminderPage = () => {
  const {
    dToken,
    nextdayappointments = [],
    getNextDayAppointments,
    sendReminderEmails,
  } = useContext(StaffContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      await getNextDayAppointments();
      setLoading(false);
    };


    fetchAppointments();
  }, []);


  const handleSendReminders = async () => {
    setLoading(true);
    await sendReminderEmails();
    await getNextDayAppointments();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-10">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Reminder Page
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full"></div>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-semibold text-center text-gray-700 mb-4">
              Appointments for Tomorrow
            </h3>
            {nextdayappointments.length === 0 ? (
              <p className="text-lg text-center text-gray-600">
                No appointments for tomorrow.
              </p>
            ) : (
              <ul className="space-y-4">
                {nextdayappointments.map((appointment) => (
                  <li
                    key={appointment._id}
                    className="flex justify-between items-center p-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300"
                  >
                    <div className="text-lg font-medium text-gray-800">
                      <span className="block">{appointment.userData?.name}</span>
                      <span className="text-sm text-gray-500">
                        {appointment.userData?.email} -{" "}
                      </span>


                      <span className="text-sm text-gray-500">
                        {appointment.slotTime} -{" "}
                        {new Date(appointment.slotDate).toLocaleDateString()} -{" "}
                        {appointment.businessData?.service_name}
                      </span>

                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSendReminders}
                disabled={nextdayappointments.length === 0}
                className={`px-6 py-3 text-white rounded-lg shadow-lg focus:outline-none ${nextdayappointments.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-beige hover:bg-white hover:text-black"
                  }`}
              >
                Send Reminder Emails
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReminderPage;

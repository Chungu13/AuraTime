import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";
import MoveUpOnRender from "../../components/MoveUpOnRender.jsx";

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    dashData,
    staffCount,
    fetchStaffCount,
  } = useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
      fetchStaffCount();
    }
  }, [aToken]);

  return (
    (dashData || staffCount > 0) && (
      <MoveUpOnRender id="admin-dash">
        <div className="m-6">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {/* Staff */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <img className="w-14" src={assets.people} alt="Staff Icon" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{staffCount}</p>
                <p className="text-gray-500">Staff Members</p>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <img className="w-14" src={assets.appointment} alt="Appointment Icon" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashData?.appointments}
                </p>
                <p className="text-gray-500">Total Appointments</p>
              </div>
            </div>

            {/* Users */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <img className="w-14" src={assets.team} alt="User Icon" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashData?.users}
                </p>
                <p className="text-gray-500">Registered Users</p>
              </div>
            </div>
          </div>

          {/* Latest Bookings */}
          <div className="bg-white rounded-xl shadow-md border">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b">
              <img src={assets.list_icon} alt="List Icon" />
              <p className="text-lg font-semibold text-gray-800">Latest Bookings</p>
            </div>

            <div className="divide-y">
              {dashData?.latestAppointments?.map((item, index) => (
                <div
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                  key={index}
                >
                  <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={item?.businessData?.image}
                    alt="Business"
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-900 font-medium">{item?.userData?.name}</p>
                    <p className="text-gray-700">{item?.businessData?.service_name}</p>
                    <p className="text-gray-500 text-sm">{slotDateFormat(item?.slotDate)}</p>
                  </div>


                  {item.cancelled ? (
                    <span className="text-xs bg-red-100 text-red-500 font-semibold px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-xs bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-600 font-semibold px-3 py-1 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MoveUpOnRender>
    )
  );
};

export default Dashboard;

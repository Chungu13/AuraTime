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

  const StaffIcon = () => (
    <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#f5ede0] to-[#e8d8c0] border border-[#c9a97a]/30 flex items-center justify-center text-[#a07850] shrink-0">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  );

  const AppointmentIcon = () => (
    <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#f5ede0] to-[#e8d8c0] border border-[#c9a97a]/30 flex items-center justify-center text-[#a07850] shrink-0">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2" />
      </svg>
    </div>
  );

  const UsersIcon = () => (
    <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#f5ede0] to-[#e8d8c0] border border-[#c9a97a]/30 flex items-center justify-center text-[#a07850] shrink-0">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
  return (
    (dashData || staffCount > 0) && (
      <MoveUpOnRender id="admin-dash">
        <div className="m-6">


          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {/* Staff */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <StaffIcon />
              <div>
                <p className="text-2xl font-bold text-gray-800">{staffCount}</p>
                <p className="text-gray-500">Staff Members</p>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <AppointmentIcon />
              <div>
                <p className="text-2xl font-bold text-gray-800">{dashData?.appointments}</p>
                <p className="text-gray-500">Total Appointments</p>
              </div>
            </div>

            {/* Users */}
            <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
              <UsersIcon />
              <div>
                <p className="text-2xl font-bold text-gray-800">{dashData?.users}</p>
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
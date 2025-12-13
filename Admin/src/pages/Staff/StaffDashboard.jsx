import { useContext, useEffect } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext.jsx";
import MoveUpOnRender from "../../components/MoveUpOnRender.jsx";
import { assets } from "../../assets/assets";

const StaffDashboard = () => {
  const {
    dToken,
    getDashData,
    dashData,
    staffCount,
    fetchStaffCount,
  } = useContext(StaffContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
      fetchStaffCount();
    }
  }, [dToken]);

  const totalRevenue = dashData?.latestAppointments?.reduce((total, item) => {
    return !item.cancelled ? total + (item?.businessData?.fees || 0) : total;
  }, 0);

  return (
    (dashData || staffCount > 0) && (
      <MoveUpOnRender id="staff-dash">
        <div className="px-6 py-6">
          {/* === Stats Section === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {/* Appointments */}
            <StatCard
              icon={assets.appointment}
              label="Appointments"
              value={dashData?.appointments}
            />

            {/* Users */}
            <StatCard
              icon={assets.team}
              label="Users"
              value={dashData?.users}
            />
          </div>

          {/* === Bookings Section === */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
              <img src={assets.list_icon} alt="list" className="w-5 h-5" />
              <h2 className="font-semibold text-lg text-gray-700">Latest Bookings</h2>
            </div>

            {dashData?.latestAppointments?.length ? (
              <div>
                {dashData.latestAppointments.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-6 py-4 border-t hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item?.businessData?.image}
                        alt="Service"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item?.businessData?.service_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {slotDateFormat(item?.slotDate)}
                        </p>
                      </div>
                    </div>

                    <div>
                      {item.cancelled ? (
                        <StatusLabel label="Cancelled" color="red" />
                      ) : item.isCompleted ? (
                        <StatusLabel label="Completed" color="green" />
                      ) : (
                        <StatusLabel label="Pending" color="yellow" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6">
                No bookings available.
              </p>
            )}
          </div>
        </div>
      </MoveUpOnRender>
    )
  );
};

export default StaffDashboard;


const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border border-gray-100 hover:scale-105 transition-transform">
    <img src={icon} alt={label} className="w-12 h-12" />
    <div>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const StatusLabel = ({ label, color }) => (
  <span
    className={`text-${color}-500 bg-${color}-100 px-3 py-1 text-xs font-medium rounded-full`}
  >
    {label}
  </span>
);

import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const Reports = () => {
  const { reports } = useContext(AdminContext);

  if (!reports) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading reports...
      </div>
    );
  }

  const {
    serviceTrends = {},
    revenue = 0,
    cancellations = 0,
    completed = 0,
    totalAppointments = 0,
    peakTimes = {},
    peakDays = {}
  } = reports;

  const isEmpty = totalAppointments === 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📄 Reports</h2>

      {isEmpty ? (
        <div className="text-gray-600">No report data available yet.</div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold">Total Appointments:</p>
              <p>{totalAppointments}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold">Completed:</p>
              <p>{completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold">Cancelled:</p>
              <p>{cancellations}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold">Revenue:</p>
              <p>${revenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">📈 Service Trends</h3>
            {Object.keys(serviceTrends).length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(serviceTrends).map(([service, count]) => (
                  <li key={service}>
                    {service}: {count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No service trends available.</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">📅 Peak Days</h3>
            {Object.keys(peakDays).length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(peakDays).map(([day, count]) => (
                  <li key={day}>
                    {day}: {count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No peak day data available.</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">⏰ Peak Times</h3>
            {Object.keys(peakTimes).length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(peakTimes).map(([time, count]) => (
                  <li key={time}>
                    {time}: {count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No peak time data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

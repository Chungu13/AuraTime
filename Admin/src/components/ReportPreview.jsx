
import React, { forwardRef } from "react";

const ReportPreview = forwardRef(({ trends, insights }, ref) => {
  return (
    <div ref={ref} className="p-6 text-gray-900 bg-white font-sans">
      <h1 className="text-2xl font-bold mb-4">📊 Analytics Report</h1>

      <h2 className="text-lg font-semibold mb-2">🧾 Summary</h2>
      <ul className="mb-4 list-disc pl-5">
        <li>Total Appointments: {trends.totalAppointments}</li>
        <li>Total Revenue: RM {trends.totalRevenue}</li>
        <li>Completed: {trends.completed}</li>
        <li>Cancelled: {trends.cancelled}</li>
      </ul>

      <h2 className="text-lg font-semibold mb-2">🔍 Extra Insights</h2>
      <ul className="mb-4 list-disc pl-5">
        <li>Busiest Day: {insights.busiestDay || "N/A"}</li>
        <li>Top Service: {insights.topService || "N/A"}</li>
        <li>Cancellation Rate: {insights.cancelRate}%</li>
        <li>Top Therapist: {insights.topTherapist || "N/A"}</li>
      </ul>

      <p className="text-sm text-gray-500 mt-6">Generated on {new Date().toLocaleString()}</p>
    </div>
  );
});

export default ReportPreview;

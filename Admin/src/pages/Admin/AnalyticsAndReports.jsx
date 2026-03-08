import { useEffect, useState, useContext, useRef } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Line, Bar } from "react-chartjs-2";
import { useReactToPrint } from "react-to-print";
import ReportPreview from "../../components/ReportPreview";



import { Link } from "react-router-dom";




import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const generateDateRange = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const fillMissingDates = (data, startStr, endStr) => {
  const fullRange = generateDateRange(startStr, endStr);
  const dataMap = new Map();
  data.forEach(item => {
    dataMap.set(item._id, item.totalAppointments);
  });

  return fullRange.map(date => ({
    _id: date,
    totalAppointments: dataMap.get(date) || 0,
  }));
};

const AnalyticsDashboard = () => {
  const {
    fetchAnalyticsData,
    appointmentTrends,
    servicePopularity,
    revenueTrends,
    cancellationTrends,
    appointmentTypeTrends,
    isLoading,
  } = useContext(AdminContext);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef();

  useEffect(() => {
    const today = new Date();
    const future30 = new Date(today);
    future30.setDate(today.getDate() + 30);

    const newStart = today.toISOString().split("T")[0];
    const newEnd = future30.toISOString().split("T")[0];

    setStartDate(newStart);
    setEndDate(newEnd);

    fetchAnalyticsData(newStart, newEnd);
  }, []);

  const handleGenerateReport = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "Analytics_Report",
  });

  const paddedAppointmentTrends = fillMissingDates(appointmentTrends, startDate, endDate);

  const totalRevenue = revenueTrends.reduce((sum, r) => sum + r.totalRevenue, 0);
  const completed = appointmentTypeTrends.find(t => t._id === "completed")?.totalAppointments || 0;
  const cancelled = appointmentTypeTrends.find(t => t._id === "cancelled")?.totalAppointments || 0;
  const busiestDay = [...appointmentTrends].sort((a, b) => b.totalAppointments - a.totalAppointments)[0]?._id;
  const topService = [...servicePopularity].sort((a, b) => b.totalAppointments - a.totalAppointments)[0]?._id;
  const cancelRate = ((cancelled / (completed + cancelled)) * 100).toFixed(1);

  const trendsData = {
    totalAppointments: completed + cancelled,
    totalRevenue,
    completed,
    cancelled,
  };

  const extraInsights = {
    busiestDay,
    topService,
    cancelRate,
    topTherapist: "Not tracked",
  };

  const appointmentData = {
    labels: paddedAppointmentTrends.map((trend) => new Date(trend._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    datasets: [
      {
        label: "Appointments",
        data: paddedAppointmentTrends.map((trend) => trend.totalAppointments),
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4
      }
    ]
  };

  const serviceData = {
    labels: servicePopularity.map((service) => service._id),
    datasets: [
      {
        label: "Appointments",
        data: servicePopularity.map((service) => service.totalAppointments),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(153, 102, 255, 1)",
        hoverBorderColor: "rgba(153, 102, 255, 1)",
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const revenueData = {
    labels: revenueTrends.map((revenue) => revenue._id),
    datasets: [
      {
        label: "Revenue",
        data: revenueTrends.map((revenue) => revenue.totalRevenue),
        fill: false,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderWidth: 4,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
      },
    ],
  };

  const cancellationData = {
    labels: cancellationTrends.map((cancellation) => cancellation._id),
    datasets: [
      {
        label: "Cancellations",
        data: cancellationTrends.map((cancellation) => cancellation.totalCancellations),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255, 99, 132, 1)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const appointmentTypeData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        label: "Appointments",
        data: appointmentTypeTrends.map((type) => type.totalAppointments),
        backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
        hoverBackgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        hoverBorderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  return (
    
      <div className="w-full max-w-7xl mx-auto p-4">
  <div className="flex justify-end mb-4">
    <Link
      to="/reportsPage"
     className="bg-beige text-white px-4 py-2 rounded hover:bg-stone-700 transition duration-200 shadow"

    >
      📄 View Reports
    </Link>
  </div>



 


      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-4 shadow-lg rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Appointment Trends</h2>
            <Line data={appointmentData} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Service Popularity</h2>
            <Bar data={serviceData} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
            <Line data={revenueData} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Cancellation Trends</h2>
            <Bar data={cancellationData} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 shadow-lg rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Completed vs Cancelled Appointments</h2>
            <Bar data={appointmentTypeData} options={{ responsive: true }} />
          </div>
        </div>
      )}

    </div>

  );
};

export default AnalyticsDashboard;

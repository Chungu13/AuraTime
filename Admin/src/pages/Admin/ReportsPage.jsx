import { useContext, useEffect } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AdminContext } from "../../context/AdminContext";
import {
  FileText,
  CheckCircle,
  XCircle,
  CreditCard,
  CalendarDays,
  User,
  DollarSign,
  Users,
  Star,
  Download
} from "lucide-react";

const ReportsPage = () => {
  const { report, fetchReport } = useContext(AdminContext);

  useEffect(() => {
    if (!report) {
      fetchReport();
    }
  }, [report, fetchReport]);

  const metrics = [
    { label: "Total Users", value: report?.totalUsers, icon: <Users className="text-blue-600" /> },
    { label: "Total Appointments", value: report?.totalAppointments, icon: <FileText className="text-indigo-600" /> },
    { label: "Completed Appointments", value: report?.completedAppointments, icon: <CheckCircle className="text-green-600" /> },
    { label: "Cancelled Appointments", value: report?.cancelledAppointments, icon: <XCircle className="text-red-600" /> },
    { label: "Paid Appointments", value: report?.paidAppointments, icon: <CreditCard className="text-purple-600" /> },
    { label: "Earnings", value: `RM ${report?.totalEarnings}`, icon: <DollarSign className="text-yellow-500" /> },
    { label: "Appointments This Week", value: report?.appointmentsThisWeek, icon: <CalendarDays className="text-teal-600" /> },
    { label: "Most Booked Service", value: report?.mostBookedService, icon: <Star className="text-orange-500" /> },
    // { label: "Online Bookings", value: report?.onlineBookings, icon: <User className="text-pink-600" /> },
  ];

  const headers = [
    { label: "Metric", key: "label" },
    { label: "Value", key: "value" }
  ];

  const csvData = metrics.map(m => ({
    label: m.label,
    value: typeof m.value === "string" ? m.value : m.value?.toString()
  }));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Business Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Metric", "Value"]],
      body: metrics.map(item => [item.label, item.value]),
    });
    doc.save("report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Reports</h1>
          <div className="flex space-x-4">
            <CSVLink
              data={csvData}
              headers={headers}
              filename="report.csv"
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </CSVLink>
            <button
              onClick={generatePDF}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600"
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Metric</th>
                <th className="px-6 py-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{item.icon}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.label}</td>
                  <td className="px-6 py-4 text-gray-700">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

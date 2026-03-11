import React, { useContext } from "react";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import "./App.css";
import { AppContext } from "./context/AppContext";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import DashBoard from "./pages/Admin/Dashboard";

import AllAppointments from "./pages/Admin/AdminCalendar.jsx";

import AddService from "./pages/Admin/AddService.jsx";

import ServiceList from "./pages/Admin/ServiceList.jsx";
import { StaffContext } from "./context/StaffContext";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffProfile from "./pages/Staff/StaffProfile";
import TopLoadingBar from "./components/TopLoadingBar";
import Feedback from "./pages/Admin/CustomerFeedback.jsx";
import StaffRegistration from "./pages/Admin/AddAdminStaff.jsx";
import StaffFeedbacks from "./pages/Staff/StaffFeedbacks";

import ManualBookingForm from "./pages/Staff/ManualBooking.jsx";

import RegisterTherapist from "./pages/Admin/AddTherapist.jsx";

import ManageStaff from "./pages/Admin/ManageEmployees.jsx";

import AnalyticsDashboard from "./pages/Admin/AnalyticsAndReports.jsx";

import ReportsPage from "./pages/Admin/ReportsPage.jsx";

import ManageAppointments from "./pages/Admin/AppointmentsAndRevenue.jsx";

import StaffManageAppointments from "./pages/Staff/MyStaffAppointments.jsx";

import CalendarView from "./pages/Staff/MyStaffCalendar.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(StaffContext);
  const { isLoading } = useContext(AppContext);
  return aToken || dToken ? (
    <>
      {isLoading && <TopLoadingBar />}
      <Toaster position="top-center" richColors />
      <div className="bg-[#F8F9FD]">
        <Navbar />
        <div className="flex items-start">
          <Sidebar />

          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={aToken ? <Navigate to="/admin-dashboard" /> : <Navigate to="/staff-dashboard" />} />
            <Route path="/admin-dashboard" element={<DashBoard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/service-list" element={<ServiceList />} />
            <Route
              path="/therapist-registration"
              element={<RegisterTherapist />}
            />
            <Route
              path="/analytic-dashboard"
              element={<AnalyticsDashboard />}
            />
            <Route path="/manage-staff" element={<ManageStaff />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Staff Routes */}
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/staff-profile" element={<StaffProfile />} />

            <Route path="/staff-registration" element={<StaffRegistration />} />
            <Route path="/staff-feedbacks" element={<StaffFeedbacks />} />
            <Route path="/booking_page" element={<ManualBookingForm />} />

            <Route path="/reportsPage" element={<ReportsPage />} />

            <Route
              path="/appointment-management"
              element={<ManageAppointments />}
            />

            <Route
              path="/staff-manage-appointments"
              element={<StaffManageAppointments />}
            />

            <Route path="/staff-calendar" element={<CalendarView />} />
          </Routes>
        </div>
      </div>
    </>
  ) : (
    <div>
      {isLoading && <TopLoadingBar />}
      <Toaster position="top-center" richColors />
      <Login />
    </div>
  );
};

export default App;

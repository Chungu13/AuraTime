import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";

import { Toaster } from 'sonner';

import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./context/AppContext";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/Admin/Dashboard";

import AllAppointments from "./pages/Admin/AllAppointments";
import AddBusiness from "./pages/Admin/AddBusiness";
import StaffsList from "./pages/Admin/StaffsList";
import { StaffContext } from "./context/StaffContext";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffAppointmets from "./pages/Staff/StaffAppointments";
import StaffProfile from "./pages/Staff/StaffProfile";
import TopLoadingBar from "./components/TopLoadingBar";
import Feedbacks from "./pages/Admin/Feedbacks";
import StaffRegistration from "./pages/Admin/StaffRegistration";
import StaffFeedbacks from "./pages/Staff/StaffFeedbacks";

import ManualBookingForm from "./pages/Staff/StaffManualBooking";

import ProfessionalStaffRegistration from "./pages/Admin/AddProfessionalStaff";

import AdminStaffList from "./pages/Admin/AllStaffList";

import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";

import StaffReminder from "./pages/Staff/Reminders";

import ReminderPage from "./pages/Staff/ReminderPage";

 import Reports from "./pages/Admin/Reports";

 import ReportsPage from "./pages/Admin/ReportsPage.jsx";

 import Therapists from "./pages/Admin/Therapists.jsx";


 import ManageAppointments from "./pages/Admin/ManageAppointments.jsx";

 import StaffManageAppointments from "./pages/Staff/StaffManageAppointments.jsx";

import CalendarView from "./pages/Staff/StaffCalendar.jsx";



import './App.css'; // with the './' if it's in src folder


const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(StaffContext);
  const { isLoading } = useContext(AppContext);
  return aToken || dToken ? (
    <>
      {isLoading && <TopLoadingBar />}
      <div className="bg-[#F8F9FD]">
         <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={true}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  toastClassName={(context) => {
    if (context?.type === "success") {
      return "custom-toast-success";
    }
    if (context?.type === "error") {
      return "custom-toast-error";
    }
    return "custom-toast-default";
  }}
  bodyClassName="toast-body"
/>
    
        <Navbar />
        <div className="flex items-start">
          <Sidebar />

          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<DashBoard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/staff-list" element={<StaffsList />} />

            <Route path="/professional_staff" element={<ProfessionalStaffRegistration />} />

            <Route path="/analytic-dashboard" element={<AnalyticsDashboard/>} />

            <Route path="/all-staff" element={<AdminStaffList/>} />

            {/* Staff Routes */}
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route
              path="/staff-appointments"
              element={<StaffAppointmets />}
            />
            <Route path="/staff-profile" element={<StaffProfile />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/staff-registration" element={<StaffRegistration />} />
            <Route path="/staff-feedbacks" element={<StaffFeedbacks />} />
            <Route path="/booking_page" element={< ManualBookingForm/>} />

            <Route path="/Reminder" element={< StaffReminder/>} />

            <Route path="/ReminderPage" element={< ReminderPage/>} />


            <Route path="/reportsPage" element={< ReportsPage/>} />

            <Route path="/therapists" element={< Therapists/>} />
            <Route path="/reports" element={<Reports />} />

            <Route path="/manage-appointments" element={<ManageAppointments />} />

            <Route path="/staff-manage-appointments" element={<StaffManageAppointments />} />



           <Route path="/staff-calendar" element={< CalendarView/>} />

           

        
          </Routes>
        </div>
      </div>
    </>
  ) : (
    <div>
      {isLoading && <TopLoadingBar />}
      <Login/>

      <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={true}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  toastClassName={(context) => {
    if (context?.type === "success") {
      return "custom-toast-success";
    }
    if (context?.type === "error") {
      return "custom-toast-error";
    }
    return "custom-toast-default";
  }}
  bodyClassName="toast-body"
/>

    </div>
  );
};

export default App;

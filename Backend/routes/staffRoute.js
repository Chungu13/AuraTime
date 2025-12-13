import express from "express";
const staffRouter = express.Router();
import {
  appointmentCancel,
  appointmentComplete,
  appointmentsStaff,
  staffDashboard,
  staffList,
  staffLogin,
  staffProfile,
  getStaffBusiness,
  updateStaffBusiness,
  getAllFeedbacks,
  getStaffCount,
  allStaffs,
  manualBooking,
  allBookedSolts,
  getAllProfessionalStaff,
  // getAppointmentsForNextDay,
  // sendReminder,
  updateStaffForAppointment,
  getNextDayAppointments, 
  sendReminderEmails,
  getAppointmentsByDate,
  getAvailableStaff
  

} from "../controllers/staffController.js";
import authStaff from "../middlewares/authStaff.js";

// all staff api
staffRouter.get("/list", staffList);
staffRouter.post("/login", staffLogin);
staffRouter.get("/appointments", authStaff, appointmentsStaff);
staffRouter.post("/complete-appointment", authStaff, appointmentComplete);
staffRouter.post("/cancel-appointment", authStaff, appointmentCancel);
staffRouter.get("/staff-dashboard", authStaff, staffDashboard);
staffRouter.get("/staff-profile", authStaff, staffProfile);
staffRouter.get("/staff-feedbacks", getAllFeedbacks); 
staffRouter.get("/get-business", authStaff, getStaffBusiness);
staffRouter.post("/updateStaffBusiness", updateStaffBusiness);
staffRouter.get("/staff-count", getStaffCount);

staffRouter.get("/all-staffs", authStaff, allStaffs);

staffRouter.post("/create-manual-appointment", manualBooking);

staffRouter.get("/check-appointments", authStaff, allBookedSolts);

staffRouter.get("/get-all-professional-staff", authStaff, getAllProfessionalStaff);


staffRouter.post("/update-staff", authStaff, updateStaffForAppointment );


// staffRouter.get("/appointments-nextday", authStaff, getAppointmentsForNextDay); // API route

// staffRouter.post("/send-reminder", authStaff, sendReminder); // API route


// Route to fetch appointments for the next day
staffRouter.get("/next-day-appointments", getNextDayAppointments);

// Route to send reminder emails
staffRouter.post("/send-reminders",  sendReminderEmails);

staffRouter.post("/appointments-by-date", getAppointmentsByDate);

staffRouter.get("/available", getAvailableStaff);

export default staffRouter;


import expres from "express";

import {
  addBusiness,
  adminDashboard,
  allStaffs,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
  getAppointmentsByDate,
  getAllFeedbacks,
  registerStaff,
  //getAllStaffUsers,
  getStaffCount,
  registerProfessionalStaff,
  getAllProfessionalStaff,
  appointmentComplete,
  updateStaffForAppointment,
  getAppointmentTrends,
  getServicePopularity,
  getRevenueTrends,
  getAllFrontStaff,
  deleteFrontStaff,
  deleteProfessionalStaff,
  getCancellationTrends,
  getAppointmentTypeTrends,
  toggleFeedbackApproval,
  getReports,
  generateAppointmentReports,
  getAvailableStaff,
  gettherapist,
  getStaffAppointments


} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailabilty, deleteStaff } from "../controllers/staffController.js";

const adminRouter = expres.Router();

adminRouter.post("/add-business", authAdmin, upload.single("image"), addBusiness);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-staffs", authAdmin, allStaffs);
adminRouter.post("/change-availability", authAdmin, changeAvailabilty);
adminRouter.post("/delete-service", authAdmin, deleteStaff);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.post("/appointments-by-date", authAdmin, getAppointmentsByDate);
adminRouter.get("/feedbacks", authAdmin, getAllFeedbacks);
adminRouter.post("/staff-registration", authAdmin, registerStaff);
//adminRouter.get("/business-users", getAllStaffUsers);
adminRouter.get("/staff-count", authAdmin, getStaffCount);
adminRouter.post("/register-professional-staff", upload.single("image"), authAdmin, registerProfessionalStaff);

adminRouter.post("/complete-appointment", authAdmin, appointmentComplete);

adminRouter.post("/update-staff", authAdmin, updateStaffForAppointment);

adminRouter.get("/get-all-professional-staff", authAdmin, getAllProfessionalStaff);


adminRouter.put("/feedback/approve/:id", toggleFeedbackApproval);



adminRouter.post("/appointment-trends", authAdmin, getAppointmentTrends);

// Route for Service Popularity
adminRouter.get("/service-popularity", authAdmin, getServicePopularity);


// Route for Revenue Trends
adminRouter.get("/revenue-trends", authAdmin, getRevenueTrends);



// Route for Appointment Cancellation Trends
adminRouter.get("/cancellation-trends", authAdmin, getCancellationTrends);

// Route for Appointment Type Trends (Completed vs Cancelled)
adminRouter.get("/appointment-type-trends", authAdmin, getAppointmentTypeTrends);

adminRouter.get("/all-front-staffs", authAdmin, getAllFrontStaff);

adminRouter.post("/delete-front-staff", authAdmin, deleteFrontStaff);

adminRouter.post("/delete-professional-staff", authAdmin, deleteProfessionalStaff);

adminRouter.post("/delete-professional-staff", authAdmin, deleteProfessionalStaff);

adminRouter.get("/reports", authAdmin, getReports);

adminRouter.get("/generatereports", authAdmin, generateAppointmentReports);

adminRouter.get("/available", authAdmin, getAvailableStaff);


// adminRouter.get("/schedule/:staffName", getStaffScheduleByName);

adminRouter.get("/all-staff", authAdmin, gettherapist,);


adminRouter.get("/staff-appointments", authAdmin, getStaffAppointments);

export default adminRouter;

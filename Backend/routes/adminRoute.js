import express from "express";

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
  getStaffAppointments,
  markAppointmentAsPaid,
  createAdminCheckoutSession
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability, deleteStaff } from "../controllers/staffController.js";

const adminRouter = express.Router();

adminRouter.post("/add-service", authAdmin, upload.single("image"), addBusiness);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-staffs", authAdmin, allStaffs);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/delete-service", authAdmin, deleteStaff);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.post("/appointments-by-date", authAdmin, getAppointmentsByDate);
adminRouter.get("/feedbacks", authAdmin, getAllFeedbacks);
adminRouter.post("/staff-registration", authAdmin, registerStaff);
adminRouter.get("/staff-count", authAdmin, getStaffCount);
adminRouter.post("/register-professional-staff", authAdmin, upload.single("image"), registerProfessionalStaff);
adminRouter.post("/complete-appointment", authAdmin, appointmentComplete);
adminRouter.post("/update-staff", authAdmin, updateStaffForAppointment);
adminRouter.get("/get-all-professional-staff", authAdmin, getAllProfessionalStaff);
adminRouter.put("/feedback/approve/:id", authAdmin, toggleFeedbackApproval);
adminRouter.post("/appointment-trends", authAdmin, getAppointmentTrends);
adminRouter.get("/service-popularity", authAdmin, getServicePopularity);
adminRouter.get("/revenue-trends", authAdmin, getRevenueTrends);
adminRouter.get("/cancellation-trends", authAdmin, getCancellationTrends);
adminRouter.get("/appointment-type-trends", authAdmin, getAppointmentTypeTrends);
adminRouter.get("/all-front-staffs", authAdmin, getAllFrontStaff);
adminRouter.post("/delete-front-staff", authAdmin, deleteFrontStaff);
adminRouter.post("/delete-professional-staff", authAdmin, deleteProfessionalStaff);
adminRouter.get("/reports", authAdmin, getReports);
adminRouter.get("/generatereports", authAdmin, generateAppointmentReports);
adminRouter.get("/available", authAdmin, getAvailableStaff);
adminRouter.get("/all-staff", authAdmin, gettherapist);
adminRouter.get("/staff-appointments", authAdmin, getStaffAppointments);
adminRouter.post("/mark-as-paid", authAdmin, markAppointmentAsPaid);
adminRouter.post("/create-admin-checkout-session", authAdmin, createAdminCheckoutSession);

export default adminRouter;

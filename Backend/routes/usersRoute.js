import express from "express";
import Stripe from "stripe";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
// import appointmentModel from "../models/appointmentModel.js";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  submitFeedback,
  fetchAppointmentById,
  rescheduleAppointment,
  forgotPassword,
  getApprovedFeedbacks,
  // getAppointmentsForNextDay
} from "../controllers/userController.js";

import {
  createCheckoutSession,
  verifyStripePayment,
} from "../controllers/userController.js"; // Make sure path is correct


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const userRouter = express.Router();

// Auth & Profile Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);

// Appointment Routes
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// Stripe Payment Routes
userRouter.post("/create-checkout-session", authUser, createCheckoutSession);
userRouter.get("/verify-payment", verifyStripePayment);

// routes/userRoutes.js
userRouter.post("/submit-feedback", upload.single("serviceImage"), submitFeedback);




//userRouter.get('/appointments', fetchExistingAppointment);

userRouter.get("/appointments/:appointmentId", authUser, fetchAppointmentById);  // Add this line for appointment by ID

// In routes/userRoutes.js
userRouter.get("/approved-feedbacks", getApprovedFeedbacks);


// routes/userRoutes.js

userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment);  // Add route for rescheduling


userRouter.post("/reset-password", forgotPassword );  // Add route for rescheduling

// userRouter.get("/reminders", authUser, getAppointmentsForNextDay); // API route




export default userRouter;

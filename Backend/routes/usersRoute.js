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
  deleteHistory, // Delete a single appointment
  clearAllHistory,
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
console.log("🚀 User Router Initialized with Clear All History Route");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/delete-history", authUser, deleteHistory);
userRouter.post("/clear-all-history", authUser, clearAllHistory);

userRouter.post("/create-checkout-session", authUser, createCheckoutSession);
userRouter.get("/verify-payment", verifyStripePayment);


userRouter.post("/submit-feedback", upload.single("serviceImage"), authUser, submitFeedback);



userRouter.get("/appointments/:appointmentId", authUser, fetchAppointmentById);

userRouter.get("/approved-feedbacks", getApprovedFeedbacks);


userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment);


userRouter.post("/reset-password", forgotPassword);






export default userRouter;

import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import businessModel from "../models/businessModel.js";
import appointmentModel from "../models/appointmentModel.js";
import FeedbackModel from "../models/FeedbackModel.js";
import moment from "moment";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const createCheckoutSession = async (req, res) => {
  const { appointmentId, payment_type = "deposit" } = req.body; // default to deposit

  try {
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Missing appointmentId" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const { amount, depositAmount, businessData, userId } = appointment;

    // Choose which amount to charge
    let chargingAmount;
    let productName;
    if (payment_type === "full") {
      chargingAmount = amount - depositAmount;
      productName = `Final Payment - ${businessData.service_name}`;
    } else {
      chargingAmount = depositAmount;
      productName = `Booking Deposit - ${businessData.service_name}`;
    }

    const amountInCents = Math.round(chargingAmount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: `Total price was $${amount}. Deposit paid was $${depositAmount}.`
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}&payment_type=${payment_type}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        appointmentId,
        userId,
        paymentType: payment_type
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);

export const verifyStripePayment = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripeInstance.checkout.sessions.retrieve(session_id);
    const { staffId, userId, slotDate, slotTime, paymentType } = session.metadata;

    if (session && session.payment_status === "paid") {

      // 1. Check if appointment already exists (prevent duplicates if user refreshes)
      let appointment = await appointmentModel.findOne({
        staffId,
        slotDate: new Date(`${slotDate}T00:00:00.000Z`),
        slotTime
      });

      if (!appointment) {
        // 2. FETCH DATA REQUIRED FOR RECORDING
        const userData = await userModel.findById(userId).select("-password");
        const businessData = await businessModel.findById(staffId).select("-password -slots_booked");

        // 3. CREATE THE RECORD FOR THE FIRST TIME
        const appointmentData = {
          userId,
          staffId,
          userData,
          businessData,
          amount: Number(session.metadata.amount),
          depositAmount: Number(session.metadata.depositAmount),
          slotTime,
          slotDate: new Date(`${slotDate}T00:00:00.000Z`),
          date: Date.now(),
          bookingFeePaid: true,
          isPaidInFull: paymentType === "full",
        };

        appointment = new appointmentModel(appointmentData);
        await appointment.save();
        console.log("📝 Appointment record created after payment:", appointment._id);
      } else {
        // 4. If it's a follow-up payment (full balance), just update the flags
        if (paymentType === "full") {
          appointment.isPaidInFull = true;
          await appointment.save();
        }
      }

      return res.json({ success: true, message: "Payment verified and appointment confirmed." });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed." });
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error.message);
    return res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address." });
    }

    // 3. Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and include uppercase, lowercase, and a number.",
      });
    }

    // 4. Check if user already exists
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // ✅ 5. Create new user (DON’T manually hash password here)
    const newUser = new userModel({ name, email, password });

    // ✅ 6. Save user (hashing happens in pre-save middleware)
    const user = await newUser.save();

    // 7. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const parsedAddress = JSON.parse(address);
    if (!parsedAddress.line1 || !parsedAddress.line1.trim()) {
      return res.json({ success: false, message: "Address is mandatory" });
    }

    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      return res.json({
        success: false,
        message: "Name must start with a capital letter and contain only letters and spaces",
      });
    }

    const phoneRegex = /^(\+?\d{8,15})$/;
    if (!phoneRegex.test(phone)) {
      return res.json({
        success: false,
        message: "Phone number must be 8–15 digits and can start with '+'",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: address ? JSON.parse(address) : undefined,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, staffId, slotDate, slotTime } = req.body;

    const businessData = await businessModel
      .findById(staffId)
      .select("-password");
    if (!businessData.available) {
      return res.json({ success: false, message: "Staff is not available" });
    }

    let slots_booked = businessData.slots_booked || {};

    const getDateKey = (dateStr) => {
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    };

    const dateKey = getDateKey(slotDate);

    if (slots_booked[dateKey]) {
      if (slots_booked[dateKey].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available",
        });
      } else {
        slots_booked[dateKey].push(slotTime);
      }
    } else {
      slots_booked[dateKey] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");
    delete businessData.slots_booked;

    const depositAmount = businessData.bookingFee || 0;
    const totalAmount = businessData.fees || 0;

    // A: IF BOTH FEES ARE 0 -> Error (User doesn't want free bookings)
    if (depositAmount === 0 && totalAmount === 0) {
      return res.json({ success: false, message: "A fee must be set for this service. Please contact admin." });
    }

    // B: IF NO DEPOSIT REQUIRED -> Lock slot and redirect to pay FULL AMOUNT
    await businessModel.findByIdAndUpdate(staffId, { slots_booked });

    // Determine what we are charging now
    const isFullPayment = depositAmount === 0;
    const amountToCharge = isFullPayment ? totalAmount : depositAmount;
    const paymentType = isFullPayment ? "full" : "deposit";

    const amountInCents = Math.round(amountToCharge * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AuraTime - ${businessData.service_name}`,
              description: isFullPayment
                ? `Full payment for ${businessData.service_name}.`
                : `Initial booking fee for ${businessData.service_name}. Total price: $${totalAmount}`
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&payment_type=${paymentType}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        staffId,
        userId,
        slotDate,
        slotTime,
        amount: totalAmount.toString(),
        depositAmount: depositAmount.toString(),
        paymentType: paymentType
      },
    });

    // Automated cleanup: If not paid within 10 minutes, release the locked slot
    setTimeout(async () => {
      try {
        const checkApp = await appointmentModel.findOne({
          staffId,
          slotDate: new Date(`${slotDate}T00:00:00.000Z`),
          slotTime
        });

        if (!checkApp) {
          console.log("⏰ 10m Cleanup: Unpaid checkout detected. Releasing slot:", slotDate, slotTime);
          const busData = await businessModel.findById(staffId);
          if (busData) {
            let sb = busData.slots_booked || {};
            if (sb[dateKey]) {
              sb[dateKey] = sb[dateKey].filter(e => e !== slotTime);
              await businessModel.findByIdAndUpdate(staffId, { slots_booked: sb });
            }
          }
        }
      } catch (err) {
        console.error("Slot cleanup error:", err);
      }
    }, 10 * 60 * 1000);

    res.json({ success: true, message: "Redirecting to payment...", url: session.url });

  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: "Slot already taken by someone else!" });
    }
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  const { appointmentId, slotDate, slotTime } = req.body; // Expect slotDate and slotTime instead of newSlotDate and newSlotTime

  try {
    const appointment = await appointmentModel.findById(appointmentId); // Fetch the appointment by its ID

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const isAvailable = await checkSlotAvailability(
      appointment.staffId,
      slotDate,
      slotTime,
    );
    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "The selected slot is unavailable" });
    }

    // Release old slot and book new slot in businessModel
    const businessData = await businessModel.findById(appointment.staffId);
    if (businessData) {
      let sb = businessData.slots_booked || {};

      // Release old slot
      const oldDateKey = appointment.slotDate.toISOString().split("T")[0];
      if (sb[oldDateKey]) {
        sb[oldDateKey] = sb[oldDateKey].filter(time => time !== appointment.slotTime);
      }

      // Book new slot
      const newDateKey = new Date(slotDate).toISOString().split("T")[0];
      if (sb[newDateKey]) {
        sb[newDateKey].push(slotTime);
      } else {
        sb[newDateKey] = [slotTime];
      }

      await businessModel.findByIdAndUpdate(appointment.staffId, { slots_booked: sb });
    }

    appointment.slotDate = new Date(slotDate);
    appointment.slotTime = slotTime;

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "The selected slot is already taken!" });
    }
    console.error("Error rescheduling appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reschedule appointment" });
  }
};

const checkSlotAvailability = async (staffId, slotDate, slotTime) => {
  const existing = await appointmentModel.findOne({
    staffId,
    slotDate: new Date(slotDate),
    slotTime,
  });

  return !existing; // Slot is available if there's NO existing appointment
};

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    if (!appointments) {
      return res.json({ success: false, message: "No Appointment" });
    }

    res.json({ success: true, appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { name, email, appointmentId, feedback, slotDate, slotTime, rating } =
      req.body;

    let imageUrl = "";

    // Upload image if available
    if (req.file && req.file.path) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // Validate required fields
    if (
      !name ||
      !email ||
      !appointmentId ||
      !feedback ||
      !slotDate ||
      !slotTime ||
      !rating
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate name starts with capital letter
    if (!/^[A-Z]/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must start with a capital letter",
      });
    }

    // Find the appointment
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("staffId");

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Create and save feedback
    const newFeedback = new FeedbackModel({
      name,
      email,
      appointmentId,
      feedback,
      slotDate: new Date(slotDate),
      slotTime,
      rating,
      image: imageUrl,
      therapistName: appointment.businessData?.staffName || "",
      serviceName: appointment.businessData?.service_name || "",
    });

    await newFeedback.save();

    res
      .status(201)
      .json({ success: true, message: "Feedback submitted successfully." });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    // Step 1: Find the appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Step 2: Check if user owns the appointment
    if (appointmentData.userId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    // Step 3: Cancel the appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Step 4: Release staff slot
    const { staffId, slotDate, slotTime } = appointmentData;
    const businessData = await businessModel.findById(staffId);

    if (!businessData) {
      return res
        .status(404)
        .json({ success: false, message: "Business (staff) not found" });
    }

    let slots_booked = businessData.slots_booked || {};
    const dateKey = slotDate.toISOString().split("T")[0];

    // If date or time is not in the slots_booked, do nothing safely
    if (slots_booked[dateKey]) {
      slots_booked[dateKey] = slots_booked[dateKey].filter(
        (e) => e !== slotTime,
      );
    }

    await businessModel.findByIdAndUpdate(staffId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchExistingAppointment = async (req, res) => {
  try {
    const { staffId } = req.query;
    const { token } = req.headers;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const appointment = await appointmentModel
      .findOne({
        userId: userId,
        staffId: staffId,
      })
      .populate("staffId");

    if (!appointment) {
      return res.json({ success: false, message: "No appointment found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching existing appointment:", error);
    res.json({ success: false, message: "Failed to fetch appointment" });
  }
};

const fetchAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    console.log(`Looking for appointment with ID: ${appointmentId}`);

    // Fetch the appointment from the database, ensuring it is completed
    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Completed appointment not found" });
    }

    // Return the appointment details
    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch appointment" });
  }
};

// Function to fetch appointments for the next day
// Function to fetch appointments for the next day
const getAppointmentsForNextDay = async (req, res) => {
  try {
    // Get the next day's start and end date in the format "DD_MM_YYYY"
    const nextDayStart = moment()
      .add(1, "days")
      .startOf("day")
      .format("D_M_YYYY"); // Next day's start
    const nextDayEnd = moment().add(1, "days").endOf("day").format("D_M_YYYY"); // Next day's end

    // Fetch appointments scheduled for the next day
    const appointments = await appointmentModel.find({
      slotDate: { $gte: nextDayStart, $lte: nextDayEnd },
      isCompleted: false, // Ensure only incomplete appointments are shown
    });

    return res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email: rawEmail, newPassword } = req.body;
  const email = rawEmail.toLowerCase();

  try {
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const getApprovedFeedbacks = async (req, res) => {
  try {
    const approvedFeedbacks = await FeedbackModel.find({
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.status(200).json(approvedFeedbacks);
  } catch (error) {
    console.error("Error fetching approved feedbacks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  submitFeedback,
  fetchExistingAppointment,
  fetchAppointmentById,
  rescheduleAppointment,
  getAppointmentsForNextDay,
  forgotPassword,
  getApprovedFeedbacks,
};

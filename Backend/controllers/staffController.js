import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import AdminModel from "../models/AdminModel.js"; // since staff is in AdminModel
import businessModel from "../models/businessModel.js"; // since staff is in AdminModel
import userModel from "../models/userModel.js"; // since staff is in AdminModel
import FeedbackModel from "../models/FeedbackModel.js";
import ProfessionalStaffModel from "../models/ProfessionalStaffModel.js";
import moment from 'moment';

import nodemailer from "nodemailer";





const changeAvailability = async (req, res) => {
  try {
    const { staffId } = req.body;
    const businessData = await businessModel.findById(staffId);

    if (!businessData) {
      res.json({ success: false, message: "Staff not found" });
    }

    await businessModel.findByIdAndUpdate(staffId, {
      available: !businessData.available,
    });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};






const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.body; // Get the staffId from the request body

    const businessData = await businessModel.findById(staffId); // Find the staff by ID

    if (!businessData) {
      return res.json({ success: false, message: "Staff not found" }); // Return error if staff doesn't exist
    }

    // Delete the staff member from the database
    await businessModel.findByIdAndDelete(staffId);

    res.json({ success: true, message: "Staff deleted successfully" }); // Success message
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message }); // Return error message if there's an issue
  }
};





// Count staff from Admins
const getStaffCount = async (req, res, next) => {
  try {
    const count = await AdminModel.countDocuments({ role: "staff" });
    res.status(200).json({ success: true, staffCount: count });
  } catch (error) {
    next(error); // passes to your global error handler
  }
};



//fetch all business service data
const getStaffBusiness = async (req, res) => {
  try {
    const staff = req.staff;

    const profile = await AdminModel.findById(staff._id).select("name email role");
    const businesses = await businessModel.find({ admin_staff_email: staff.email }); // <- changed

    if (!businesses || businesses.length === 0) {
      return res.json({ success: false, message: "No business profiles found." });
    }

    res.json({
      success: true,
      profileData: {
        ...profile.toObject(),
      },
      businessData: businesses, // return all matched records

    });

  } catch (error) {
    console.error("Get Staff Business Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







//Update business from staff

const updateStaffBusiness = async (req, res) => {
  try {
    const { businessId, address, fees, available } = req.body;

    const business = await businessModel.findOne({ _id: businessId });

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    // Optional: Verify this business belongs to the currently logged-in email
    // if (business.admin_staff_email !== req.body.staffEmail) return res.status(403).json({ ... });

    if (address) {
      business.address.line1 = address.line1 ?? business.address.line1;
      business.address.line2 = address.line2 ?? business.address.line2;
    }
    if (fees !== undefined) business.fees = fees;
    if (available !== undefined) business.available = available;

    await business.save();

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Staff Business Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





// Api for get all staffs list
const allStaffs = async (req, res) => {
  try {
    const staffs = await businessModel.find({}).select("-password");
    res.json({ success: true, staffs });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};







const allBookedSolts = async (req, res) => {
  const { slotDate } = req.query;

  if (!slotDate) {
    return res.status(400).json({ success: false, message: "slotDate is required." });
  }

  try {
    const date = new Date(slotDate); // e.g., '2025-07-15'

    // Create time range for the entire day
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const appointments = await appointmentModel.find({
      slotDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const bookedTimes = appointments.map((appointment) => appointment.slotTime);

    res.json({ success: true, bookedTimes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};











const staffList = async (req, res) => {
  try {
    const staffs = await businessModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, staffs });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};



// API for staff login

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find staff by email and ensure the role is 'staff'
    const staff = await AdminModel.findOne({ email, role: "staff" });

    if (!staff) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Staff login error:", error);
    res.json({ success: false, message: error.message });
  }
};




//API to get staff appointments for staff panel

// API to get all appointments for staff panel
const appointmentsStaff = async (req, res) => {
  try {
    // Find all appointments
    const appointments = await appointmentModel.find();

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("error:", error);
    res.json({ success: false, message: error.message });
  }
};








const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // ✅ Check if the appointment is cancelled
    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Cannot complete a cancelled appointment",
      });
    }

    // ✅ Check if a staff is assigned
    if (!appointmentData.staffName) {
      return res.status(400).json({
        success: false,
        message: "Please assign a therapist before completing the appointment",
      });
    }

    // ✅ Check if today is the appointment date
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const appointmentDate = new Date(appointmentData.slotDate).toISOString().split("T")[0];

    if (today !== appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "You can only complete the appointment on its scheduled day",
      });
    }

    // ✅ Mark the appointment as completed
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment Completed" });

  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








// API to mark appointment cancle for staff panel
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log("appointmentId:", appointmentId);

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointmentData.cancelled = true;
    await appointmentData.save();

    return res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




// API to get dashboard data for staff panel
const staffDashboard = async (req, res) => {
  try {
    const staffs = await businessModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      staffs: staffs.length,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};




// API to get staff profile for staff panel
const staffProfile = async (req, res) => {
  try {
    // Get staff data from middleware
    const staffId = req.staff._id;

    // Fetch profile data from DB, excluding password
    const profileData = await AdminModel.findById(staffId).select("-password");

    // Check if staff is found
    if (!profileData) {
      return res.json({ success: false, message: "Staff not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};


// GET all feedbacks

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find()
    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve feedbacks",
    });
  }
};




const updateStaffProfile = async (req, res) => {
  try {
    const { staffId, fees, address, available } = req.body;
    await businessModel.findByIdAndUpdate(staffId, {
      fees,
      address,
      available,
    });
    res.json({ success: true, message: "profile Updated" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};




const manualBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerContact,
      email, // ✅ Optional, but must be valid if present
      slotDate,
      slotTime,
      serviceName,
      amount,
      image // ✅ Service image
    } = req.body;

    // ====== Field Validations ======

    if (!customerName || !customerContact || !slotDate || !slotTime || !serviceName || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except email.",
      });
    }

    // Name must start with a capital letter
    if (!/^[A-Z][a-zA-Z\s]*$/.test(customerName)) {
      return res.status(400).json({
        success: false,
        message: "Name must start with a capital letter and contain only letters.",
      });
    }

    // Contact number: 8-15 digits, can start with +
    if (!/^(\+?\d{8,15})$/.test(customerContact)) {
      return res.status(400).json({
        success: false,
        message: "Contact number must be 8–15 digits and can start with '+'.",
      });
    }

    // Email is optional, but must be valid if present
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    // ====== Check for existing appointment ======

    const existingAppointment = await appointmentModel.findOne({ slotDate, slotTime });
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked.",
      });
    }

    // ====== Create new appointment ======

    const defaultStaffId = "default_staff_id";

    const newAppointment = new appointmentModel({
      userId: customerContact,
      staffId: defaultStaffId,
      slotDate,
      slotTime,
      userData: {
        name: customerName,
        phone: customerContact,
        email: email || "",
        image: "data:image/png;base64,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" // leave hardcoded as-is
        // 🔒 Hardcoded image
      },
      businessData: {
        service_name: serviceName,
        fees: amount,
        image: image || "", // ✅ Optional service image
      },
      staffName: "",
      amount,
      date: Date.now(),
      cancelled: false,
      payment: false,
      isCompleted: false,
    });

    await newAppointment.save();

    res.status(200).json({ success: true, message: 'Appointment booked successfully' });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later',
    });
  }
};






const getAllProfessionalStaff = async (req, res) => {
  try {
    // Find all professional staff in the collection, selecting only 'name' and 'email' fields
    const professionalStaff = await ProfessionalStaffModel.find().select("name email");

    if (professionalStaff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No professional staff found.",
      });
    }

    res.status(200).json({
      success: true,
      staff: professionalStaff, // Return both name and email fields
    });
  } catch (error) {
    console.error("Error fetching professional staff:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching professional staff.",
    });
  }
};







const updateStaffForAppointment = async (req, res) => {
  try {
    const { appointmentId, staffId } = req.body;

    // 1. Ensure the appointment exists
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // 2. Ensure the staff exists
    const staff = await ProfessionalStaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    // 3. Check if the staff is already assigned at the same date and time
    const alreadyAssigned = await appointmentModel.findOne({
      staffId: staffId, // ✅ Match on the correct field
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
      _id: { $ne: appointmentId }
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Staff is already booked at this time. Please choose another."
      });
    }

    // 4. Assign both ID and name properly
    appointment.staffId = staff._id;           // Save ID
    appointment.staffName = staff.name;        // Save readable name

    await appointment.save();

    return res.json({ success: true, message: "Staff updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};





// Fetch appointments for the next day
const getAppointmentsForNextDay = async (_req, res) => {
  try {
    console.log("Fetching appointments for the next day...");

    const nextDayStart = moment().add(1, 'days').startOf('day').toDate();
    const nextDayEnd = moment().add(1, 'days').endOf('day').toDate();

    const appointments = await appointmentModel.find({
      slotDate: { $gte: nextDayStart, $lte: nextDayEnd },
      isCompleted: false,
      cancelled: false,
    });

    return res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};





// Endpoint for staff to trigger the reminder
const sendReminder = async (req, res) => {
  const { appointmentId } = req.body; // Get the appointment ID

  try {
    // Find the appointment by ID
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Predefined message to send to the customer
    const reminderMessage = `Hello! This is a reminder for your appointment tomorrow at ${appointment.slotTime}.`;

    // Add the reminder to the appointment's data
    appointment.reminderMessage = reminderMessage;
    await appointment.save(); // Save the reminder in the database

    return res.status(200).json({ success: true, message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return res.status(500).json({ success: false, message: "Failed to send reminder" });
  }
};








const getNextDayAppointments = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Start and end of tomorrow
    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    const appointments = await appointmentModel.find({
      slotDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    return res.json({ success: true, nextdayappointments: appointments });

  } catch (error) {
    console.error("Error fetching next day appointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// Controller to send reminder emails to customers
const sendReminderEmails = async (req, res) => {
  try {
    const { nextdayappointments: appointments } = req.body; // The appointments to send reminders for

    // Set up the email transport using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gabriellamuloshi@gmail.com", // Replace with your email
        pass: "xlnxakwejkoeqrzk",  // Replace with your email password (or better use OAuth)
      },
    });

    // Loop through each appointment and send an email reminder
    for (const appointment of appointments) {
      const { email } = appointment.userData; // Assuming 'userData' contains email

      const mailOptions = {
        from: "gabriellamuloshi@gmail.com",
        to: email,
        subject: "Appointment Reminder",
        text: `Hello ${appointment.userData.name},

This is a friendly reminder that you have an appointment for **${appointment.businessData.service_name}** scheduled for **tomorrow at ${appointment.slotTime}**.

Please ensure to arrive a few minutes early for a smooth experience.

We look forward to seeing you!

Warm regards,  
Glow & Radiance Spa  
*Powered by Aura Time*`

      };

      // Send email
      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: "Reminders sent successfully.",
    });
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    res.status(500).json({ success: false, message: "Error sending reminder emails." });
  }
};





const getAppointmentsByDate = async (req, res) => {
  try {
    const { slotDate } = req.body; // Expect format "YYYY-MM-DD"

    if (!slotDate) {
      return res.status(400).json({
        success: false,
        message: "Date is required in format YYYY-MM-DD",
      });
    }

    // Build UTC range
    const selectedDate = new Date(`${slotDate}T00:00:00.000Z`);
    const nextDate = new Date(selectedDate);
    nextDate.setUTCDate(selectedDate.getUTCDate() + 1);

    const appointments = await appointmentModel.find({
      slotDate: { $gte: selectedDate, $lt: nextDate },
    });

    res.json({
      success: true,
      message: appointments.length ? "Appointments found" : "No appointments",
      appointments,
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



const getAvailableStaff = async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and time are required" });
    }

    // Step 1: Get staff names already booked at that date/time
    const queryDate = new Date(date);

    const bookedAppointments = await appointmentModel.find({
      slotDate: queryDate,
      slotTime: time,
      cancelled: false
    });

    const bookedStaffNames = bookedAppointments
      .map(app => app.staffName)
      .filter(name => !!name); // Filter out null/undefined

    // Step 2: Get available staff (name NOT in booked list)
    const availableStaff = await ProfessionalStaffModel.find({
      name: { $nin: bookedStaffNames }
    });

    return res.json({ success: true, staff: availableStaff });
  } catch (error) {
    console.error("Error getting available staff:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




export {
  changeAvailability,
  staffList,
  staffLogin,
  appointmentsStaff,
  appointmentComplete,
  appointmentCancel,
  staffDashboard,
  staffProfile,
  updateStaffProfile,
  getStaffBusiness,
  updateStaffBusiness,
  getAllFeedbacks,
  getStaffCount,
  deleteStaff,
  allStaffs,
  manualBooking,
  allBookedSolts,
  getAllProfessionalStaff,
  sendReminder,
  getAppointmentsForNextDay,
  updateStaffForAppointment,
  getNextDayAppointments,
  sendReminderEmails,
  getAppointmentsByDate,
  getAvailableStaff

};

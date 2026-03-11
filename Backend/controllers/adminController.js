import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import businessModel from "../models/businessModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

import FeedbackModel from "../models/FeedbackModel.js";
import AdminModel from "../models/AdminModel.js";
import ProfessionalStaffModel from "../models/ProfessionalStaffModel.js";



const registerStaff = async (req, res) => {
  try {
    const { name, email: rawEmail, password, role } = req.body;
    const email = rawEmail.toLowerCase();
    // Check for missing fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Email must contain '@'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Password must be at least 6 characters, contain 1 capital letter and 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include one capital letter and one special character.",
      });
    }

    // Check if email already exists
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};





const registerProfessionalStaff = async (req, res) => {
  try {
    const { name, email } = req.body;

    // ==== VALIDATIONS ====

    if (!name || !/^[A-Z]/.test(name)) {
      return res.status(400).json({ success: false, message: "Name must start with a capital letter." });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Email must be valid and contain '@'." });
    }

    const existingStaff = await ProfessionalStaffModel.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ success: false, message: "Therapist with this email already exists." });
    }



    // ✅ Create staff member
    const newStaff = new ProfessionalStaffModel({
      name,
      email,

    });

    await newStaff.save();

    res.status(201).json({
      success: true,
      message: "Professional staff registered successfully.",
      staff: newStaff,
    });

  } catch (error) {
    console.error("Error registering professional staff:", error);
    res.status(500).json({ success: false, message: "Failed to register professional staff." });
  }
};






const getStaffCount = async (req, res, next) => {
  try {
    const count = await AdminModel.countDocuments({ role: "staff" });
    res.status(200).json({ success: true, staffCount: count });
  } catch (error) {
    next(error);
  }
};





const getAppointmentsByDate = async (req, res) => {
  try {
    const { slotDate } = req.body;

    if (!slotDate) {
      return res.status(400).json({
        success: false,
        message: "Date is required in format YYYY-MM-DD",
      });
    }


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





const getAllProfessionalStaff = async (req, res) => {
  try {
    const professionalStaff = await ProfessionalStaffModel.find().select("name email");

    if (professionalStaff.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No professional staff found.",
      });
    }

    res.status(200).json({
      success: true,
      staff: professionalStaff,
    });
  } catch (error) {
    console.error("Error fetching professional staff:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching professional staff.",
    });
  }
};



const addBusiness = async (req, res) => {
  try {
    const {
      service_name,
      speciality,
      about,
      fees,
      bookingFee,
      serviceDuration,
    } = req.body;
    const imageFile = req.file;
    // Debugging logs
    console.log("📝 Add Service Attempt:", {
      service_name,
      speciality,
      about,
      fees,
      bookingFee,
      serviceDuration,
      hasImage: !!imageFile
    });

    if (!service_name) return res.status(400).json({ success: false, message: "Missing Service Name" });
    if (!speciality) return res.status(400).json({ success: false, message: "Missing Speciality" });
    if (!about) return res.status(400).json({ success: false, message: "Missing Description (About)" });
    if (fees === undefined || fees === "") return res.status(400).json({ success: false, message: "Missing Total Fees" });
    if (bookingFee === undefined || bookingFee === "") return res.status(400).json({ success: false, message: "Missing Booking Fee" });
    if (!serviceDuration) return res.status(400).json({ success: false, message: "Missing Service Duration" });
    if (!imageFile) return res.status(400).json({ success: false, message: "Missing Service Image" });

    // === Validate that service_name starts with a capital letter ===
    if (!/^[A-Z]/.test(service_name)) {
      return res.status(400).json({
        success: false,
        message: "Service name must start with a capital letter.",
      });
    }


    if (isNaN(serviceDuration) || isNaN(fees) || isNaN(bookingFee)) {
      return res.status(400).json({
        success: false,
        message: "Numerical fields (Duration, Fees, Booking Fee) must be valid numbers.",
      });
    }


    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    // === Prepare business data ===
    const businessData = {
      service_name,
      image: imageUrl,
      speciality,
      about,
      fees: Number(fees),
      bookingFee: Number(bookingFee),
      serviceDuration: Number(serviceDuration),
      date: Date.now(),
    };

    // === Save to MongoDB ===
    const newBusiness = new businessModel(businessData);
    await newBusiness.save();

    res.json({
      success: true,
      message: "Service added successfully",
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







const toggleFeedbackApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    feedback.isApproved = !feedback.isApproved;
    await feedback.save();

    res.status(200).json({ success: true, isApproved: feedback.isApproved });
  } catch (error) {
    console.error("Toggle approval error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





const loginAdmin = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const admin = await AdminModel.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: admin.role,
    });
  } catch (error) {
    console.log("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};





const allStaffs = async (req, res) => {
  try {
    const staffs = await businessModel.find({}).select("-password");
    res.json({ success: true, staffs });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};





const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};




const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });


    const { staffId, slotDate, slotTime } = appointmentData;

    const businessData = await businessModel.findById(staffId);
    let slots_booked = businessData.slots_booked || {};


    if (Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    } else {
      console.warn(`No slots booked for date: ${slotDate}`);
    }

    await businessModel.findByIdAndUpdate(staffId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log("error:", error);
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


    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Cannot complete a cancelled appointment",
      });
    }


    if (!appointmentData.staffName) {
      return res.status(400).json({
        success: false,
        message: "Please assign a therapist before completing the appointment",
      });
    }


    const today = new Date().toISOString().split("T")[0];
    const appointmentDate = new Date(appointmentData.slotDate).toISOString().split("T")[0];

    if (today !== appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "You can only complete the appointment on its scheduled day",
      });
    }


    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment Completed" });

  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find();

    console.log('Fetched feedbacks:', feedbacks);

    res.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};









const updateStaffForAppointment = async (req, res) => {
  try {
    const { appointmentId, staffId } = req.body;


    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }


    const staff = await ProfessionalStaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }


    const alreadyAssigned = await appointmentModel.findOne({
      staffId: staffId,
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

    appointment.staffId = staff._id;
    appointment.staffName = staff.name;

    await appointment.save();

    return res.json({ success: true, message: "Staff updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};






export const getAvailableStaff = async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and time are required" });
    }

    // Convert string date to Date object for robust matching if needed, 
    // or just match as string if the database contains strings.
    // However, slotDate is a Date type in the schema.
    const queryDate = new Date(date);

    const bookedAppointments = await appointmentModel.find({
      slotDate: queryDate,
      slotTime: time,
      cancelled: false
    });

    const bookedStaffNames = bookedAppointments
      .map(app => app.staffName)
      .filter(name => !!name);

    const availableStaff = await ProfessionalStaffModel.find({
      name: { $nin: bookedStaffNames }
    });

    return res.json({ success: true, staff: availableStaff });
  } catch (error) {
    console.error("Error getting available Therapists:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};









const adminDashboard = async (req, res) => {
  try {
    const staffs = await businessModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      staffs: staffs.length,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }

};




const getAppointmentTrends = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const appointmentTrends = await appointmentModel.aggregate([
      {
        $match: {
          slotDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$slotDate" }
          },
          totalAppointments: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({ success: true, appointmentTrends });
  } catch (error) {
    console.error("Error fetching appointment trends:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






const getServicePopularity = async (req, res) => {
  try {
    const servicePopularity = await appointmentModel.aggregate([
      {
        $group: {
          _id: "$businessData.service_name",
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $sort: { totalAppointments: -1 },
      },
    ]);

    res.json({
      success: true,
      servicePopularity,
    });
  } catch (error) {
    console.error("Error fetching service popularity:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





const getRevenueTrends = async (req, res) => {
  try {
    const revenueTrends = await appointmentModel.aggregate([
      {
        $project: {
          slotDate: 1,
          collected: {
            $add: [
              { $cond: [{ $eq: ["$bookingFeePaid", true] }, "$depositAmount", 0] },
              { $cond: [{ $eq: ["$isPaidInFull", true] }, { $subtract: ["$amount", "$depositAmount"] }, 0] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$slotDate",
          totalRevenue: { $sum: "$collected" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      revenueTrends,
    });
  } catch (error) {
    console.error("Error fetching revenue trends:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};







const getCancellationTrends = async (req, res) => {
  try {
    const cancellationTrends = await appointmentModel.aggregate([
      {
        $match: { cancelled: true },
      },
      {
        $group: {
          _id: "$slotDate",
          totalCancellations: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("cancelled Trends:", cancellationTrends);

    res.json({
      success: true,
      cancellationTrends,
    });
  } catch (error) {
    console.error("Error fetching cancellation trends:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






const getAppointmentTypeTrends = async (req, res) => {
  try {
    const appointmentTypeTrends = await appointmentModel.aggregate([
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$isCompleted", true] }, "Completed", "Cancelled"]
          },
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      appointmentTypeTrends,
    });
  } catch (error) {
    console.error("Error fetching appointment type trends:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const getAllFrontStaff = async (req, res) => {
  try {
    const staff = await AdminModel.find();
    console.log("Fetched Front Staff: ", staff);
    res.status(200).json({
      success: true,
      frontstaff: staff,
    });
  } catch (error) {
    console.log("Error fetching all staff/admins:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching staff/admins",
    });
  }
};





const deleteFrontStaff = async (req, res) => {
  try {
    const { staffId } = req.body;


    const staff = await AdminModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }


    await AdminModel.findByIdAndDelete(staffId);
    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




const deleteProfessionalStaff = async (req, res) => {
  try {
    const { staffId } = req.body;


    const staff = await ProfessionalStaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }


    await ProfessionalStaffModel.findByIdAndDelete(staffId);
    res.json({ success: true, message: "Therapist deleted successfully" });
  } catch (error) {
    console.error("Error deleting therapist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};







const getReports = async (req, res) => {
  try {
    const appointments = await appointmentModel.find();

    const reportData = {
      serviceTrends: {},
      revenue: 0,
      cancellations: 0,
      completed: 0,
      totalAppointments: appointments.length,
      peakTimes: {},
      peakDays: {},
    };

    appointments.forEach(app => {

      const service = app.businessData.service_name || "Unknown";
      reportData.serviceTrends[service] = (reportData.serviceTrends[service] || 0) + 1;


      if (app.payment && !app.cancelled) {
        reportData.revenue += app.amount;
      }


      if (app.cancelled) reportData.cancellations += 1;
      if (app.isCompleted) reportData.completed += 1;


      reportData.peakTimes[app.slotTime] = (reportData.peakTimes[app.slotTime] || 0) + 1;


      const day = new Date(app.slotDate).toLocaleDateString("en-US", { weekday: "long" });
      reportData.peakDays[day] = (reportData.peakDays[day] || 0) + 1;
    });

    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate reports" });
  }
};





const generateAppointmentReports = async (req, res) => {
  try {
    const allAppointments = await appointmentModel.find();
    const allUsers = await userModel.find();


    const totalUsers = allUsers.length;


    const totalAppointments = allAppointments.length;


    const completedAppointments = allAppointments.filter(a => a.isCompleted).length;


    const cancelledAppointments = allAppointments.filter(a => a.cancelled).length;


    const paidAppointments = allAppointments.filter(a => a.payment).length;

    const totalEarnings = allAppointments.reduce((sum, a) => {
      return a.isCompleted ? sum + (a.amount || 0) : sum;
    }, 0);







    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log("Start of Week:", startOfWeek.toISOString());
    console.log("End of Week:", endOfWeek.toISOString());

    const appointmentsThisWeek = allAppointments.filter(a => {
      const date = new Date(new Date(a.slotDate).getTime() + 8 * 60 * 60 * 1000); // adjust for GMT+8 if needed
      console.log("Appointment Date:", date.toISOString());
      return date >= startOfWeek && date <= endOfWeek;
    }).length;






    const serviceCount = {};
    allAppointments.forEach(a => {
      const service = a.businessData?.service_name;
      if (service) {
        serviceCount[service] = (serviceCount[service] || 0) + 1;
      }
    });

    const mostBookedService = Object.entries(serviceCount).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ["None", 0]
    );


    const onlineBookings = new Set(
      allAppointments.filter(a => a.payment).map(a => a.user?._id?.toString())
    ).size;

    res.status(200).json({
      success: true,
      report: {
        totalUsers, // 👈 added
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        paidAppointments,
        totalEarnings,
        appointmentsThisWeek,
        mostBookedService: mostBookedService[0],
        mostBookedServiceCount: mostBookedService[1],
        onlineBookings,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate reports",
    });
  }
};



const getStaffProfileByName = async (req, res) => {
  try {
    const { staffName } = req.params;

    // Find the staff by name
    const staff = await ProfessionalStaffModel.findOne({ name: staffName });

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found." });
    }

    // Return only profile info (no schedule yet)
    res.json({
      success: true,
      staff: {
        name: staff.name,
        email: staff.email,
        image: staff.image,
        about: staff.about,
        specialty: staff.specialty || "Not specified",
      },
    });
  } catch (err) {
    console.error("Error fetching staff profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const gettherapist = async (req, res) => {
  try {
    const staffList = await ProfessionalStaffModel.find();
    res.json({ success: true, staff: staffList });
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




const getStaffAppointments = async (req, res) => {
  try {
    const staffAppointments = await appointmentModel.aggregate([
      {
        // Ignore unassigned appointments
        $match: {
          staffName: { $ne: "" }
        }
      },
      {
        // Group appointments by staffName
        $group: {
          _id: "$staffName",
          appointments: { $push: "$$ROOT" } // get the full appointment doc
        }
      },
      {
        // Rename _id to staffName for clarity
        $project: {
          _id: 0,
          staffName: "$_id",
          appointments: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: staffAppointments
    });

  } catch (error) {
    console.error("Error fetching staff appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch staff appointments.",
      error
    });
  }
};







const markAppointmentAsPaid = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (!appointment.staffName) {
      return res.status(400).json({
        success: false,
        message: "Please assign a therapist before completing the appointment",
      });
    }

    appointment.isPaidInFull = true;
    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment marked as paid in full (Cash) and Completed" });
  } catch (error) {
    console.error("Error marking as paid:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createAdminCheckoutSession = async (req, res) => {
  const { appointmentId, payment_type = "full" } = req.body;

  try {
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (!appointment.staffName) {
      return res.status(400).json({
        success: false,
        message: "Please assign a therapist before completing the appointment",
      });
    }

    // Mark as completed immediately as the admin is initiating the final payment link
    appointment.isCompleted = true;
    await appointment.save();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, depositAmount, businessData, userId } = appointment;

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
              description: `Admin initiated payment for ${appointment.userData.name}. Total: $${amount}.`
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}&payment_type=${payment_type}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        appointmentId: appointmentId,
        userId: userId ? userId.toString() : "",
        paymentType: payment_type
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Admin checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getStaffAppointments,
  gettherapist,
  // getStaffProfileByName,
  addBusiness,
  allStaffs,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  getAppointmentsByDate,
  getAllFeedbacks,
  registerStaff,
  loginAdmin,
  //getAllStaffUsers,
  getStaffCount,
  registerProfessionalStaff,
  getAllProfessionalStaff,
  appointmentComplete,
  updateStaffForAppointment,
  getAppointmentTrends,
  getServicePopularity,
  getRevenueTrends,
  getCancellationTrends,
  getAppointmentTypeTrends,
  getAllFrontStaff,
  deleteFrontStaff,
  deleteProfessionalStaff,
  toggleFeedbackApproval,
  getReports,
  generateAppointmentReports,
  markAppointmentAsPaid,
  createAdminCheckoutSession,
};

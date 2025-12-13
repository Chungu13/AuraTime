import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js"; // Adjust path if needed

const authStaff = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Verify token
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Find the staff user in DB (since adminModel holds both admin and staff)
    const staff = await AdminModel.findById(decoded.id);

    // Check if staff exists and has 'staff' role
    if (!staff || staff.role !== "staff") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Staff only.",
      });
    }

    // Attach staff to request
    req.staff = staff;

    next();
  } catch (error) {
    console.error("Staff Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authStaff;

import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js"; // Update the path if needed

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Look up the admin user in the database
    const admin = await AdminModel.findById(decoded.id);

    // Check if the user exists and is actually an admin
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Attach the admin to the request for use in controllers
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;

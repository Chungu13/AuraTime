import mongoose from "mongoose";

// Define the ProfessionalStaff schema
const ProfessionalStaffSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the therapist
  email: { type: String, required: true, unique: true }, // Email of the therapist (must be unique)
  
});

// Create the model based on the schema
const ProfessionalStaffModel = mongoose.model("ProfessionalStaff", ProfessionalStaffSchema);

export default ProfessionalStaffModel;

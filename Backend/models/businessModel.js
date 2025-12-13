import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    service_name: { type: String, required: true },
    // admin_staff_email: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: String, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    serviceDuration: { type: Number, required: true }, // Adding service duration field in minutes
  },
  { minimize: false }
);

// minify false allows to add empty object {} in schema

const businessModel =
  mongoose.models.business || mongoose.model("business", businessSchema);

export default businessModel;

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  staffId: { type: String, required: true },
  slotDate: { type: Date, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  businessData: { type: Object, required: true },
  staffName: { type: String, required: false, default: "" },  
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  reminderMessage: { type: String, default: "" },  // New field for reminder message
});

const appointmentModel =
  mongoose.model.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;

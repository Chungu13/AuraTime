import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  staffId: { type: String, required: true },
  slotDate: { type: Date, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  businessData: { type: Object, required: true },
  staffName: { type: String, required: false, default: "" },
  amount: { type: Number, required: true }, // Total full price
  depositAmount: { type: Number, required: true }, // Amount of booking fee
  bookingFeePaid: { type: Boolean, default: false }, // Status of the initial deposit
  isPaidInFull: { type: Boolean, default: false }, // Status of the final balance
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  reminderMessage: { type: String, default: "" },  // New field for reminder message
});

// ✅ ADDED: Unique compound index to prevent double bookings
// The partialFilterExpression ensures that if an appointment is cancelled, 
// the slot becomes available again for others to book.
appointmentSchema.index(
  { staffId: 1, slotDate: 1, slotTime: 1 },
  { unique: true, partialFilterExpression: { cancelled: false } }
);

const appointmentModel =
  mongoose.model.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;

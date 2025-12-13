import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    },
    feedback: { type: String, required: true },
    slotDate: { type: Date, required: true }, // Changed to Date type
    slotTime: { type: String , required: true}, // Optional slot time
    therapistName: { type: String },
    serviceName: { type: String },
    rating: { type: Number, min: 1, max: 5 }, // Star rating
    image: { type: String }, // Image URL or base64 string
    isApproved: { type: Boolean, default: false }, // 👈 NEW
  },
  { timestamps: true }
);

const FeedbackModel =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";
import axios from "axios";
import MoveUpOnRender from "../components/MoveUpOnRender";

const MyFeedback = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [serviceImage, setServiceImage] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        const completedAppointments = data.appointments.filter((a) => a.isCompleted);
        setAppointments(completedAppointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments.");
    }
  };

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateObj = new Date(slotDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStaff || !name || !email || !comment || !rating) {
      toast.error("Please fill in all fields and give a rating.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("appointmentId", selectedStaff._id);
    formData.append("feedback", comment);
    formData.append("slotDate", selectedStaff.slotDate);
    formData.append("slotTime", selectedStaff.slotTime);
    formData.append("therapistName", selectedStaff.businessData?.staffName);
    formData.append("rating", rating);
    if (serviceImage) formData.append("serviceImage", serviceImage);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/submit-feedback`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Feedback submitted successfully!");
        setSelectedStaff(null);
        setName("");
        setEmail("");
        setComment("");
        setServiceImage(null);
        setRating(0);
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">We value your feedback!</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about your experience with our service.</p>

      <MoveUpOnRender id="feedback-form">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-md w-full bg-gray-50"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-md w-full bg-gray-50"
            />
          </div>

          <select
            value={selectedStaff ? selectedStaff._id : ""}
            onChange={(e) =>
              setSelectedStaff(appointments.find((a) => a._id === e.target.value))
            }
            className="border p-3 rounded-md w-full bg-gray-50"
          >
            <option value="">Select Completed Appointment</option>
            {appointments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.businessData?.name} - {item.businessData?.speciality} |{" "}
                {slotDateFormat(item.slotDate)}
              </option>
            ))}
          </select>

          {selectedStaff && (
            <div className="flex items-center gap-4 p-3 bg-blue-50 border rounded-md">
              <img
                src={selectedStaff.businessData?.image}
                alt="Staff"
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{selectedStaff.businessData?.staffName}</p>
                <p className="text-sm text-gray-700">{selectedStaff.businessData?.speciality}</p>
                <p className="text-xs text-gray-500">
                  {slotDateFormat(selectedStaff.slotDate)} at {selectedStaff.slotTime}
                </p>
              </div>
            </div>
          )}

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                className={`text-2xl cursor-pointer ${num <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating} Star{rating !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Upload image */}
          <label className="text-sm text-gray-600">Upload a photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setServiceImage(e.target.files[0])}
            className="border p-2 rounded-md w-full bg-gray-50"
          />

          {/* Feedback Text */}
          <textarea
            rows="4"
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-3 rounded-md w-full bg-gray-50"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-beige hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Submit Feedback
          </button>
        </form>
      </MoveUpOnRender>
    </div>
  );
};

export default MyFeedback;

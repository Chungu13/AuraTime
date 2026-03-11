import { useEffect, useState } from "react";
import axios from "axios";
import MoveUpOnRender from "../components/MoveUpOnRender";

const Reviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchApprovedFeedbacks = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/approved-feedbacks`);
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching approved feedbacks:", error);
      }
    };

    fetchApprovedFeedbacks();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="w-full max-w-5xl px-4 py-8 mx-auto">
      <MoveUpOnRender id="customer-feedbacks">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">What Our Customers Say</h2>
          <span className="text-sm text-gray-500">Total Reviews: {feedbacks.length}</span>
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-semibold text-gray-900">{fb.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(fb.slotDate)}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Rating:</span>{" "}
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < fb.rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}{" "}
                    <span className="ml-1 text-gray-500">({fb.rating || "N/A"})</span>
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Service:</span> {fb.serviceName || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Therapist:</span> {fb.therapistName || "N/A"}
                </p>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Time:</span> {fb.slotTime || "N/A"}
                </p>

                {fb.image && (
                  <div className="my-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Uploaded Image:</p>
                    <img
                      src={fb.image}
                      alt="Feedback Visual"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">Feedback:</span> {fb.feedback}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-lg"> No reviews available yet.</p>
          </div>
        )}
      </MoveUpOnRender>
    </div>
  );
};

export default Reviews;

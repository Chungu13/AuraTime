import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import axios from "axios";
import { toast } from "react-toastify"; 

const Feedbacks = () => {
  const { aToken, getAllFeedbacks } = useContext(AdminContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (aToken) {
        try {
          const data = await getAllFeedbacks();
          if (data && Array.isArray(data)) {
            const sorted = data.sort(
              (a, b) => new Date(b.slotDate) - new Date(a.slotDate)
            );
            setFeedbacks(sorted);
          } else {
            console.error("Invalid feedbacks data", data);
          }
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
        }
      }
    };
    fetchFeedbacks();
  }, [aToken]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleApprovalToggle = async (id) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/feedback/approve/${id}`,
        {},
        {
          headers: {
            token: aToken,
          },
        }
      );
      const updatedStatus = res.data.isApproved;

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === id ? { ...fb, isApproved: updatedStatus } : fb
        )
      );

      // ✅ Show success toast
      toast.success(
        updatedStatus ? "Feedback approved" : "Feedback unapproved"
      );
    } catch (err) {
      console.error("Failed to toggle approval:", err);
      toast.error("Failed to update approval status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl m-5 mx-auto">
      <MoveUpOnRender id="admin-feedbacks">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xl font-semibold">All Feedback</p>
          <p className="text-sm text-gray-500">Total: {feedbacks.length}</p>
        </div>

        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-black">{fb.name || "Anonymous"}</p>
                  <p className="text-sm text-black">{formatDate(fb.slotDate)}</p>
                </div>

                <p className="text-sm text-black mb-1">
                  <span className="font-medium">Rating:</span>{" "}
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < fb.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}{" "}
                  ({fb.rating || "N/A"})
                </p>

                <p className="text-sm text-black mb-1">
                  <span className="font-medium">Email:</span> {fb.email || "N/A"}
                </p>

                <p className="text-sm text-black mb-1">
                  <span className="font-medium">Service:</span> {fb.serviceName || "N/A"}
                </p>

                <p className="text-sm text-black mb-1">
                  <span className="font-medium">Therapist:</span> {fb.therapistName || "N/A"}
                </p>

                <p className="text-sm text-black mb-1">
                  <span className="font-medium">Time:</span> {fb.slotTime || "N/A"}
                </p>

                {fb.image && (
                  <div className="mt-2">
                    <p className="text-sm text-black font-medium mb-1">Image:</p>
                    <img
                      src={fb.image}
                      alt="Feedback Image"
                      className="w-32 h-32 object-cover border rounded"
                    />
                  </div>
                )}

                <p className="text-sm text-black mt-3">
                  <span className="font-medium">Feedback:</span>{" "}
                  {fb.feedback || "No feedback provided."}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={fb.isApproved}
                    onChange={() => handleApprovalToggle(fb._id)}
                    disabled={updatingId === fb._id}
                    className="cursor-pointer disabled:opacity-50"
                  />
                  <label className="text-sm text-black">Approved</label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No feedbacks found.</p>
        )}
      </MoveUpOnRender>
    </div>
  );
};

export default Feedbacks;

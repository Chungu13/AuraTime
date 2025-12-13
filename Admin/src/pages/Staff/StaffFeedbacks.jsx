import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import { assets } from "../../assets/assets";

const StaffFeedbacks = () => {
  const { dToken, getAllFeedbacks } = useContext(StaffContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (dToken) {
        const data = await getAllFeedbacks();
        setFeedbacks(data || []);
      }
    };
    fetchFeedbacks();
  }, [dToken]);

  return (
    <div className="w-full max-w-7xl m-5">
      <MoveUpOnRender id="admin-feedbacks">
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-medium">All Staff Feedbacks</p>
          <p className="text-sm text-gray-500">Total: {feedbacks.length}</p>
        </div>

        <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
          <div className="hidden sm:grid grid-cols-[1fr_2fr_2fr_2fr_1fr_3fr] items-center py-3 px-6 border-b font-medium text-gray-700 bg-gray-50">
            <p>#</p>
            <p>User Name</p>
            <p>Email</p>
            <p>Date</p>
            <p>Staff</p>
            <p>Feedback</p>
          </div>

          {feedbacks.length > 0 ? (
            feedbacks.map((fb, index) => (
              <div
                key={fb._id}
                className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[1fr_2fr_2fr_2fr_1fr_3fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p className="max-sm:hidden">{index + 1}</p>
                <p>{fb.name}</p>
                <p>{fb.email}</p>
                <p>{fb.slotDate?.replace(/_/g, "/")}</p>
                <p>{fb.staffName}</p>
                <p>{fb.feedback}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No feedbacks found.
            </p>
          )}
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default StaffFeedbacks;

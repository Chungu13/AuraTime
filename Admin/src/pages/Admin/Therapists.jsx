import { useEffect, useState } from "react";
import axios from "axios";

const Therapists = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/all-staff`);
        if (res.data.success) {
          setStaffList(res.data.staff);
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading therapists...</p>;

  return (
    <div className="therapists-page p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">All Therapists</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {staffList.map((staff) => (
          <div
            key={staff._id}
            className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={staff.image}
              alt={staff.name}
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border"
            />
            <h4 className="text-lg font-medium text-gray-800">{staff.name}</h4>
            <p className="text-sm text-gray-600">{staff.email}</p>
            <p className="text-sm text-gray-500 mt-2">{staff.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Therapists;

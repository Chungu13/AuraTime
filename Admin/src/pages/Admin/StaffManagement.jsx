import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const ManageStaff = () => {
  const {
    frontstaff = [],
    professionalStaffs = [],
    getAllFrontStaff,
    getAllProfessionalStaff,
    deleteStaff,
    deleteProfessionalStaff,
    isLoading,
  } = useContext(AdminContext);

  useEffect(() => {
    if (!isLoading) {
      getAllFrontStaff();
      getAllProfessionalStaff();
    }
  }, [isLoading]);

  const handleDeleteStaff = async (id, type) => {
    try {
      if (type === "front") {
        await deleteStaff(id);
        toast.success("Front desk staff deleted");
      } else {
        await deleteProfessionalStaff(id);
        toast.success("Therapist deleted");
      }
    } catch (error) {
      toast.error("Failed to delete staff");
    }
  };

  const renderStaffList = (staffArray, type) => (
    <div className="bg-white border rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="bg-gray-100 px-6 py-4 text-black font-semibold text-base border-b">
        {type === "front" ? "Business Owner & Front Desk Staff" : "Therapists"}
      </div>

      {staffArray.length > 0 ? (
        <div className="divide-y text-sm">
          <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr] font-medium px-6 py-3 bg-gray-50 text-black">
            <p>#</p>
            <p>User Name</p>
            <p>Email</p>
            <p className="text-right">Actions</p>
          </div>

          {staffArray.map((staff, index) => (
            <div
              key={staff._id}
              className="grid grid-cols-[0.5fr_2fr_2fr_1fr] items-center px-6 py-4 hover:bg-gray-50 text-black"
            >
              <p>{index + 1}</p>
              <p className="capitalize">{staff.name}</p>
              <p>{staff.email}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteStaff(staff._id, type)}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-6 py-6 text-gray-500 text-center">
          {type === "front" ? "No staff available" : "No therapist available"}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 px-5">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-black">Staff Management</h1>
        <p className="text-sm text-gray-500">
          {isLoading ? "Fetching staff..." : "Manage staff records easily"}
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16 text-lg text-gray-600">
          Loading staff list...
        </div>
      ) : (
        <>
          {/* Front Desk Staff Section */}
          {renderStaffList(frontstaff, "front")}

          {/* Therapists Section */}
          {renderStaffList(professionalStaffs, "professional")}
        </>
      )}
    </div>
  );
};

export default ManageStaff;

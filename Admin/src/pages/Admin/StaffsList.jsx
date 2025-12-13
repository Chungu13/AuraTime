import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";

const StaffsList = () => {
  const { staffs, aToken, getAllStaffs, changeAvailability, deleteService } =
    useContext(AdminContext);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllStaffs();
    }
  }, [aToken]);

  const handleDelete = (staffId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(staffId); 
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <MoveUpOnRender id="admin-doctorlist">
        <h1 className="text-lg font-medium">Service Management</h1>

        <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
          {staffs.map((item, index) => (
            <div
              className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
              key={index}
            >
              <img
                onClick={() => setSelectedImage(item.image)}
                className="h-36 w-full object-cover bg-indigo-50 group-hover:scale-110 group-hover:z-10 transition-all duration-300 ease-in-out"
                src={item.image}
                alt="service"
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-black text-sm  ">{item.speciality}</p>

                <div className="mt-5 flex items-center gap-1 text-sm">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                  />
                  <p>Available</p>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-1 bg-red-500 text-white px-4 py-0.5 rounded-full text-sm w-auto ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MoveUpOnRender>

      {/* Fullscreen Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full"
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full px-3 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffsList;
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MoveUpOnRender from "../components/MoveUpOnRender";

const Staffs = () => {
  const { speciality } = useParams();
  const { staffs } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Fullscreen image

  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(staffs.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(staffs);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [staffs, speciality]);

  return (
    <div>
      <p className="text-black">Browse All Services</p>

      <div className="flex">
        {/* Filters */}
        <div className="flex items-start gap-5 mt-5">
          <button
            className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
              showFilter ? " bg-primary text-white " : ""
            }`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            Filter
          </button>
          <div
            className={`flex-col gap-4 text-sm text-gray-600 ${
              showFilter ? "flex" : "hidden sm:flex"
            }`}
          >
            <p
              onClick={() =>
                speciality === "Facial"
                  ? navigate(`/businesses`)
                  : navigate("/businesses/Facial")
              }
              className={`w-[91vw] sm:w-auto text-black pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === "Facial" ? "bg-beige text-black" : ""
              }`}
            >
              Facial
            </p>
            <p
              onClick={() =>
                speciality === "Massage"
                  ? navigate(`/businesses`)
                  : navigate("/businesses/Massage")
              }
              className={`w-[91vw] sm:w-auto pl-3 py-1.5 pr-16 border text-black border-gray-300 rounded transition-all cursor-pointer ${
                speciality === "Massage" ? "bg-beige text-black" : ""
              }`}
            >
              Massage
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="w-full m-4">
          <MoveUpOnRender>
            <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-110 transition-all duration-500"
                  key={index}
                >
                  <img
                    className="bg-blue-50 h-36 w-full object-cover group-hover:scale-110 transition duration-300 ease-in-out"
                    src={item.image}
                    alt="service"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating when clicking image
                      setSelectedImage(item.image);
                    }}
                  />
                  <div className="p-4">
                    <div
                      className={`flex items-center gap-2 text-sm text-center ${
                        item.available ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      <p
                        className={`w-2 h-2 ${
                          item.available ? "bg-green-500" : "bg-gray-500"
                        } rounded-full`}
                      ></p>
                      <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className="text-gray-900 text-lg font-small">
                      {item.service_name}
                    </p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          </MoveUpOnRender>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full preview"
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

export default Staffs;

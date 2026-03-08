import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedServices = ({ staffId, speciality }) => {
  const { staffs } = useContext(AppContext);
  const [relServices, setRelServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (staffs.length > 0 && speciality) {
      const servicesData = staffs.filter(
        (doc) => doc.speciality === speciality && doc._id !== staffId
      );
      setRelServices(servicesData);
    }
  }, [staffs, staffId, speciality]);

  return (
    <div className="flex flex-col items-center gap-6 mt-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-semibold">Related Services</h1>

      <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0 pt-5">
        {relServices.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="h-52 w-full overflow-hidden bg-blue-50">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-gray-500"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                ></div>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-lg font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/businesses");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-700 px-10 py-2 rounded-full mt-8 hover:bg-blue-100 transition"
      >
        See All Services
      </button>
    </div>
  );
};

export default RelatedServices;

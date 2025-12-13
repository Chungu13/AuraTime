import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const { staffs } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 mp-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium mt-16">Top Quality Services to Book</h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
  {staffs.slice(0, 4).map((item, index) => (
    <div
      onClick={() => {
        navigate(`/appointment/${item._id}`);
        scrollTo(0, 0);
      }}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 shadow"
      key={index}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-125"
          src={item.image}
          alt="service"
        />
      </div>

      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-sm text-center ${
            item.available ? " text-green-500" : "text-gray-500"
          }`}
        >
          <p
            className={`w-2 h-2 ${
              item?.available ? " bg-green-500" : "bg-gray-500"
            } rounded-full`}
          ></p>
          <p>{item.available ? "Available" : "Not Available"}</p>
        </div>

        <p className="text-black text-lg font-medium">
          {item.business_name}
        </p>
        <p className="text-black text-sm font-medium">
          {item.service_name}
        </p>
        <p className="text-black text-sm">{item.speciality}</p>
      </div>
    </div>
  ))}
</div>


      <button
        onClick={() => {
          navigate("/businesses");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;

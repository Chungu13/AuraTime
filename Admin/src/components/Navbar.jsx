import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { StaffContext } from "../context/StaffContext";
// import { useNavigation } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(StaffContext);
  //   const navigate = useNavigation();
  const logout = () => {
    
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };
  return (
    <div className="flex sticky top-0 bg-white/90 z-10 justify-between items-center px-4 py-2 sm:px-10 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-96 sm:w-40 cursor-pointer"
          src={assets.AURA_TIME2}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-600 text-gray-600">
          {aToken ? "BusinessOwner" : "Staff"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-beige text-white text-sm px-10 py-2 rounded-full hover:bg-stone-700 transition duration-200 shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;

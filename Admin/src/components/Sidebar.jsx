import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { StaffContext } from "../context/StaffContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(StaffContext);
  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] border-r-4 border-beige" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>


          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/manage-appointments"}
          >
            <img src={assets.serviceList} alt="" />
            <p className="hidden md:block">Appointments & Revenue</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/all-appointments"}
          >
            <img src={assets.Date} alt="" />
            <p className="hidden md:block">Calendar</p>
          </NavLink>



          

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/professional_staff"}
          >
            <img src={assets.adduser} alt="" />
            <p className="hidden md:block">Add Therapist</p>
          </NavLink>


          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/add-business"}
          >
            <img src={assets.addservice} alt="" />
            <p className="hidden md:block">Add Business Service</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-list"}
          >
            <img src={assets.serviceList} alt="" />
            <p className="hidden md:block">Service List</p>
          </NavLink>


          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-registration"}
          >
            <img src={assets.adduser} alt="" />
            <p className="hidden md:block">Staff Registration</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }  
            to={"/feedbacks"}
          >
            <img src={assets.review} alt="" />
            <p className="hidden md:block"> Customer Feedback</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }  
            to={"/all-staff"}
          >
            <img src={assets.staffmanagement} alt="" />
            <p className="hidden md:block"> All Staff Management </p>
          </NavLink>

          


          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""
              }`
            }  
            to={"/analytic-dashboard"}
          >
            <img src={assets.analyticdashboard} alt="" />
            <p className="hidden md:block">Analytic Dashboard</p>
          </NavLink>


          

        </ul>
      )}


      
      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black  py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-dashboard"}
          >
            <img src={assets.home} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          {/* <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 text-black  px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-appointments"}
          >
            <img src={assets.schedule} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink> */}



            <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-manage-appointments"}
          >
            <img src={assets.schedule} alt="" />
            <p className="hidden md:block">Manage Appointments</p>
          </NavLink>


          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/staff-calendar"}
          >
            <img src={assets.Date} alt="" />
            <p className="hidden md:block">Calendar </p>
          </NavLink>



          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/booking_page"}
          >
            <img src={assets.book} alt="" />
            <p className="hidden md:block">Book Appointment</p>
          </NavLink>



          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 text-black  px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#E3D5B3] text-black  border-r-4 border-beige" : ""
              }`
            }
            to={"/ReminderPage"}
          >
            <img src={assets.notification} alt="" />
            <p className="hidden md:block">Reminder</p>
          </NavLink>


        </ul>
      )}
    </div>
  );
};

export default Sidebar;

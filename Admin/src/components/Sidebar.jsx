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
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] border-r-4 border-beige" : ""}`
            }
            to={"/admin-dashboard"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/appointment-management"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Appointments & Revenue</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/all-appointments"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Admin Calendar</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/therapist-registration"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Add Therapist</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/add-service"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Add Service</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/service-list"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Service List</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/staff-registration"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Add Admin Staff</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/feedback"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Customer Feedback</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/manage-staff"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Manage Employees</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/analytic-dashboard"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Analytics & Reports</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/staff-dashboard"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/staff-manage-appointments"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>My Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/staff-calendar"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>My Calendar</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 text-black py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#E3D5B3] text-black border-r-4 border-beige" : ""}`
            }
            to={"/booking_page"}
          >
            <p className="hidden md:block" style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.01em" }}>Manual Booking</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
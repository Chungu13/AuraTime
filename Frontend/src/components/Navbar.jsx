import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const needsOnboarding = token && userData && (
    userData.gender === "Not selected" ||
    userData.dob === "Not selected" ||
    userData.phone === "000000000" ||
    !userData.address?.line1 ||
    !userData.address?.line2
  );
  return (
    // <div className="flex sticky top-0 bg-white/90 z-10 items-center justify-between text-sm py-4 px-6 mb-5 border-b border-b-gray-400">
    <div className="flex sticky top-0 bg-white/90 z-10 items-center justify-between text-sm py-4 px-6 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="h-14 cursor-pointer object-contain"
        src={assets.aura_time2}
        alt="Logo"
      />

      {!needsOnboarding && (
        <ul className="hidden md:flex items-start gap-5 font-medium ">
          <NavLink to="/">
            <li className="py-1 ">HOME</li>
            <hr className="border-none outline-none h-0.5 bg-beige w-3/5 m-auto hidden " />
          </NavLink>
          <NavLink to="/businesses">
            <li className="py-1 ">ALL SERVICES</li>
            <hr className="border-none outline-none h-0.5 bg-beige w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/about">
            <li className="py-1 ">ABOUT</li>
            <hr className="border-none outline-none h-0.5 bg-beige w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1 ">CONTACT US</li>
            <hr className="border-none outline-none h-0.5 bg-beige w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/Reviews">
            <li className="py-1 ">REVIEWS</li>
            <hr className="border-none outline-none h-0.5 bg-beige w-3/5 m-auto hidden" />
          </NavLink>
        </ul>
      )}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className=" flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 h-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0  pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 ">
                {!needsOnboarding && (
                  <>
                    <p
                      onClick={() => navigate("/my-profile")}
                      className=" hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/my-appointments")}
                      className=" hover:text-black  cursor-pointer"
                    >
                      My Appointment
                    </p>

                    <p
                      onClick={() => navigate("/my-feedback")}
                      className=" hover:text-black  cursor-pointer"
                    >
                      My Feedback
                    </p>
                  </>
                )}

                <p
                  onClick={logout}
                  className=" hover:text-black  cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-beige text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Login
            </button>
          </>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* --------------- Mobile Menu----------- */}
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white  transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-6"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          {!needsOnboarding && (
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium ">
              <NavLink
                className="px-4 py-2 rounded inline-block"
                onClick={() => setShowMenu(false)}
                to="/"
              >
                <p className="px-4 py-2 rounded inline-block">HOME</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/businesses">
                <p className="px-4 py-2 rounded inline-block">ALL SERVICES</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">
                <p className="px-4 py-2 rounded inline-block">ABOUT</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">
                <p className="px-4 py-2 rounded inline-block">CONTACT</p>
              </NavLink>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

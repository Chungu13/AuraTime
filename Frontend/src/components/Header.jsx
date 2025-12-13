import { assets } from "../assets/assets";
const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-warp bg-beige rounded-lg px-6 md:px-10 lg:px-20 ">
      {/* left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight lg:leading-tight">
           Glow & Radiance Spa Powered By Aura Time <br />
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light ">
          {/* <img className="w-28" src={assets.images} alt="" /> */}
          <p>
            Simply browse through our list of services schedule your appointment hassle-free.{" "}
            <br className="hidden sm:block" />
            
          </p>
        </div>
        <a
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 "
          href="#speciality"
        >
          Book appointment
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* right side */}
      <div className="md:w-1/2 relative ">
        <img
          className="w-full md:absolute bottom-14 h-auto rounded-lg"
          src={assets.massage_room}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;

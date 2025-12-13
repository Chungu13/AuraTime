import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";

const About = () => {
  return (
    <MoveUpOnRender id="about">
      <section className="bg-white text-gray-800 py-10 px-6 md:px-16">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-black">ABOUT US</h2>
          <p className="text-gray-500 mt-2">
            Learn more about who we are and what we offer.
          </p>
        </div>

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <img
            className="w-full md:max-w-sm rounded-xl shadow-md"
            src={assets.aboutus}
            alt="About AuraTime"
          />
          <div className="flex flex-col gap-6 md:w-2/3 text-[15px] text-gray-700">
            <p>
              <span className="font-semibold text-black">AuraTime</span> is a powerful and customizable appointment scheduling system designed specifically for small and medium-sized businesses in the beauty and wellness industry.
            </p>
            <p>
              Whether you're running a spa, salon, massage studio, or wellness clinic, AuraTime helps streamline operations, manage staff and appointments, and deliver top-tier service.
            </p>
            <div>
              <h3 className="font-semibold text-black text-lg mb-1">Our Vision</h3>
              <p>
                Our goal is to bridge the gap between businesses and clients with a seamless, tech-enabled experience. We empower providers with smart tools that enhance customer satisfaction and fuel business growth.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold text-gray-800">Why Choose Us</h3>
          <p className="text-gray-500 mt-1">Discover what makes AuraTime different</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-beige hover:text-white cursor-pointer">
            <h4 className="font-semibold text-lg mb-2">Tailored for Your Business</h4>
            <p>
              Whether you're a nail salon, facial studio, or wellness center, we customize the platform to match your workflow.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-beige hover:text-white cursor-pointer">
            <h4 className="font-semibold text-lg mb-2">Smart Scheduling</h4>
            <p>
              Easily manage staff shifts, appointments, and cancellations in one unified platform.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-beige hover:text-white cursor-pointer">
            <h4 className="font-semibold text-lg mb-2">User-Friendly Design</h4>
            <p>
              Intuitive tools designed to be simple and efficient for both staff and clients.
            </p>
          </div>
        </div>
      </section>
    </MoveUpOnRender>
  );
};

export default About;

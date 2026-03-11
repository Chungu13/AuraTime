import MoveUpOnRender from "../components/MoveUpOnRender";
import {
  Sparkles,
  CalendarDays,
  LayoutPanelTop,
  HeartHandshake,
} from "lucide-react";

const About = () => {
  return (
    <MoveUpOnRender id="about">
      <section className="bg-gradient-to-b from-[#f9f4ef] to-[#f6efe8] px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Section Title */}
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7b63]">
              About AuraTime
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2c221c] md:text-4xl">
              Built for beauty and wellness businesses
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6f5d50] md:text-base">
              AuraTime helps modern beauty and wellness businesses simplify
              scheduling, manage staff with ease, and create a smoother booking
              experience for every client.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="rounded-[32px] border border-[#eaded2] bg-white/90 p-8 shadow-[0_10px_35px_rgba(90,70,50,0.06)] md:p-10">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>


                <h3 className="text-xl font-semibold text-[#2c221c]">
                  What AuraTime is
                </h3>

                <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#6f5d50]">
                  <p>
                    <span className="font-semibold text-[#2c221c]">AuraTime</span>{" "}
                    is a customizable appointment scheduling system designed for
                    small and medium-sized businesses in the beauty and wellness
                    industry.
                  </p>

                  <p>
                    Whether you're running a spa, salon, massage studio, or
                    wellness clinic, AuraTime helps streamline operations,
                    organize appointments, and support better service delivery.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#eaded2] bg-[#fcf8f4] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a7b63]">
                  Our Vision
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[#2c221c]">
                  Seamless booking, better experiences
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[#6f5d50]">
                  Our goal is to bridge the gap between businesses and clients
                  with a seamless, tech-enabled experience. We empower providers
                  with smart tools that enhance customer satisfaction and support
                  sustainable business growth.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mx-auto mb-10 mt-16 max-w-2xl text-center">
            <h3 className="text-2xl font-semibold tracking-tight text-[#2c221c]">
              Why Choose Us
            </h3>
            <p className="mt-2 text-sm text-[#7d6a5b]">
              Discover what makes AuraTime different
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[28px] border border-[#eaded2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              {/* <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ebe2] text-[#8b6f5a]">
                <Sparkles size={20} />
              </div> */}
              <h4 className="text-lg font-semibold text-[#2c221c]">
                Tailored for Your Business
              </h4>
              <p className="mt-3 text-sm leading-6 text-[#6f5d50]">
                Whether you're a nail salon, facial studio, or wellness center,
                AuraTime can fit the way your business already works.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#eaded2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              {/* <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ebe2] text-[#8b6f5a]">
                <CalendarDays size={20} />
              </div> */}
              <h4 className="text-lg font-semibold text-[#2c221c]">
                Smart Scheduling
              </h4>
              <p className="mt-3 text-sm leading-6 text-[#6f5d50]">
                Manage appointments, staff availability, and cancellations in a
                simpler and more organized way.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#eaded2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              {/* <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ebe2] text-[#8b6f5a]">
                <LayoutPanelTop size={20} />
              </div> */}
              <h4 className="text-lg font-semibold text-[#2c221c]">
                User-Friendly Design
              </h4>
              <p className="mt-3 text-sm leading-6 text-[#6f5d50]">
                Designed to feel intuitive for both businesses and clients, so
                booking and managing services feels effortless.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MoveUpOnRender>
  );
};

export default About;
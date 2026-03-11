import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Search, MapPin, CalendarDays } from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [service, setService] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams({
      service,
    }).toString();
    navigate(`/businesses${query ? `?${query}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f7f1ea] via-[#f9f3ef] to-[#efe4da] px-6 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[80px] h-72 w-72 rounded-full bg-[#e9d5c4]/35 blur-3xl" />
        <div className="absolute right-[-60px] bottom-[-40px] h-80 w-80 rounded-full bg-[#f3d9de]/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b6f5a]">
          AuraTime
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[#1f1a17] md:text-5xl lg:text-7xl">
          Book wellness and beauty appointments with ease
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#6b5a4d] md:text-lg">
          Discover trusted spa, massage, facial, and self-care services. Choose
          your treatment, pick a time, and book in a few simple steps.
        </p>

        <div className="mx-auto mt-10 max-w-4xl rounded-full border border-white/60 bg-white/90 p-1.5 shadow-[0_10px_40px_rgba(80,60,40,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-h-[48px] flex-1 items-center gap-3 rounded-full px-5">
              <Search size={18} className="text-[#9c8775]" />
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Search for a service or treatment"
                className="w-full bg-transparent text-sm text-[#2d241f] outline-none placeholder:text-[#a69588]"
              />
            </div>

            <button
              onClick={handleSearch}
              className="min-h-[44px] rounded-full bg-[#1f1a17] px-10 text-sm font-semibold text-white transition hover:bg-[#2a231f] sm:min-w-[140px]"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: "Facials", value: "Facial" },
            { label: "Massage", value: "Massage" }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(`/businesses/${item.value}`)}
              className="rounded-full border border-[#e7d8ca] bg-white/80 px-4 py-2 text-sm font-medium text-[#6b5a4d] transition hover:border-[#d8c3b1] hover:bg-white"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* {!token && (
          <div className="mt-8">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-[#d9c8ba] bg-transparent px-6 py-3 text-sm font-medium text-[#5a4a3f] transition hover:bg-white/60"
            >
              Log in to manage your bookings
            </button>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default Banner;
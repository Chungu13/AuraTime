import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SlotSelector = ({ staffSlots, slotIndex, slotTime, setSlotTime }) => {
  const containerRef = useRef(null);

  const currentSlots = staffSlots?.[slotIndex] || [];

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -220,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  };

  const hasNoAvailableSlots =
    currentSlots.length === 0 ||
    currentSlots.every((item) => !item?.time);

  return (
    <div className="w-full mt-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Available Time Slots</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select a time that works best for this appointment.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* Left arrow */}
        <button
          type="button"
          onClick={scrollLeft}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Slots */}
        <div
          ref={containerRef}
          className="flex flex-1 items-center gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {hasNoAvailableSlots ? (
            <div className="flex min-h-[44px] items-center rounded-full border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
              No slots available
            </div>
          ) : (
            currentSlots.map((item, index) => {
              const isSelected = item?.time === slotTime;
              const isUnavailable = !item?.time;

              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => !isUnavailable && setSlotTime(item.time)}
                  disabled={isUnavailable}
                  className={[
                    "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition",
                    "border whitespace-nowrap",
                    isUnavailable
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",
                  ].join(" ")}
                >
                  {item?.time?.toLowerCase()}
                </button>
              );
            })
          )}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={scrollRight}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SlotSelector;
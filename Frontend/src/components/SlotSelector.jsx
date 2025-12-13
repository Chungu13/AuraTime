import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import arrow icons

const SlotSelector = ({ staffSlots, slotIndex, slotTime, setSlotTime }) => {
  const containerRef = useRef(null);

  // Auto-scroll to last item on load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [staffSlots]);

  // Function to scroll left
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.scrollLeft > 0 && -200,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center relative w-full mt-4">
      {/* Left Arrow Button */}
      <div className="flex mr-2">
        <button
          className="p-2 bg-beige-100 rounded-full shadow-md hover:bg-beige transition"
          onClick={scrollLeft}
        >
          <FaChevronLeft size={15} />
        </button>
      </div>

      {/* Scrollable Slots Container */}

      <div className="overflow-x-hidden">
        <div
          ref={containerRef}
          className="flex items-center gap-3 w-full overflow-x-hidden  snap-x snap-mandatory  px-8 py-2 scrollbar-hide"
        >
          {staffSlots.length > 0 &&
            staffSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item?.time)}
                className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer snap-end ${
                  item.time === slotTime
                    ? "bg-beige text-white"
                    : "text-black border border-gray-700"
                }`}
                key={index}
              >
                {item.time === false
                  ? "No slot available"
                  : item?.time?.toLowerCase()}
              </p>
            ))}
        </div>
      </div>

      {/* Right Arrow Button */}
      <div className="flex ml-2">
        <button
          className=" p-2 bg-gray-100 rounded-full shadow-md hover:bg-beige transition "
          onClick={scrollRight}
        >
          <FaChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default SlotSelector;

const CustomEvent = ({ event }) => {
  const data = event.resource;

  return (
    <div
      className="h-full flex flex-col justify-evenly p-2 rounded-md text-white font-medium"
      style={{
        lineHeight: "1.5",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="text-sm font-bold text-white">
        👤 {data.staffName || "N/A"}
      </div>
      
      <div className="text-xs text-white">
        💆 {data.businessData?.service_name || "N/A"}
      </div>
      <div className="text-sm font-bold text-cyan-300">
        🕒 {data.slotTime || "N/A"}
      </div>
    </div>
  );
};

export default CustomEvent;

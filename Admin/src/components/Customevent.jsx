import React from "react";

const CustomEvent = ({ event }) => {
  const appointment = event.resource;
  const serviceName = appointment?.businessData?.service_name || "Appointment";
  const staffName = appointment?.staffName || "Unassigned";
  const clientName = appointment?.userData?.name || "Client";

  return (
    <div className="h-full flex flex-col justify-center leading-tight px-1">
      <p className="truncate text-[11px] font-semibold tracking-tight">
        {serviceName}
      </p>
      <p className="truncate text-[10px] text-white/90">
        {staffName}
      </p>
      <p className="truncate text-[10px] text-white/75">
        {clientName}
      </p>
    </div>
  );
};

export default CustomEvent;
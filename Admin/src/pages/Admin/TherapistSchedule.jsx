import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const StaffCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/admin/staff-appointments');
      const { appointments, staffList } = res.data;

      const resources = staffList.map((s) => ({
        id: s._id,
        title: s.name,
      }));
      setStaff(resources);

     
      const events = appointments.map((a) => ({
        id: a._id,
        title: `${a.userData.name} - ${a.userData.service || 'Service'}`,
        resourceId: a.staffId,
        start: `${a.slotDate}T${a.slotTime}`, 
        end: calculateEndTime(a.slotDate, a.slotTime),
        backgroundColor: '#3b82f6',
        textColor: 'white',
      }));

      setAppointments(events);
    };

    fetchData();
  }, []);

  const calculateEndTime = (date, time) => {
    const start = new Date(`${date}T${time}`);
    start.setMinutes(start.getMinutes() + 60); 
    return start.toISOString();
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimelineDay"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimelineDay,resourceTimelineWeek',
        }}
        resources={staff}
        events={appointments}
        resourceAreaHeaderContent="Therapists"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        height="auto"
      />
    </div>
  );
};

export default StaffCalendar;

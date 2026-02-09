import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { useCallback } from "react";

export const StaffContext = createContext();

const StaffContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const [businessData, setBusinessData] = useState(null);

  const [profileData, setProfileData] = useState(null);

  const [bookedTimes, setBookedTimes] = useState([]);

  const [professionalStaffs, setProfessionalStaffs] = useState([]);

  const [nextdayappointments, setnextDayAppointments] = useState([]);


  const getNextDayAppointments = useCallback(async () => {
    console.log("Fetching next-day appointments (no date param needed)");

    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/next-day-appointments`, {
        headers: { dToken },
      });

      if (data.success) {
        setnextDayAppointments(data.nextdayappointments);
      } else {
        console.error("Error: No appointments found");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [backendUrl, dToken]);



  const sendReminderEmails = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/staff/send-reminders`,
        { nextdayappointments },
        { headers: { dToken } }
      );

      if (data.success) {
        alert("Reminder emails sent successfully");
      } else {
        alert("Failed to send reminder emails");
      }
    } catch (error) {
      console.error("Error sending reminder emails:", error);
    }
  }, [backendUrl, dToken, nextdayappointments]);




  const getBusinessData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/get-business`, {
        headers: { dToken },
      });

      if (data.success) {
        setBusinessData(data.businessData);
        setProfileData(data.profileData);
        console.log("Fetched business data:", data);
      } else {
        console.error("Failed to fetch business data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };



  const updateStaffForAppointment = async (appointmentId, staffId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/staff/update-staff`,
        { appointmentId, staffId },
        {
          headers: { dToken },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await getAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Error updating staff for appointment");
    }
  };





  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/staff/appointments",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };








  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/staff/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }

      return data;
    } catch (error) {

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
        return { success: false, message: error.response.data.message };
      }


      const message = "Error completing appointment: " + error.message;
      toast.error(message);
      return { success: false, message };
    }
  };








  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/staff/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        getAppointments();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };




  const getAllStaffs = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/all-staffs", {
        headers: { dToken },
      });

      if (data.success) {
        setStaffs(data.staffs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load staffs");
      console.error(error);
    }
  }, [backendUrl, dToken]);






  const deleteService = async (staffId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-service",
        { staffId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllStaffs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };






  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/staff-dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };



  const changeAvailability = async (staffId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { staffId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllStaffs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };




  const [staffCount, setStaffCount] = useState(0);

  const fetchStaffCount = async () => {

    try {
      const { data } = await axios.get(backendUrl + "/api/staff/staff-count", {
        headers: { dToken },
      });

      if (data.success) {
        setStaffCount(data.staffCount);
      }
    } catch (error) {
      console.error("Error fetching staff count:", error);
    }
  };






  const getAllFeedbacks = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/staff-feedbacks", {
        headers: { dToken },
      });
      if (data.success) {
        return data.feedbacks;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch feedbacks");
      return [];
    }
  };



  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/staff-profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log("data:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };







  const getBookedTimesForDate = async (slotDate) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/check-appointments`, {
        params: { slotDate },
        headers: { dToken },
      });

      if (data.success) {
        console.log("Booked times:", data.bookedTimes);
        setBookedTimes(data.bookedTimes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching booked appointments.");
      console.log(error);
    }
  };






  const getAllProfessionalStaff = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/staff/get-all-professional-staff",
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        setProfessionalStaffs(data.staff);
        return data;
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching professional staff:", error);
      toast.error("Error fetching professional staff.");
      return { success: false, message: error.message };
    }
  };





  const getAppointmentsByDate = async (slotDate) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/staff/appointments-by-date",
        { slotDate },
        {
          headers: {
            dToken,
            "Content-Type": "application/json"
          }
        }
      );

      if (!data.success) throw new Error(data.message);
      return data.appointments || [];

    } catch (error) {
      console.error("Fetch Error:", {
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Failed to load appointments");
      return [];
    }
  };







  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    getBusinessData,
    businessData,
    setBusinessData,
    getAllFeedbacks,
    fetchStaffCount,
    staffCount,
    deleteService,
    changeAvailability,
    staffs,
    getAllStaffs,
    getBookedTimesForDate,
    bookedTimes,
    getAllProfessionalStaff,
    professionalStaffs,
    updateStaffForAppointment,
    getNextDayAppointments,
    sendReminderEmails,
    setnextDayAppointments,
    nextdayappointments,
    getAppointmentsByDate


  };

  return (
    <StaffContext.Provider value={value}>
      {props.children}
    </StaffContext.Provider>
  );
};

export default StaffContextProvider;

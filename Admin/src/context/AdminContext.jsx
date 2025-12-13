import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [staffs, setStaffs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  
  const [professionalStaffs, setProfessionalStaffs] = useState([]); 

  const [appointmentTrends, setAppointmentTrends] = useState([]);
  const [servicePopularity, setServicePopularity] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [cancellationTrends, setCancellationTrends] = useState([]);
  const [appointmentTypeTrends, setAppointmentTypeTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [frontstaff, setFrontStaffs] = useState([]);
  
const [reports, setReports] = useState(null);

const [report, setReport] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const fetchAnalyticsData = async (startDate,endDate) => {
  if (isLoading) return;  

  setIsLoading(true);  
  try {
    await getAppointmentTrends(startDate, endDate);  
    await getRevenueTrends(); 
    await getServicePopularity();  
    await getCancellationTrends();
    await getAppointmentTypeTrends();
    
  
    console.log("Appointment Trends:", appointmentTrends);
    console.log("Revenue Trends:", revenueTrends);
    console.log("Service Popularity:", servicePopularity);
    console.log("Canaclation :", cancellationTrends);
    console.log("Cancel vs Complete:", appointmentTypeTrends);

  } catch (error) {
    console.error("Error fetching analytics data:", error);
  } finally {
    setIsLoading(false);  
  }
};


const fetchReports = async () => {
  try {
    const res = await axios.get(backendUrl + "/api/admin/reports");

    if (res.data && res.data.data) {
      console.log("✅ Reports Data:", res.data.data);
      setReports(res.data.data); 
    } else {
      console.error("Unexpected response format:", res.data);
    }
  } catch (err) {
    console.error("Error fetching reports:", err);
  }
};




  const getAllStaffs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-staffs", {
        headers: { aToken },
      });

      if (data.success) {
        setStaffs(data.staffs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };




  const fetchReport = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/admin/generatereports", {
      headers: { aToken },
    });

    if (data.success) {
      setReport(data.report);
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    console.error("Error fetching report:", err);
    toast.error("Something went wrong while fetching the report.");
  }
};






const [staffCount, setStaffCount] = useState(0);
// Count staff number from Admin
const fetchStaffCount = async () => {
  
  try {
    const { data } = await axios.get(backendUrl + "/api/admin/staff-count");
    
    if (data.success) {
      setStaffCount(data.staffCount);
    }
  } catch (error) {
    console.error("Error fetching staff count:", error);
  }
};



  const changeAvailability = async (staffId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { staffId },
        { headers: { aToken } }
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



  const deleteService = async (staffId) => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/admin/delete-service", 
      { staffId },
      { headers: { aToken } } 
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



const professionalStaffRegistration = async ({ name, email }) => {
  try {
   
    const { data } = await axios.post(
      backendUrl + "/api/admin/register-professional-staff", 
      { name, email}, 
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message); 
      return true; 
    } else {
      toast.error(data.message); 
      return false; 
    }
  } catch (error) {
    toast.error(error.message); 
    return false; 
  }
};



const updateStaffForAppointment = async (appointmentId, staffId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/update-staff`, 
        { appointmentId, staffId },
        {
          headers: { aToken }, 
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
       
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Error updating staff for appointment");
    }
  };






  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };



  const getAllProfessionalStaff = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/get-all-professional-staff", // API endpoint to get professional staff
        {
          headers: { aToken },
        }
      );

      if (data.success) {
        setProfessionalStaffs(data.staff); 
        return data; // Return success response
      } else {
        toast.error(data.message); // Show error message
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error fetching professional staff:", error);
      toast.error("Error fetching professional staff.");
      return { success: false, message: error.message }; // Return error message if the request fails
    }
  };  

  


  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };








const completeAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/admin/complete-appointment",
      { appointmentId },
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message);
      getAllAppointments();
      getDashData();
    } else {
      toast.error(data.message);
    }

    return data;
  } catch (error) {
    // Check if backend sent a custom error message
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
      return { success: false, message: error.response.data.message };
    }

    // Generic fallback
    const message = "Error completing appointment: " + error.message;
    toast.error(message);
    return { success: false, message };
  }
};



  

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
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




  // Admin get all feedbacks
const getAllFeedbacks = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/admin/feedbacks");

    // Log the data received from the backend
    console.log("Fetched feedbacksssssss data:", data);  // Add this line to log the response

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




//admin/staff register 
const staffRegistration = async (staffData) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/staff-registration`,
      staffData,
      {
        headers: {
          "Content-Type": "application/json",
          aToken,
        },
      }
    );

    if (data.success) {
      toast.success(data.message || "Staff registered successfully.");
      getAllStaffs(); // Optional: refresh staff list after registration
    } else {
      toast.error(data.message || "Failed to register staff.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration error.");
  }
};




  //Get Appointment by Date
 const getAppointmentsByDate = async (slotDate) => {
  try {
    const { data } = await axios.post(backendUrl + "/api/admin/appointments-by-date",
      { slotDate }, // Send in request body
      { 
        headers: { 
          Authorization: `Bearer ${aToken}`,
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


// Fetch appointment trends by date range
  const getAppointmentTrends = async (startDate, endDate) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/appointment-trends`,
        { startDate, endDate },
        { headers: { aToken } }
      );
      if (data.success) {
        setAppointmentTrends(data.appointmentTrends);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // Fetch service popularity
  const getServicePopularity = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/service-popularity`, {
        headers: { aToken },
      });
      if (data.success) {
        setServicePopularity(data.servicePopularity);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };



  // Fetch revenue trends
  const getRevenueTrends = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/revenue-trends`, {
        headers: { aToken },
      });
      if (data.success) {
        setRevenueTrends(data.revenueTrends);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // Fetch cancellation trends
  const getCancellationTrends = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/cancellation-trends`, {
        headers: { aToken },
      });
      if (data.success) {
        setCancellationTrends(data.cancellationTrends);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };



  

  // Fetch appointment type trends (Completed vs Cancelled)
  const getAppointmentTypeTrends = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointment-type-trends`, {
        headers: { aToken },
      });
      if (data.success) {
        setAppointmentTypeTrends(data.appointmentTypeTrends);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };




  const getAllFrontStaff = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-front-staffs", {
        headers: { aToken },
      });

      console.log("All front Staff data:", data);  // Add this line to log the response
      if (data.success) {
        setFrontStaffs(data.frontstaff);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  
  const deleteStaff = async (staffId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-front-staff", 
        { staffId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllFrontStaff(); // Refresh the staff list after deletion
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };



  // Delete therapist (professional staff)
  const deleteProfessionalStaff = async (staffId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-professional-staff", 
        { staffId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllProfessionalStaff(); // Refresh the professional staff list after deletion
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const value = {
    aToken,
    setAToken,
    backendUrl,
    staffs,
    getAllStaffs,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData,
    getAppointmentsByDate,
    getAllFeedbacks,
    staffRegistration,
    fetchStaffCount,
    staffCount,
    deleteService,
    professionalStaffRegistration,
    getAllProfessionalStaff,
    professionalStaffs,
    completeAppointment,
    updateStaffForAppointment,
    getAppointmentTrends,
    getServicePopularity,
    getRevenueTrends,
    getCancellationTrends,
    getAppointmentTypeTrends,
    appointmentTrends,
    servicePopularity,
    revenueTrends,
    cancellationTrends,
    appointmentTypeTrends,
    fetchAnalyticsData,
    isLoading,
    frontstaff,
    getAllFrontStaff,
    deleteStaff,
    deleteProfessionalStaff,
    reports,
    fetchReports,
    report,
    fetchReport
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

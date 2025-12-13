import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AppContextProvider = (props) => {
  const currency = "$";
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading:", isLoading);
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  
  


  useEffect(() => {
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const responseInterceptor = axios.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  // 🧹 Clean up interceptors when component unmounts
  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
}, []);




  
 


  const slotDateFormat = (slotDate) => {
  if (!slotDate || typeof slotDate !== "string") return "Invalid Date";

  const dateObj = new Date(slotDate);
  if (isNaN(dateObj)) return "Invalid Date";

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  

  return `${day} ${months[month]} ${year}`;
};




  
  const value = {
    calculateAge,
    slotDateFormat,
    currency,
    isLoading,
    setIsLoading,
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

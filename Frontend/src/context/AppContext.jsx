import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading:", isLoading);
  const [staffs, setStaffs] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  const getStaffsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/staff/list");

      if (data.success) {
        setStaffs(data.staffs);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getStaffsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  useEffect(() => {
    // request intercepter
    console.log("inter");
    axios.interceptors.request.use(
      (config) => {
        setIsLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //response intercepter
    axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);
  const value = {
    staffs,
    getStaffsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoading,
    setIsLoading,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

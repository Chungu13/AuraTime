import { Route, Routes, useNavigate, useLocation } from "react-router-dom"; // Syncing directory casing
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import About from "./pages/About";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";
import axios from "axios";
import TopLoadingBar from "./components/TopLoadingBar";
import PaymentSuccess from "./pages/PaymentSuccess";
import FeedbackForm from "./pages/MyFeedback"

import ForgotPassword from "./pages/ForgotPassword";

import Reviews from "./pages/Reviews";

import UserInquiryChat from "./pages/Contact";

import './App.css';


import Onboarding from "./pages/Onboarding";

const App = () => {
  const { isLoading, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Onboarding Redirection Guard
  useEffect(() => {
    if (token && userData) {
      const isOnboarding = location.pathname === "/onboarding";
      const isLogin = location.pathname === "/login";

      const needsOnboarding =
        userData.gender === "Not selected" ||
        userData.dob === "Not selected" ||
        userData.phone === "000000000" ||
        !userData.address?.line1 ||
        !userData.address?.line2;

      if (needsOnboarding) {
        if (!isOnboarding) {
          navigate("/onboarding", { replace: true });
        }
      } else {
        if (isOnboarding || isLogin) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [token, userData, location.pathname, navigate]);

  return (
    <>
      {isLoading && <TopLoadingBar message="Loading ..." />}
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/businesses" element={<Services />}></Route>
          <Route path="/businesses/:speciality" element={<Services />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/my-profile" element={<MyProfile />}></Route>
          <Route path="/my-appointments" element={<MyAppointments />}></Route>
          <Route path="/appointment/:staffId" element={<Appointment />}></Route>
          <Route path="/my-feedback" element={<FeedbackForm />} />
          <Route path="*" element={<div>Not found</div>} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="/Forgot-Password" element={<ForgotPassword />}></Route>

          <Route path="/Reviews" element={<Reviews />}></Route>

          <Route path="/Chat" element={<UserInquiryChat />}></Route>

        </Routes>
        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </>
  );
};

export default App;

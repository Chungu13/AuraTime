import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Staffs from "./pages/Staffs";
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

import './App.css'; // with the './' if it's in src folder



// Inside <Routes>


const App = () => {
  const { isLoading, setIsLoading } = useContext(AppContext);

  return (
    <>
      {isLoading && <TopLoadingBar message="Loading ..." />}
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/businesses" element={<Staffs />}></Route>
          <Route path="/businesses/:speciality" element={<Staffs />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/my-profile" element={<MyProfile />}></Route>
          <Route path="/my-appointments" element={<MyAppointments />}></Route>
          <Route path="/appointment/:staffId" element={<Appointment />}></Route>
          <Route path="/my-feedback" element={<FeedbackForm />} />
          <Route path="*" element={<div>Not found</div>} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="/appointment/:staffId" element={<Appointment />}></Route>

          <Route path="/Forgot-Password" element={<ForgotPassword/>}></Route>


          <Route path="/Reviews" element={<Reviews />}></Route>

          <Route path="/Chat" element={<UserInquiryChat/>}></Route>


          
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName={(context) => {
            if (context?.type === "success") {
              return "custom-toast-success";
            }
            if (context?.type === "error") {
              return "custom-toast-error";
            }
            return "custom-toast-default";
          }}
          bodyClassName="toast-body"
        />

      </div>
    </>
  );
};

export default App;

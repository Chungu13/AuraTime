import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "sonner";
import { StaffContext } from "../context/StaffContext";

const Login = () => {
  const [state, setState] = useState("BusinessOwner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(StaffContext);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (state === "BusinessOwner") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", { email, password });
        if (data.success) {
          sessionStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/staff/login", { email, password });
        if (data.success) {
          sessionStorage.setItem("dToken", data.token);
          setDToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = state === "BusinessOwner";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#faf7f2] to-[#f0e8d8] font-['DM_Sans']">
      {/* Full-height fixed left banner */}
      <div className="hidden md:flex flex-col justify-between w-[280px] shrink-0 min-h-screen bg-gradient-to-b from-[#4a3020] to-[#2a1608] p-[52px_36px] fixed top-0 left-0 bottom-0 z-10 overflow-hidden">
        {/* Banner Decorative Circles */}
        <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,169,122,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[80px] -left-[80px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(201,169,122,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#c9a97a] to-transparent opacity-50" />

        <div className="relative z-10 text-white">

          <h2 className="text-[1.6rem] font-semibold leading-[1.25] mb-4">Aura Time</h2>
          <p className="text-[0.82rem] font-normal text-[#e8d8c0] leading-[1.7]">
            Your central hub for appointments, staff, services, and business insights.
          </p>
        </div>

        <div className="relative z-10">
          <ul className="list-none m-0 p-0 flex flex-col gap-3">
            {["Appointment scheduling", "Staff management", "Customer feedback"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[0.8rem] font-medium text-[#f0e0c8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a97a] shrink-0 shadow-[0_0_6px_rgba(201,169,122,0.6)]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-[40px_24px] md:ml-[280px]">
        <div className="w-full max-w-[400px] bg-[rgba(255,253,249,0.97)] border border-[rgba(220,205,182,0.6)] rounded-[20px] p-[40px_36px_36px] shadow-[0_4px_32px_rgba(100,72,40,0.1),0_1px_4px_rgba(100,72,40,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] relative animate-cardIn before:content-[''] before:absolute before:top-0 before:left-8 before:right-8 before:h-[3px] before:rounded-[0_0_4px_4px] before:bg-[linear-gradient(90deg,#c9a97a,#8b6f4e,#c9a97a)] before:bg-[length:200%_100%] before:animate-shimmer">
          <h1 className="text-[1.75rem] font-semibold text-[#1e1209] mb-1 leading-[1.15]">Sign in</h1>
          <p className="text-[0.82rem] font-normal text-[#5a3e28] mb-[26px]">Choose your role and enter your credentials</p>

          <div className="flex gap-1.5 mb-[22px] bg-[#ecdfc9] rounded-[10px] p-1">
            <button
              type="button"
              className={`flex-1 py-2 border-none rounded-[7px] text-[0.78rem] font-medium cursor-pointer transition-all duration-200 ${isOwner ? "bg-white text-[#2e1f12] font-semibold shadow-[0_1px_6px_rgba(139,111,78,0.22)]" : "bg-transparent text-[#5a3e28]"}`}
              onClick={() => setState("BusinessOwner")}
            >
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 py-2 border-none rounded-[7px] text-[0.78rem] font-medium cursor-pointer transition-all duration-200 ${!isOwner ? "bg-white text-[#2e1f12] font-semibold shadow-[0_1px_6px_rgba(139,111,78,0.22)]" : "bg-transparent text-[#5a3e28]"}`}
              onClick={() => setState("Staff")}
            >
              Staff
            </button>
          </div>

          <form onSubmit={onSubmitHandler}>
            <div className="mb-[15px] animate-fadeUp" style={{ animationDelay: "0.05s" }}>
              <label className="block text-[0.75rem] font-semibold uppercase tracking-wider text-[#3d2c1e] mb-1.5">Email</label>
              <div className="relative">
                <input
                  className={`w-full text-[0.88rem] font-normal text-[#1e1209] bg-[#faf6f0] border-[1.5px] border-[#d4c0a4] rounded-[9px] p-[10px_14px] outline-none transition-all duration-200 placeholder:text-[#9e8468] focus:border-[#8b6f4e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,111,78,0.15)] ${errors.email ? '!border-red-400 !bg-red-50/20' : ''}`}
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  value={email}
                />
              </div>
              {errors.email && <p className="text-[10px] uppercase font-bold text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="mb-[15px] animate-fadeUp" style={{ animationDelay: "0.1s" }}>
              <label className="block text-[0.75rem] font-semibold uppercase tracking-wider text-[#3d2c1e] mb-1.5">Password</label>
              <div className="relative">
                <input
                  className={`w-full text-[0.88rem] font-normal text-[#1e1209] bg-[#faf6f0] border-[1.5px] border-[#d4c0a4] rounded-[9px] p-[10px_14px] pr-[42px] outline-none transition-all duration-200 placeholder:text-[#9e8468] focus:border-[#8b6f4e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,111,78,0.15)] ${errors.password ? '!border-red-400 !bg-red-50/20' : ''}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  value={password}
                />
                <button type="button" className="absolute right-[11px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b5039] p-1 flex transition-colors duration-200 hover:text-[#2e1f12]" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-[10px] uppercase font-bold text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-2.5 text-[0.88rem] font-semibold tracking-wide text-white bg-[#1a1a18] border-none rounded-[10px] p-3 cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)] relative overflow-hidden active:translate-y-0 hover:-translate-y-[1px] hover:shadow-[0_7px_22px_rgba(0,0,0,0.25)] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent)] before:pointer-events-none">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Connecting...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-4 text-[0.78rem] font-normal text-[#3d2c1e] text-center">
            {isOwner ? "Staff member? " : "Business owner? "}
            <button type="button" className="bg-none border-none color-[#6b4226] font-bold cursor-pointer underline underline-offset-2 p-0 hover:text-[#2e1f12]" onClick={() => setState(isOwner ? "Staff" : "BusinessOwner")}>
              Switch here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
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
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/staff/login", { email, password });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .login-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: linear-gradient(145deg, #faf7f2 0%, #f0e8d8 100%);
        }

        /* ── Full-height fixed left banner ── */
        .login-banner {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 280px;
          flex-shrink: 0;
          min-height: 100vh;
          background: linear-gradient(180deg, #4a3020 0%, #2a1608 100%);
          padding: 52px 36px;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 10;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .login-banner { display: flex; }
        }

        .login-banner::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,122,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-banner::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,122,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-banner-edge {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent 0%, #c9a97a 30%, #8b6f4e 70%, transparent 100%);
          opacity: 0.5;
        }

        .banner-top { position: relative; z-index: 1; }

        .banner-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a97a;
          margin: 0 0 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .banner-eyebrow::before {
          content: '';
          width: 18px; height: 2px;
          background: #c9a97a;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .banner-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.25;
          margin: 0 0 16px;
        }

        .banner-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          color: #e8d8c0;
          line-height: 1.7;
          margin: 0;
        }

        .banner-bottom { position: relative; z-index: 1; }

        .banner-features {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .banner-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #f0e0c8;
        }
        .banner-feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c9a97a;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(201,169,122,0.6);
        }

        /* ── Main content ── */
        .login-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          margin-left: 0;
        }
        @media (min-width: 768px) {
          .login-main { margin-left: 280px; }
        }

        /* ── Card ── */
        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,253,249,0.97);
          border: 1px solid rgba(220,205,182,0.6);
          border-radius: 20px;
          padding: 40px 36px 36px;
          box-shadow:
            0 4px 32px rgba(100,72,40,0.1),
            0 1px 4px rgba(100,72,40,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          position: relative;
          animation: cardIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 32px; right: 32px;
          height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #c9a97a, #8b6f4e, #c9a97a);
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .login-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8b6f4e;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-eyebrow::before {
          content: '';
          width: 18px; height: 2px;
          background: linear-gradient(90deg, #c9a97a, #8b6f4e);
          border-radius: 2px;
        }

        .login-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e1209;
          margin: 0 0 4px;
          line-height: 1.15;
        }

        .login-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          color: #5a3e28;
          margin: 0 0 26px;
        }

        /* Role pills */
        .role-toggle {
          display: flex;
          gap: 6px;
          margin-bottom: 22px;
          background: #ecdfc9;
          border-radius: 10px;
          padding: 4px;
        }
        .role-btn {
          flex: 1;
          padding: 8px 8px;
          border: none;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          color: #5a3e28;
        }
        .role-btn.active {
          background: #fff;
          color: #2e1f12;
          font-weight: 600;
          box-shadow: 0 1px 6px rgba(139,111,78,0.22);
        }

        /* Fields */
        .login-field { margin-bottom: 15px; animation: fadeUp 0.35s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #3d2c1e;
          margin-bottom: 6px;
        }

        .login-input-wrap { position: relative; }

        .login-input {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 400;
          color: #1e1209;
          background: #faf6f0;
          border: 1.5px solid #d4c0a4;
          border-radius: 9px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .login-input::placeholder { color: #9e8468; }
        .login-input:focus {
          border-color: #8b6f4e;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(139,111,78,0.15);
        }
        .login-input.has-toggle { padding-right: 42px; }

        .pwd-toggle {
          position: absolute;
          right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #6b5039;
          padding: 4px; display: flex;
          transition: color 0.2s ease;
        }
        .pwd-toggle:hover { color: #2e1f12; }

        .login-submit {
          width: 100%;
          margin-top: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #fff;
          background: linear-gradient(135deg, #c9a97a 0%, #7a5230 100%);
          border: none;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 16px rgba(139,111,78,0.4);
          position: relative;
          overflow: hidden;
        }
        .login-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
        }
        .login-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 22px rgba(139,111,78,0.48);
        }
        .login-submit:active { transform: translateY(0); }

        .login-switch {
          margin-top: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 400;
          color: #3d2c1e;
          text-align: center;
        }
        .login-switch-btn {
          background: none; border: none;
          color: #6b4226;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
        }
        .login-switch-btn:hover { color: #2e1f12; }
      `}</style>

      <div className="login-page">

        {/* Full-height fixed left banner */}
        <div className="login-banner">
          <div className="login-banner-edge" />
          <div className="banner-top">
            <p className="banner-eyebrow">Admin Portal</p>
            <h2 className="banner-title">Aura Time Management</h2>
            <p className="banner-desc">Your central hub for appointments, staff, services, and business insights.</p>
          </div>
          <div className="banner-bottom">
            <ul className="banner-features">
              {["Appointment scheduling", "Staff management", "Revenue tracking", "Customer feedback"].map((f) => (
                <li key={f} className="banner-feature">
                  <span className="banner-feature-dot" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Floating form card */}
        <div className="login-main">
          <div className="login-card">
            <p className="login-eyebrow">Welcome back</p>
            <h1 className="login-title">Sign in</h1>
            <p className="login-subtitle">Choose your role and enter your credentials</p>

            <div className="role-toggle">
              <button type="button" className={`role-btn ${isOwner ? "active" : ""}`} onClick={() => setState("BusinessOwner")}>
                Business Owner
              </button>
              <button type="button" className={`role-btn ${!isOwner ? "active" : ""}`} onClick={() => setState("Staff")}>
                Staff
              </button>
            </div>

            <form onSubmit={onSubmitHandler}>
              <div className="login-field" style={{ animationDelay: "0.05s" }}>
                <label className="login-label">Email</label>
                <div className="login-input-wrap">
                  <input
                    className={`login-input ${errors.email ? '!border-red-400 !bg-red-50/20' : ''}`}
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

              <div className="login-field" style={{ animationDelay: "0.1s" }}>
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <input
                    className={`login-input has-toggle ${errors.password ? '!border-red-400 !bg-red-50/20' : ''}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                    }}
                    value={password}
                  />
                  <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
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

              <button type="submit" disabled={isSubmitting} className="login-submit">
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

            <p className="login-switch">
              {isOwner ? "Staff member? " : "Business owner? "}
              <button type="button" className="login-switch-btn" onClick={() => setState(isOwner ? "Staff" : "BusinessOwner")}>
                Switch here
              </button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;
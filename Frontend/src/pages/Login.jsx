import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import MoveUpOnRender from "../components/MoveUpOnRender";

const Login = () => {
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          sessionStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome aboard! Let's set up your profile.");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          sessionStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back to AuraTime");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAFAF8] p-4">
      <MoveUpOnRender id="login-container">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-[#E8E8E1] overflow-hidden max-w-lg w-full">

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="w-full p-8 sm:p-14">
            <div className="mx-auto">
              <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[#1A1A18] tracking-tight mb-2">
                  {state === "Sign Up" ? "Create Account" : "Sign In"}
                </h1>
                <p className="text-[#6B6B5E] text-sm font-medium">
                  {state === "Sign Up" ? "Start your journey with AuraTime" : "Enter your credentials to continue"}
                </p>
              </div>

              <div className="space-y-5">
                {state === "Sign Up" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C] ml-1">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-[#F9F9F6] border border-[#E8E8E1] rounded-2xl focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5 transition-all">
                      <User className="text-[#9E9E8C]" size={18} />
                      <input
                        className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm"
                        type="text"
                        placeholder="John Doe"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C] ml-1">Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-[#F9F9F6] border border-[#E8E8E1] rounded-2xl focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5 transition-all">
                    <Mail className="text-[#9E9E8C]" size={18} />
                    <input
                      className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm"
                      type="email"
                      placeholder="hello@auratime.com"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C]">Password</label>
                    {state === "Login" && (
                      <button
                        type="button"
                        onClick={() => navigate("/Forgot-Password")}
                        className="text-[10px] font-bold text-beige hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F9F9F6] border border-[#E8E8E1] rounded-2xl focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5 transition-all relative">
                    <Lock className="text-[#9E9E8C]" size={18} />
                    <input
                      className="bg-transparent w-full outline-none text-[#1A1A18] font-medium text-sm pr-8"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#9E9E8C] hover:text-[#1A1A18] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A18] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all shadow-xl shadow-[#1A1A18]/10 disabled:bg-gray-400 group"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {state === "Sign Up" ? "Create Account" : "Continue to Dashboard"}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-[#6B6B5E] font-medium">
                    {state === "Sign Up" ? "Already have an account?" : "Need an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
                      className="text-beige font-bold hover:underline"
                    >
                      {state === "Sign Up" ? "Sign in here" : "Sign up for free"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default Login;


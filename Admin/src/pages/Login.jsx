import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { StaffContext } from "../context/StaffContext";

const Login = () => {
  const [state, setState] = useState("BusinessOwner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(StaffContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "BusinessOwner") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/staff/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log("data.token:", data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold mt-auto">
          <span className="text-beige">{state}</span> Login
        </p>

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="w-full relative">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type={showPassword ? "text" : "password"}
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[30px] cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Submit */}
        <button className="bg-beige text-white w-full py-2 rounded-md text-base">
          Login
        </button>

        {/* Toggle login state */}
        {state === "BusinessOwner" ? (
          <p>
            Staff Login?{" "}
            <span
              className="text-beige underline cursor-pointer"
              onClick={() => setState("Staff")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Business Owner Login?{" "}
            <span
              className="text-beige underline cursor-pointer"
              onClick={() => setState("BusinessOwner")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;

import { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { User, Mail, Lock, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

const StaffRegistration = () => {
  const { staffRegistration } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await staffRegistration({ name, email, password, role });
    if (success !== false) { // Assuming success or undefined/true
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setErrors({});
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Register New Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Grant administrative or staff access to the business portal.
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                <User size={18} className={`mr-3 transition-colors ${errors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                  }}
                  className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                <Mail size={18} className={`mr-3 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className={`group flex items-center border rounded-xl px-4 transition-all duration-200 ${errors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50'}`}>
                  <Lock size={18} className={`mr-3 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-slate-600'}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                    }}
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">{errors.password}</p>}
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Access Level
                </label>
                <div className="group flex items-center border border-slate-200 rounded-xl px-4 transition-all duration-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-50">
                  <ShieldCheck size={18} className="mr-3 text-slate-400 group-focus-within:text-slate-600" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="admin">Admin (Full Access)</option>
                    <option value="staff">Staff (Limited)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Tips footer */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Security Tip:
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Use a mix of letters, numbers, and symbols for stronger account security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { User, Mail } from "lucide-react";

const RegisterTherapist = () => {
  const { professionalStaffRegistration } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const success = await professionalStaffRegistration({
      name,
      email,
    });

    if (success) {
      setName("");
      setEmail("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full px-6 py-10 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Register Therapist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add a therapist to your staff so they can be assigned to appointments.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6"
        >

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <div className={`flex items-center border rounded-xl px-3 transition-colors ${errors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus-within:border-slate-400'}`}>
              <User size={16} className={errors.name ? 'text-red-400' : 'text-slate-400 mr-2'} />

              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                }}
                placeholder="Enter therapist name"
                className="w-full h-11 text-sm outline-none bg-transparent ml-2"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <div className={`flex items-center border rounded-xl px-3 transition-colors ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus-within:border-slate-400'}`}>
              <Mail size={16} className={errors.email ? 'text-red-400' : 'text-slate-400 mr-2'} />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                placeholder="example@gmail.com"
                className="w-full h-11 text-sm outline-none bg-transparent ml-2"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
          </div>

          {/* Divider */}
          <div className="border-t pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterTherapist;
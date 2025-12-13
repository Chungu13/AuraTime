import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const ProfessionalStaffRegistration = () => {
  const { professionalStaffRegistration } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await professionalStaffRegistration({
      name,
      email,
    });

    if (success) {
      setName("");
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-auto min-h-[80vh] flex items-center justify-center">
      <div className="p-6 border rounded shadow w-full max-w-md text-sm text-black">
        <h2 className="text-xl font-bold mb-4">Register Therapist</h2>

        {/* Name */}
        <label className="block mb-4">
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            placeholder="Full Name"
            required
          />
        </label>

        {/* Email */}
        <label className="block mb-4">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            placeholder="example@gmail.com"
            required
          />
        </label>

        {/* Submit */}
        <button type="submit" className="w-full bg-beige text-white py-2 rounded">
          Register
        </button>
      </div>
    </form>
  );
};

export default ProfessionalStaffRegistration;

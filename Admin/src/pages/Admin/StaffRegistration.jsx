import { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const StaffRegistration = () => {
  const { staffRegistration } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await staffRegistration({ name, email, password, role });
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-auto min-h-[80vh] flex items-center justify-center">
      <div className="p-6 border rounded shadow w-full max-w-md text-sm text-black">
        <h2 className="text-xl font-bold mb-4">Register Business Owner or Staff</h2>

        <label className="block mb-2 text-black">
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

        <label className="block mb-2 text-black">
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

        <label className="block mb-2 text-black">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            placeholder="Password"
            required
          />
        </label>

        <label className="block mb-4 text-black">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            required
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </label>

        <button type="submit" className="w-full bg-beige text-white py-2 rounded">
          Register
        </button>
      </div>
    </form>
  );
};

export default StaffRegistration;

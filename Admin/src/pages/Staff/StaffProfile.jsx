import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import TopLoadingBar from "../../components/TopLoadingBar";

const StaffProfile = () => {
  const { dToken, backendUrl, businessData, getBusinessData, profileData } =
    useContext(StaffContext);

  const { currency } = useContext(AppContext);

  const [formStates, setFormStates] = useState([]);

  useEffect(() => {
    if (dToken) {
      getBusinessData();
    }
  }, [dToken]);

  useEffect(() => {
    if (Array.isArray(businessData)) {
      console.log("Fetched business data (from context):", businessData);
      const initialStates = businessData.map((b) => ({
        fees: b.fees || "",
        address: {
          line1: b.address?.line1 || "",
          line2: b.address?.line2 || "",
        },
        available: b.available || false,
      }));
      setFormStates(initialStates);
    }
  }, [businessData]);

  const updateProfile = async (index) => {
    try {
      const formData = formStates[index];
      const businessId = businessData[index]._id; // Get business _id

      const updateData = {
        businessId,
        fees: Number(formData.fees),
        address: {
          line1: formData.address.line1,
          line2: formData.address.line2,
        },
        available: formData.available,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/staff/updateStaffBusiness`,
        updateData
        // No headers needed here
      );

      if (data.success) {
        toast.success(data.message);
        getBusinessData(); // Refresh updated data
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Frontend error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Profile update error");
    }
  };

  // Inside your component render or return
  if (!Array.isArray(businessData)) {
    return (
      <div className="p-5">
        <TopLoadingBar />
        <p className="text-center text-gray-600 mt-4 italic">
          No business profile found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {profileData && (
        <div className="p-5 bg-gray-100 rounded mb-5 shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {profileData.name}
          </h2>
          <p className="text-sm text-gray-600">{profileData.email}</p>
          <p className="text-sm text-gray-600 capitalize">{profileData.role}</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {businessData.map((business, index) => {
          const formData = formStates[index] || {
            fees: "",
            address: { line1: "", line2: "" },
            available: false,
          };

          return (
            <div
              key={business._id || index}
              className="bg-white rounded-xl shadow-md p-4 w-full max-w-md mx-auto flex flex-col gap-3 border"
            >
              <img
                className="w-full h-40 object-cover rounded-lg"
                src={business.image}
                alt="Profile"
              />

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-800">
                  {business.business_name}
                </h2>
                <p className="text-sm text-gray-500">
                  {business.pStaff_name} - {business.speciality}
                </p>
                <p className="text-xs text-gray-600 border px-2 py-0.5 inline-block rounded-full">
                  {business.experience}
                </p>
              </div>

              <div className="text-sm text-gray-700">
                <strong>About:</strong>{" "}
                {formStates[index]?.showFullAbout
                  ? business.about
                  : business.about?.split(" ").slice(0, 20).join(" ") +
                    (business.about?.split(" ").length > 20 ? "..." : "")}
                {business.about?.split(" ").length > 20 && (
                  <button
                    className="text-blue-600 ml-2 text-xs underline"
                    onClick={() =>
                      setFormStates((prev) => {
                        const updated = [...prev];
                        updated[index].showFullAbout =
                          !updated[index].showFullAbout;
                        return updated;
                      })
                    }
                  >
                    {formStates[index]?.showFullAbout ? "Show Less" : "More"}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fees:
                </label>
                <input
                  type="number"
                  value={formStates[index]?.fees}
                  onChange={(e) => {
                    const updated = [...formStates];
                    updated[index].fees = e.target.value;
                    setFormStates(updated);
                  }}
                  className="mt-1 border rounded w-full px-2 py-1 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formStates[index]?.available}
                  onChange={() => {
                    const updated = [...formStates];
                    updated[index].available = !updated[index].available;
                    setFormStates(updated);
                  }}
                />
                <label className="text-sm">Available</label>
              </div>

              <button
                onClick={() => updateProfile(index)}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffProfile;

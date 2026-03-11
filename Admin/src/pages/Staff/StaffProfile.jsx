import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import axios from "axios";
import TopLoadingBar from "../../components/TopLoadingBar";
import { User, Mail, Shield, DollarSign, CheckCircle2, XCircle, Settings2, Info } from "lucide-react";
import MoveUpOnRender from "../../components/MoveUpOnRender";

const StaffProfile = () => {
  const { dToken, backendUrl, businessData, getBusinessData, profileData } =
    useContext(StaffContext);

  const { currency } = useContext(AppContext);

  const [formStates, setFormStates] = useState([]);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    if (dToken) {
      getBusinessData();
    }
  }, [dToken, getBusinessData]);

  useEffect(() => {
    if (Array.isArray(businessData)) {
      const initialStates = businessData.map((b) => ({
        fees: b.fees || "",
        address: {
          line1: b.address?.line1 || "",
          line2: b.address?.line2 || "",
        },
        available: b.available || false,
        showFullAbout: false
      }));
      setFormStates(initialStates);
    }
  }, [businessData]);

  const updateProfile = async (index) => {
    try {
      setIsUpdating(index);
      const formData = formStates[index];
      const businessId = businessData[index]._id;

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
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        getBusinessData();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Frontend error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Profile update error");
    } finally {
      setIsUpdating(null);
    }
  };

  if (!Array.isArray(businessData) || businessData.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <TopLoadingBar />
        <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
          <Settings2 size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Business Profiles</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          You don't have any business profiles assigned to your account yet.
        </p>
      </div>
    );
  }

  return (
    <MoveUpOnRender id="staff-profile">
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Hero Profile Section */}
          {profileData && (
            <div className="relative mb-10 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                  <User size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Welcome, {profileData.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {profileData.email}</span>
                    <span className="flex items-center gap-1.5 capitalize"><Shield size={14} /> {profileData.role}</span>
                  </div>
                </div>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Assigned Services</h2>
            <p className="text-sm text-slate-500">{businessData.length} Profiles Found</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {businessData.map((business, index) => {
              const formData = formStates[index];
              if (!formData) return null;

              return (
                <div
                  key={business._id || index}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image & Status Overlay */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={business.image}
                      alt={business.business_name}
                    />
                    <div className="absolute left-4 top-4">
                      {formData.available ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          <XCircle size={12} /> Offline
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{business.service_name || business.business_name}</h3>
                          <p className="text-sm font-medium text-slate-500">{business.speciality}</p>
                        </div>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {business.experience} Exp
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        <Info size={12} /> About Service
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {formData.showFullAbout
                          ? business.about
                          : business.about?.split(" ").slice(0, 18).join(" ") + (business.about?.split(" ").length > 18 ? "..." : "")}
                        {business.about?.split(" ").length > 18 && (
                          <button
                            className="ml-2 font-bold text-slate-900 hover:underline"
                            onClick={() =>
                              setFormStates((prev) => {
                                const updated = [...prev];
                                updated[index].showFullAbout = !updated[index].showFullAbout;
                                return updated;
                              })
                            }
                          >
                            {formData.showFullAbout ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Edit Form */}
                    <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
                      <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                        <div className="flex-1">
                          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Service Fees ({currency})
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-slate-400">
                            <DollarSign size={14} className="text-slate-400 mr-1" />
                            <input
                              type="number"
                              value={formData.fees}
                              onChange={(e) => {
                                const updated = [...formStates];
                                updated[index].fees = e.target.value;
                                setFormStates(updated);
                              }}
                              className="h-10 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 h-10 px-1">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formStates];
                              updated[index].available = !updated[index].available;
                              setFormStates(updated);
                            }}
                            className={`h-6 w-11 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${formData.available ? 'bg-green-500' : 'bg-slate-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${formData.available ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-sm font-medium text-slate-700">Available</span>
                        </div>
                      </div>

                      <button
                        onClick={() => updateProfile(index)}
                        disabled={isUpdating === index}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        {isUpdating === index ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default StaffProfile;

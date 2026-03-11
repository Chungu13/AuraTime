import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "sonner";
import axios from "axios";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import { ImagePlus, MapPin, DollarSign, Clock3, Sparkles, FileText } from "lucide-react";

const initialValues = {
  service_name: "",
  fees: "",
  bookingFee: "", // Added booking fee field
  about: "",
  speciality: "Facial",
  serviceDuration: "",
};

const AddService = () => {
  const [docImg, setDocImg] = useState(null);
  const [businessData, setBusinessData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { backendUrl, aToken, getAllProfessionalStaff, professionalStaffs } =
    useContext(AdminContext);

  useEffect(() => {
    if (Array.isArray(professionalStaffs) && professionalStaffs.length === 0) {
      getAllProfessionalStaff();
    }
  }, [getAllProfessionalStaff, professionalStaffs]);

  const validateForm = () => {
    const newErrors = {};
    if (!businessData.service_name.trim()) newErrors.service_name = "Service name is required";
    if (!businessData.fees || Number(businessData.fees) <= 0) newErrors.fees = "Please enter a valid fee";
    if (businessData.bookingFee === "" || Number(businessData.bookingFee) < 0) {
      newErrors.bookingFee = "Please enter a valid booking fee (0 or more)";
    } else if (Number(businessData.bookingFee) > Number(businessData.fees)) {
      newErrors.bookingFee = "Deposit cannot be greater than total fee";
    }
    if (!businessData.serviceDuration || Number(businessData.serviceDuration) <= 0) newErrors.serviceDuration = "Please enter a valid duration";
    if (!businessData.about.trim()) {
      newErrors.about = "Please provide a description";
    } else if (businessData.about.length < 10) {
      newErrors.about = "Description is too short (min 10 characters)";
    }
    if (!docImg) newErrors.image = "Service image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("image", docImg);

      Object.entries(businessData).forEach(([key, value]) =>
        formData.append(key, (key === "fees" || key === "bookingFee" || key === "serviceDuration") ? Number(value) : value)
      );

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-service`,
        formData,
        {
          headers: { aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setBusinessData(initialValues);
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong while adding the service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MoveUpOnRender id="admin-addservice">
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleOnSubmit} className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">Service Management</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Add Business Service
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new service offering with pricing, duration, image, and description.
            </p>
          </div>

          {/* Main card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Top section */}
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Upload */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-800">Service Image</p>

                  <label
                    htmlFor="doc-img"
                    className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${errors.image ? 'border-red-300 bg-red-50/50 hover:border-red-400' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}
                  >
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${errors.image ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                      {docImg ? (
                        <img
                          src={URL.createObjectURL(docImg)}
                          alt="Preview"
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <ImagePlus size={28} />
                      )}
                    </div>

                    <p className={`text-sm font-medium ${errors.image ? 'text-red-700' : 'text-slate-800'}`}>
                      {docImg ? "Change service image" : "Upload service image"}
                    </p>
                    <p className={`mt-1 text-xs ${errors.image ? 'text-red-500' : 'text-slate-500'}`}>
                      {errors.image || "PNG, JPG or JPEG"}
                    </p>
                  </label>
                  <input
                    id="doc-img"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      setDocImg(e.target.files[0]);
                      if (errors.image) setErrors(prev => ({ ...prev, image: "" }));
                    }}
                  />
                </div>

                {/* Quick fields */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Service Name
                    </label>
                    <div className={`flex items-center rounded-xl border transition-colors bg-white px-3 ${errors.service_name ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400'}`}>
                      <Sparkles size={16} className={`mr-2 ${errors.service_name ? 'text-red-400' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        name="service_name"
                        value={businessData.service_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Classic Facial"
                        className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </div>
                    {errors.service_name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.service_name}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Total Fees
                    </label>
                    <div className={`flex items-center rounded-xl border transition-colors bg-white px-3 ${errors.fees ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400'}`}>
                      <DollarSign size={16} className={`mr-2 ${errors.fees ? 'text-red-400' : 'text-slate-400'}`} />
                      <input
                        type="number"
                        name="fees"
                        value={businessData.fees}
                        onChange={handleInputChange}
                        placeholder="e.g. 100"
                        className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </div>
                    {errors.fees && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fees}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Booking Fee (Stripe Deposit)
                    </label>
                    <div className={`flex items-center rounded-xl border transition-colors bg-white px-3 ${errors.bookingFee ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400'}`}>
                      <DollarSign size={16} className={`mr-2 ${errors.bookingFee ? 'text-red-400' : 'text-slate-400'}`} />
                      <input
                        type="number"
                        name="bookingFee"
                        value={businessData.bookingFee}
                        onChange={handleInputChange}
                        placeholder="e.g. 25"
                        className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </div>
                    {errors.bookingFee && <p className="text-xs text-red-500 mt-1 ml-1">{errors.bookingFee}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Service Type
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-white px-3 focus-within:border-slate-400">
                      <select
                        name="speciality"
                        value={businessData.speciality}
                        onChange={handleInputChange}
                        className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
                      >
                        <option value="Facial">Facial</option>
                        <option value="Massage">Massage</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Duration (minutes)
                    </label>
                    <div className={`flex items-center rounded-xl border transition-colors bg-white px-3 ${errors.serviceDuration ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus-within:border-slate-400'}`}>
                      <Clock3 size={16} className={`mr-2 ${errors.serviceDuration ? 'text-red-400' : 'text-slate-400'}`} />
                      <input
                        type="number"
                        name="serviceDuration"
                        value={businessData.serviceDuration}
                        onChange={handleInputChange}
                        placeholder="e.g. 60"
                        className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </div>
                    {errors.serviceDuration && <p className="text-xs text-red-500 mt-1 ml-1">{errors.serviceDuration}</p>}
                  </div>

                </div>
              </div>
            </div>

            {/* About section */}
            <div className="px-6 py-6 sm:px-8">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText size={16} className={errors.about ? 'text-red-400' : 'text-slate-400'} />
                About This Service
              </label>
              <textarea
                name="about"
                value={businessData.about}
                onChange={handleInputChange}
                rows={6}
                placeholder="Describe the service, what clients should expect, benefits, and any important details..."
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 resize-none ${errors.about ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-slate-400'}`}
              />
              {errors.about && <p className="text-xs text-red-500 mt-2 ml-1">{errors.about}</p>}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm text-slate-500">
                Make sure the price, duration, and image are correct before saving.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding Service..." : "Add Service"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </MoveUpOnRender>
  );
};

export default AddService;
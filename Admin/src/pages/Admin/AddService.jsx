import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

import axios from "axios";
import MoveUpOnRender from "../../components/MoveUpOnRender";

const initialValues = {
  service_name: "",
  fees: "",
  about: "",
  speciality: "Facial",
  address: "",
  serviceDuration: "",
};

const AddService = () => {
  const [docImg, setDocImg] = useState(null);
  const [businessData, setBusinessData] = useState(initialValues);

  const { backendUrl, aToken, getAllProfessionalStaff, professionalStaffs } =
    useContext(AdminContext);

  useEffect(() => {
    if (Array.isArray(professionalStaffs) && professionalStaffs.length === 0) {
      getAllProfessionalStaff();
    }
  }, [getAllProfessionalStaff, professionalStaffs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({ ...businessData, [name]: value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) return toast.error("Please upload a service image");

      const formData = new FormData();
      formData.append("image", docImg);
      Object.entries(businessData).forEach(([key, value]) =>
        formData.append(key, key === "fees" ? Number(value) : value),
      );

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-business`,
        formData,
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setBusinessData(initialValues);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <MoveUpOnRender id="admin-adddoctor">
      <form
        onSubmit={handleOnSubmit}
        className="m-6 max-w-5xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {" "}
          Add Business Service
        </h2>

        <div className="bg-white p-8 rounded-lg border shadow-md space-y-8">
          {/* Image Upload */}
          <div className="flex items-center gap-6">
            <label htmlFor="doc-img" className="cursor-pointer">
              <img
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
                src={
                  docImg ? URL.createObjectURL(docImg) : assets.pictureupload
                }
                alt="Upload Preview"
              />
            </label>
            <input
              id="doc-img"
              type="file"
              hidden
              onChange={(e) => setDocImg(e.target.files[0])}
            />
            <span className="text-gray-700 font-medium">
              Upload Service Image
            </span>
          </div>

          {/* Service Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Service Name
              </label>
              <input
                type="text"
                name="service_name"
                value={businessData.service_name}
                onChange={handleInputChange}
                placeholder="e.g. Classic Facial"
                required
                className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-beige focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Fees ($)
              </label>
              <input
                type="number"
                name="fees"
                value={businessData.fees}
                onChange={handleInputChange}
                placeholder="e.g. 50"
                required
                className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-beige focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                name="speciality"
                value={businessData.speciality}
                onChange={handleInputChange}
                className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-beige focus:outline-none"
              >
                <option value="Facial">Facial</option>
                <option value="Massage">Massage</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="text"
                name="serviceDuration"
                value={businessData.serviceDuration}
                onChange={handleInputChange}
                placeholder="e.g. 60"
                required
                className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-beige focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={businessData.address}
                onChange={handleInputChange}
                placeholder="Enter business address"
                required
                className="mt-1 w-full border px-4 py-2 rounded-md focus:ring-beige focus:outline-none"
              />
            </div>
          </div>

          {/* About Field */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              About This Service
            </label>
            <textarea
              name="about"
              value={businessData.about}
              onChange={handleInputChange}
              rows={5}
              placeholder="Describe this service..."
              required
              className="mt-1 w-full border px-4 py-2 rounded-md resize-none focus:ring-beige focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="bg-beige hover:bg-beige/90 text-white px-8 py-3 rounded-full font-semibold shadow transition duration-200"
            >
              Add Service
            </button>
          </div>
        </div>
      </form>
    </MoveUpOnRender>
  );
};

export default AddService;

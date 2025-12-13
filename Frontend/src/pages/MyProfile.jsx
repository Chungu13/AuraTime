import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import MoveUpOnRender from "../components/MoveUpOnRender";

const MyProfile = () => {
  const { backendUrl, token, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        loadUserProfileData();
        setEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <MoveUpOnRender id="my-profile">
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl text-sm text-gray-700">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            {isEdit ? (
              <label htmlFor="image" className="relative cursor-pointer">
                <img
                  className="w-32 h-32 object-cover rounded-full opacity-80 hover:opacity-100 transition"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="profile"
                />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                  <img className="w-6" src={assets.user} alt="edit" />
                </div>
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                className="w-32 h-32 object-cover rounded-full"
                src={userData.image}
                alt="profile"
              />
            )}
            {isEdit ? (
              <input
                className="text-2xl font-semibold capitalize bg-gray-50 p-1 rounded focus:outline-none"
                value={userData.name}
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h2 className="text-2xl font-semibold capitalize text-black">
                {userData.name}
              </h2>
            )}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold text-gray-500 mb-2">
              CONTACT INFORMATION
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <p className="w-24 font-medium">Email:</p>
                <p>{userData.email}</p>
              </div>
              <div className="flex gap-4">
                <p className="w-24 font-medium">Phone:</p>
                {isEdit ? (
                  <input
                    className="bg-gray-100 px-2 py-1 rounded"
                    value={userData.phone}
                    type="text"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p>{userData.phone}</p>
                )}
              </div>
              <div className="flex gap-4">
                <p className="w-24 font-medium">Address:</p>
                {isEdit ? (
                  <div className="flex flex-col gap-1">
                    <input
                      className="bg-gray-100 px-2 py-1 rounded"
                      value={userData.address?.line1}
                      type="text"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                    />
                    <input
                      className="bg-gray-100 px-2 py-1 rounded"
                      value={userData.address?.line2}
                      type="text"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <p>
                    {userData.address.line1}
                    <br />
                    {userData.address.line2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-500 mb-2">
              BASIC INFORMATION
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <p className="w-24 font-medium">Gender:</p>
                {isEdit ? (
                  <select
                    className="bg-gray-100 px-2 py-1 rounded"
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="female">Female</option>
                  </select>
                ) : (
                  <p>{userData.gender}</p>
                )}
              </div>
              <div className="flex gap-4">
                <p className="w-24 font-medium">Birthday:</p>
                {isEdit ? (
                  <input
                    className="bg-gray-100 px-2 py-1 rounded"
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p>{userData.dob}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10 text-right">
            {isEdit ? (
              <button
                className="bg-beige text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                onClick={updateUserProfileData}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="border border-beige text-beige px-6 py-2 rounded-full hover:bg-beige hover:text-white transition"
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </MoveUpOnRender>
    )
  );
};

export default MyProfile;

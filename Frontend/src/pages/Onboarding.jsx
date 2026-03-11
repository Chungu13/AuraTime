import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { User, Phone, MapPin, Calendar, Camera, ChevronRight, Check } from "lucide-react";

const Onboarding = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        gender: "",
        dob: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userData) {
            const isComplete =
                userData.gender !== "Not selected" &&
                userData.dob !== "Not selected" &&
                userData.phone !== "000000000" &&
                userData.address?.line1;

            if (isComplete) {
                navigate("/", { replace: true });
            }
        }
    }, [userData, navigate]);

    const validateStep = (currentStep) => {
        let newErrors = {};
        if (currentStep === 1) {
            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required";
            } else {
                const cleanPhone = formData.phone.replace(/\s/g, '');
                if (!/^(97|96|95|77|76|75)\d{7}$/.test(cleanPhone)) {
                    newErrors.phone = "Enter a valid Zambian mobile number (9 digits)";
                }
            }
            if (!formData.dob) newErrors.dob = "Date of birth is required";
            if (!formData.gender) newErrors.gender = "Gender is required";
        } else if (currentStep === 2) {
            if (!formData.address.trim()) newErrors.address = "Address is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;

        setLoading(true);
        try {
            const uploadData = new FormData();
            uploadData.append("name", userData.name); // Keep existing name
            const cleanPhone = formData.phone.replace(/\s/g, '');
            const fullPhone = `+260${cleanPhone}`;
            uploadData.append("phone", fullPhone);
            uploadData.append("address", JSON.stringify({ line1: formData.address, line2: "N/A" }));
            uploadData.append("gender", formData.gender);
            uploadData.append("dob", formData.dob);
            if (image) uploadData.append("image", image);

            const { data } = await axios.post(backendUrl + "/api/user/update-profile", uploadData, {
                headers: { token },
            });

            if (data.success) {
                toast.success("Profile completed! Welcome to AuraTime.");
                await loadUserProfileData();
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const maxDate = `${currentYear - 5}-12-31`; // Minimum 5 years old

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
            <MoveUpOnRender id="onboarding">
                <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#E8E8E1]">
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#F0F0E8] flex">
                        <div
                            className="h-full bg-beige transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 sm:p-12">
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold text-[#1A1A18] tracking-tight mb-2">
                                {step === 1 && "Personal Details"}
                                {step === 2 && "Address Information"}
                                {step === 3 && "Profile Picture"}
                            </h1>
                            <p className="text-[#6B6B5E] text-sm">
                                Step {step} of 3 • {step === 1 ? "Tell us a bit about yourself" : step === 2 ? "Where can we find you?" : "Add a face to your account"}
                            </p>
                        </div>

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#9E9E8C] ml-1">Phone Number</label>
                                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.phone ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                                        <Phone className="text-[#9E9E8C]" size={18} />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#9E9E8C] font-bold border-r border-[#E8E8E1] pr-2">+260</span>
                                            <input
                                                type="tel"
                                                placeholder="971 234 567"
                                                maxLength={11} // Allow spaces in typing but clean later
                                                className="bg-transparent w-full outline-none text-[#1A1A18] font-medium"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    // Only allow numbers and spaces
                                                    const value = e.target.value.replace(/[^0-9 ]/g, '');
                                                    setFormData({ ...formData, phone: value });
                                                    if (errors.phone) setErrors({ ...errors, phone: "" });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.phone}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#9E9E8C] ml-1">Date of Birth</label>
                                        <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.dob ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                                            <Calendar className="text-[#9E9E8C]" size={18} />
                                            <input
                                                type="date"
                                                max={maxDate}
                                                className="bg-transparent w-full outline-none text-[#1A1A18] font-medium"
                                                value={formData.dob}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, dob: e.target.value });
                                                    if (errors.dob) setErrors({ ...errors, dob: "" });
                                                }}
                                            />
                                        </div>
                                        {errors.dob && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.dob}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#9E9E8C] ml-1">Gender</label>
                                        <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.gender ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                                            <User className="text-[#9E9E8C]" size={18} />
                                            <select
                                                className="bg-transparent w-full outline-none text-[#1A1A18] font-medium appearance-none"
                                                value={formData.gender}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, gender: e.target.value });
                                                    if (errors.gender) setErrors({ ...errors, gender: "" });
                                                }}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        {errors.gender && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.gender}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#9E9E8C] ml-1">Physical Address</label>
                                    <div className={`flex items-center gap-3 p-4 bg-[#F9F9F6] border rounded-2xl transition-all ${errors.address ? 'border-red-400 ring-2 ring-red-50' : 'border-[#E8E8E1] focus-within:border-beige focus-within:ring-4 focus-within:ring-beige/5'}`}>
                                        <MapPin className="text-[#9E9E8C]" size={18} />
                                        <input
                                            type="text"
                                            placeholder="House No, Street Name, Area, City"
                                            className="bg-transparent w-full outline-none text-[#1A1A18] font-medium"
                                            value={formData.address}
                                            onChange={(e) => {
                                                setFormData({ ...formData, address: e.target.value });
                                                if (errors.address) setErrors({ ...errors, address: "" });
                                            }}
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.address}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Profile Picture */}
                        {step === 3 && (
                            <div className="flex flex-col items-center justify-center space-y-8">
                                <div className="relative">
                                    <div className="w-40 h-40 rounded-full border-4 border-[#E8E8E1] p-1 overflow-hidden bg-[#F9F9F6] flex items-center justify-center">
                                        {image ? (
                                            <img src={URL.createObjectURL(image)} className="w-full h-full object-cover rounded-full" alt="Preview" />
                                        ) : (
                                            <Camera size={48} className="text-[#9E9E8C]" />
                                        )}
                                    </div>
                                    <label htmlFor="image-upload" className="absolute bottom-1 right-1 bg-beige text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                        <Camera size={20} />
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>
                                <div className="text-center max-w-sm">
                                    <h3 className="font-bold text-[#1A1A18] mb-1">Upload a photo</h3>
                                    <p className="text-sm text-[#6B6B5E]">This helps staff identify you during your appointment. You can skip this if you like.</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex gap-4">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-[#6B6B5E] border border-[#E8E8E1] hover:bg-[#F9F9F6] transition-all"
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex-[2] bg-beige text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-beige/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] bg-[#1A1A18] text-white px-6 py-4 rounded-2xl font-bold hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Complete Setup <Check size={18} /></>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </MoveUpOnRender>
        </div>
    );
};

export default Onboarding;

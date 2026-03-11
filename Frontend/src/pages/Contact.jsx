import { MessageCircle, Phone, Mail } from "lucide-react";
import MoveUpOnRender from "../components/MoveUpOnRender";

const Contact = () => {
  const phoneNumber = "+60123456789"; // Replace with your actual business number
  const whatsappNumber = "60123456789"; // Format: countrycode + number (no + or 0)
  const businessEmail = "hello@auratime.com";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FAFAF8]">
      <MoveUpOnRender id="contact-container">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-[#E8E8E1] p-10 sm:p-14 text-center">
          <div className="mb-10">
            <div className="w-16 h-16 bg-beige/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-beige" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A18] tracking-tight mb-3">Get in Touch</h1>
            <p className="text-[#6B6B5E] text-sm font-medium">
              Have questions? We're here to help you on your wellness journey.
            </p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20AuraTime!%20I'd%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:bg-[#20bd5a] transition-all active:scale-[0.98] shadow-lg shadow-green-500/10"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>

            {/* Phone Button */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-3 w-full bg-[#1A1A18] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-black/10"
            >
              <Phone size={20} />
              Call Us Now
            </a>

            {/* Email (Optional link) */}
            <div className="pt-8 border-t border-[#E8E8E1] mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E9E8C] mb-4">Or email us at</p>
              <a
                href={`mailto:${businessEmail}`}
                className="text-beige font-bold hover:underline flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                {businessEmail}
              </a>
            </div>
          </div>
        </div>
      </MoveUpOnRender>
    </div>
  );
};

export default Contact;

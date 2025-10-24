import Title from './../components/Title';
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    agree: false
  });

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name" && /[^a-zA-Z\s]/.test(value)) return;
    if (name === "phone" && (/[^0-9]/.test(value) || value.length > 10)) return;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.phone && formData.phone.length !== 10)
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.agree) newErrors.agree = "You must agree before sending";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setPopup({ show: true, message: "✅ Message sent successfully!" });
        setFormData({ name: "", email: "", phone: "", company: "", message: "", agree: false });
        setErrors({});
      } else {
        setPopup({ show: true, message: "❌ Failed to send message." });
      }
    } catch (err) {
      console.error(err);
      setPopup({ show: true, message: "⚠️ Something went wrong." });
    }
  };

  const closePopup = () => setPopup({ show: false, message: "" });

  const infoCards = [
    { icon: <Phone className="w-6 h-6 text-blue-500" />, title: "Phone", details: ["+91 9866631233"] },
    { icon: <Mail className="w-6 h-6 text-green-500" />, title: "Email", details: ["kestondairy@gmail.com"] },
    { icon: <MapPin className="w-6 h-6 text-blue-600" />, title: "Address", details: ["New Bowenpally 4 Soujanja colony, Akashnagar, Secunderabad, India, Telangana"] },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-5 sm:px-10 lg:px-20 relative">
      {/* Page Title */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 tracking-wide">Get in Touch</h1>
        <p className="mt-3 text-gray-700 max-w-xl mx-auto text-lg md:text-xl font-medium">
          We’re here to help! Fill out the form below and our team will respond as quickly as possible.
        </p>
      </div>

      {/* Gradient Background Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-400/40 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-72 h-72 bg-green-400/30 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto relative z-10">
        {/* Left Image - smaller */}
        <div className="lg:w-1/3">
          <img
            src="src/components/images/contact-image.png"
            alt="Contact Us"
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Right Section - larger */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 transition-transform duration-300 hover:scale-105 hover:shadow-2xl break-words group"
              >
                <div className="flex items-center gap-2 mb-2">{card.icon}<p className="text-lg font-semibold text-black">{card.title}</p></div>
                {card.details.map((d, i) => (
                  <p key={i} className="text-black/80 mt-1 break-words">{d}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-10 border border-white/30 transition-shadow duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-center mb-6 text-black">Send us a message</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[ 
                { name: "name", label: "Your Name", type: "text", placeholder: "Enter your full name" },
                { name: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
                { name: "phone", label: "Phone Number", type: "text", placeholder: "Enter your phone number" },
                { name: "company", label: "Company Name", type: "text", placeholder: "Enter your company name" },
              ].map((input, idx) => (
                <div key={idx} className="relative group">
                  <label className="text-black text-sm">{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    className={`w-full bg-white/20 text-black placeholder-black/50 border ${errors[input.name] ? 'border-red-500' : 'border-white/30'} rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 group-hover:scale-[1.02]`}
                  />
                  {errors[input.name] && <p className="text-red-500 text-xs mt-1">{errors[input.name]}</p>}
                </div>
              ))}

              {/* Message */}
              <div className="md:col-span-2 relative group">
                <label className="text-black text-sm">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows="6"
                  className={`w-full bg-white/20 text-black placeholder-black/50 border ${errors.message ? 'border-red-500' : 'border-white/30'} rounded px-3 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 group-hover:scale-[1.02]`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Checkbox */}
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className={`accent-green-500 ${errors.agree ? 'ring-2 ring-red-400' : ''}`}
                />
                <label className="text-black">I agree to send this message</label>
              </div>
              {errors.agree && <p className="text-red-500 text-xs mt-1 md:col-span-2">{errors.agree}</p>}

              {/* Submit Button */}
              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-10 py-3 rounded-lg hover:from-blue-600 hover:to-green-500 transition-all duration-300 mt-2"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animated Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center transform transition-all duration-300 scale-95 animate-popup">
            <p className="text-black mb-4">{popup.message}</p>
            <button
              onClick={closePopup}
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-green-500 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;

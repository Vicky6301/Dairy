// src/components/DairyHeroBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import milk_spill from "./images/milk_spill.png";
import milkVideo from "./images/video.mp4";

const DairyHeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden">
      {/* HERO SECTION */}
      <div className="relative flex flex-col-reverse md:flex-row items-center justify-between w-full h-[80vh] md:h-[90vh] px-6 md:px-20 bg-gradient-to-r from-green-50 to-sky-50 overflow-hidden">
        
        {/* Left Hero Text */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center items-start z-20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-700 mb-4 leading-snug">
            Fresh & <span className="text-blue-500">Nutritious</span> Dairy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 max-w-lg">
            Experience farm-fresh milk, creamy yogurt, and delightful ice creams delivered to your doorstep.
          </p>
          <motion.button
            onClick={() => navigate("/collection")}
            className="bg-gradient-to-r from-green-500 to-blue-400 text-white px-8 py-4 rounded-3xl font-bold shadow-lg hover:shadow-2xl transition-transform duration-500"
            whileHover={{ scale: 1.08, boxShadow: "0px 12px 25px rgba(0,0,0,0.35)" }}
          >
            SHOP NOW
          </motion.button>
        </motion.div>

        {/* Right Hero Image */}
        <motion.div
          className="w-full md:w-1/2 relative z-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={assets.hero_img}
            alt="Premium Dairy"
            className="w-full h-[70vh] md:h-[90vh] object-cover rounded-3xl shadow-2xl border-4 border-white/40"
          />
          {/* Milk Spill Animation */}
          <motion.img
            src={milk_spill}
            alt=""
            className="absolute bottom-0 left-0 w-full h-auto opacity-90"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* VIDEO & FRESH MILK DELIVERY */}
      <div className="relative py-20 px-6 sm:px-12 lg:px-20 bg-white">
        {/* Floating decorative circles */}
        <div className="absolute -top-16 left-10 w-48 h-48 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-16 right-10 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <motion.div
            className="rounded-3xl overflow-hidden shadow-2xl border border-white/30 bg-white/40 backdrop-blur-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <video
              src={milkVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
              Fresh Milk Delivery
            </h2>
            <p className="text-gray-700 mb-6 text-lg sm:text-xl max-w-md mx-auto lg:mx-0">
              Farm-fresh milk delivered daily to your home. Happy cows, careful packing, and guaranteed freshness.
            </p>
            <motion.button
              onClick={() => navigate("/collection")}
              className="bg-gradient-to-r from-green-500 to-blue-400 text-white px-8 py-4 rounded-3xl font-bold shadow-lg hover:shadow-2xl transition-all duration-500"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
            >
              ORDER NOW
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* STATISTICS / NUMBERS */}
     <div className="py-20 px-6 sm:px-12 lg:px-20 relative bg-gradient-to-r from-blue-100 via-teal-100 to-green-100">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
    {[
      { icon: "👥", value: "10M", label: "Consumers Daily" },
      { icon: "🏬", value: "850+", label: "Heritage Parlours" },
      { icon: "🐄", value: "3,00,000+", label: "Farmers Supply Milk" },
      { icon: "🛒", value: "1,80,000", label: "Retail Outlets" },
    ].map((stat, idx) => (
      <motion.div
        key={idx}
        className="bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-500 border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2, duration: 0.8 }}
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-green-200 to-blue-200 text-3xl mb-4 shadow-inner">
          {stat.icon}
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</h3>
        <p className="text-gray-700 text-center">{stat.label}</p>
      </motion.div>
    ))}
  </div>
</div>

    </section>
  );
};

export default DairyHeroBanner;

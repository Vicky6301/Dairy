// src/components/AboutUs.jsx
import React, { useRef, useEffect, useState } from "react";
import { assets } from "./../assets/assets";
import { motion, useAnimation, useInView } from "framer-motion";

const AboutUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Parallax effect
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOffsetY(-rect.top * 0.08); // adjust intensity
    }
  };

  useEffect(() => {
    if (inView) controls.start("visible");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [inView, controls]);

  const imageVariant = { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } };
  const contentVariant = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } };
  const listVariant = { hidden: { opacity: 0, x: 50 }, visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.15, duration: 0.6 } }) };

  return (
    <section className="relative py-20 bg-gradient-to-b from-sky-50 via-green-50 to-white overflow-hidden" ref={ref}>
      
      {/* Cloudy/Milk background shapes */}
      <div className="absolute top-[-120px] left-[-100px] w-80 h-80 bg-white/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-[-60px] right-[-80px] w-96 h-96 bg-white/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-100px] left-[-70px] w-72 h-72 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-60px] w-64 h-64 bg-white/40 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto px-5 sm:px-10 lg:px-20 relative z-10">

        {/* Section Headline */}
        <div className="text-center mb-14">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-extrabold text-sky-700"
          >
            Fresh & Nutritious Dairy Products
          </motion.h3>
          <motion.div
            className="w-24 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-green-400 via-sky-400 to-green-500"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left side - Image */}
          <motion.div
            className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-md"
            variants={imageVariant}
            initial="hidden"
            animate={controls}
            style={{ y: offsetY }}
          >
            <img
              src={assets.about_img}
              alt="About Us"
              className="object-cover w-full h-[400px] hover:scale-105 transition-transform duration-500 rounded-xl"
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            variants={contentVariant}
            initial="hidden"
            animate={controls}
          >
            <h2 className="text-4xl sm:text-3xl font-bold text-green-600 mb-4">Quality You Can Trust</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              At <span className="font-semibold text-sky-600">Saraswati Dairy Products</span>, we provide premium dairy delights — from farm-fresh milk to wholesome cheese, creamy yogurt, and delightful ice creams. Our promise is purity, nutrition, and taste with every sip and bite.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 text-gray-800">
              {[
                { text: "100% Pure & Fresh Dairy", color: "#38a169" },
                { text: "Eco-friendly & Hygienic Packaging", color: "#0ea5e9" },
                { text: "Trusted Farms & Sustainable Practices", color: "#16a34a" },
                { text: "Healthy, Nutritious & Delicious", color: "#3b82f6" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={listVariant}
                  initial="hidden"
                  animate={controls}
                  className="flex items-center gap-3"
                >
                  <span
                    className="w-5 h-5 flex items-center justify-center text-white text-xs rounded-full"
                    style={{ backgroundColor: item.color }}
                  >
                    ✓
                  </span>
                  {item.text}
                </motion.li>
              ))}
            </ul>

            {/* Button */}
            <motion.button
              className="mt-8 bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.08 }}
              onClick={() => window.location.href = "/about"}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

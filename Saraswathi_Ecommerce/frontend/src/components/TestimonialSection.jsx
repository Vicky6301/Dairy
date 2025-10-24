// src/components/TestimonialSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../config";
import { Smile } from "lucide-react";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/testimonials`);
        if (data.success) setTestimonials(data.testimonials);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };

    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-24 bg-gradient-to-br from-sky-50 via-green-50 to-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-sky-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg font-medium text-gray-600"
          >
            {testimonials.length}+ people have shared their experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-3 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-green-500 to-sky-600 bg-clip-text text-transparent"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        {/* Auto-scroll carousel */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-33%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 18,
              ease: "linear",
            }}
          >
            {testimonials.concat(testimonials).map((t, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full md:w-80 lg:w-96 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-lg rounded-3xl p-8 hover:shadow-2xl transition duration-500 transform hover:-translate-y-2"
              >
                <div className="flex flex-col justify-between h-full">
                  {/* Happy Customer Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <Smile className="text-green-500 w-5 h-5" />
                    <span className="text-green-600 font-medium">
                      Happy Customer
                    </span>
                  </div>

                  {/* Message */}
                  <blockquote className="text-gray-700 text-base italic leading-relaxed mb-6">
                    “{t.message}”
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center mt-auto">
                    <img
                      className="w-14 h-14 rounded-full object-cover border-2 border-green-400 shadow-sm"
                      src={
                        t.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={t.name}
                    />
                    <div className="ml-4 text-left">
                      <p className="font-bold text-gray-900 text-lg">
                        {t.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t.role || "Customer"}
                      </p>

                      {/* Rating Stars below name */}
                      <div className="flex mt-1">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-base">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

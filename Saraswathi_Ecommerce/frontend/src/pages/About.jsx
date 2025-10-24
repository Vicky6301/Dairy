// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import TestimonialSection from "../components/TestimonialSection"; 
import { 
  MilkIcon, 
  LeafIcon, 
  CheckCircleIcon, 
  UsersIcon, 
  ShoppingCartIcon, 
  AwardIcon 
} from "lucide-react"; // Install lucide-react if not already: npm i lucide-react
import { assets } from "../assets/assets";

const About = () => {
  const features = [
    { title: "100% Fresh Dairy", desc: "Directly sourced from trusted farms.", icon: MilkIcon },
    { title: "Sustainable Practices", desc: "Eco-friendly packaging & responsible farming.", icon: LeafIcon },
    { title: "Trusted Quality", desc: "Highest hygiene & taste standards.", icon: CheckCircleIcon },
  ];

  const values = [
    { title: "Purity & Freshness", desc: "Guaranteed fresh and pure.", icon: MilkIcon },
    { title: "Community & Sustainability", desc: "Supporting farmers and eco-practices.", icon: LeafIcon },
    { title: "Nutrition & Taste", desc: "Healthy & delicious dairy for all families.", icon: AwardIcon },
  ];

  const team = [
    { name: "Saraswathi R.", role: "Founder & CEO", img: assets.hero_img },
    { name: "Ramesh K.", role: "Operations Head", img: assets.hero_img },
    { name: "Anitha S.", role: "Quality Manager", img: assets.hero_img },
  ];

  const stats = [
    { label: "Products", value: "250+", icon: AwardIcon },
    { label: "Farmers", value: "50+", icon: UsersIcon },
    { label: "Happy Customers", value: "5000+", icon: ShoppingCartIcon },
  ];

  return (
    <main className="bg-gradient-to-b from-green-50 to-white font-sans">

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img src={assets.hero_img} alt="Dairy farms" className="absolute inset-0 w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-green-700/30 mix-blend-overlay"></div>
        <motion.div className="relative z-10 text-center px-6 sm:px-12">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg"
          >
            About Saraswathi Dairy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-lg sm:text-xl text-white max-w-2xl mx-auto drop-shadow-md"
          >
            Fresh, pure, and nutritious dairy products sourced responsibly and delivered with care.
          </motion.p>
        </motion.div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-12">
          <motion.img
            src={assets.about_img}
            alt="Our story"
            className="rounded-2xl shadow-2xl w-full md:w-1/2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="md:w-1/2 space-y-6 text-gray-800"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-green-700">Our Story</h2>
            <p>
              Saraswathi Dairy started with a vision to provide the freshest and purest dairy products to every household. Our journey began with a commitment to sustainability, ethical sourcing, and high-quality standards.
            </p>
            <p>
              Over the years, we partnered with local farmers, implemented modern hygiene practices, and ensured every product reaching your home is fresh, nutritious, and delicious.
            </p>
            <p>
              Our focus is not just on dairy, but on creating a healthier community and supporting the local economy sustainably.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES - WHY CHOOSE US ================= */}
      <section className="py-24 bg-green-50">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <f.icon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-700">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-12 text-center">Our Values</h2>
          {values.map((v, i) => (
            <motion.div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-12 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2 flex justify-center">
                <v.icon className="w-20 h-20 text-green-600" />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{v.title}</h3>
                <p className="text-gray-700">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SUSTAINABILITY & ECO PRACTICES ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-4">Sustainability & Eco Practices</h2>
            <p className="text-gray-700 mb-4">
              We prioritize eco-friendly packaging, reduce waste, and support sustainable farming practices.
            </p>
            <p className="text-gray-700">
              Every step of our supply chain is designed to minimize environmental impact while ensuring the freshest dairy for you.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <LeafIcon className="w-24 h-24 text-green-500" />
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY & FARMER SUPPORT ================= */}
      <section className="py-24 bg-green-50">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-12">Supporting Our Farmers</h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-8">
            We work closely with local farmers, providing fair prices and training to improve yields and quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Farmer Training</h3>
              <p className="text-gray-700">Providing skill development to enhance milk quality.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Fair Pricing</h3>
              <p className="text-gray-700">Ensuring farmers get a fair share for their produce.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <AwardIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Community Growth</h3>
              <p className="text-gray-700">Supporting local communities for sustainable development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS ================= */}
      <section className="py-24 bg-green-100">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <s.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold text-green-700 mb-2">{s.value}</h3>
              <p className="text-gray-700">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <TestimonialSection /> 

      {/* ================= TEAM ================= */}
      <section className="py-24 bg-green-50">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((m, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img src={m.img} alt={m.name} className="w-40 h-40 mx-auto rounded-full object-cover mb-4" />
                <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
                <p className="text-green-700">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-green-600 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Join the Saraswathi Dairy Family</h2>
        <p className="max-w-2xl mx-auto mb-8">
          Experience the freshness and quality of our dairy products delivered straight to your home.
        </p>
        <button
          className="bg-white text-green-600 font-bold px-10 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
          onClick={() => (window.location.href = "/collection")}
        >
          Order Now
        </button>
      </section>

    </main>
  );
};

export default About;

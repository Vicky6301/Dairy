import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";

// Popular Categories data
const categories = [
  {
    title: "Milk & Cream",
    products: "2,495 Products",
    image: "src/components/images/Milk & Cream.png",
    path: "/collection?category=milk",
  },
  {
    title: "Cheese & Butter",
    products: "1,847 Products",
    image: "src/components/images/Cheese & Butter.png",
    path: "/collection?category=cheese",
  },
  {
    title: "Yogurt & Curd",
    products: "385 Products",
    image: "src/components/images/Yogurt & Curd.png",
    path: "/collection?category=yogurt",
  },
  {
    title: "Ice Cream & Desserts",
    products: "2,483 Products",
    image: "src/components/images/Ice Cream & Desserts.png",
    path: "/collection?category=icecream",
  },
];

// Trusted Clients data
const partners = [
  { name: "Paradise", logo: "src/components/images/Paradise_Logo.png" },
  { name: "Bawarchi", logo: "src/components/images/Bawarchi_Logo.png" },
  { name: "Cafe Bahar", logo: "src/components/images/Cafe-Bahar_Logo.png" },
  { name: "Anvaya Convention", logo: "src/components/images/Anvaya-Convention_Logo.png" },
  { name: "Om Convention", logo: "src/components/images/Om-Convention_Logo.png" },
  { name: "JRC Convention", logo: "src/components/images/JRC-Convention_Logo.png" },
  { name: "Mehfil", logo: "src/components/images/Mehfil_Logo.png" },
  { name: "Taj Group", logo: "src/components/images/Taj-Group_Logo.png" },
  { name: "Green Park", logo: "src/components/images/Green-Park_Logo.png" },
  { name: "Akshaya Patra Foundation", logo: "src/components/images/Akshaya-Patra-Foundation_Logo.png" },
  { name: "Touch Stone Foundation", logo: "src/components/images/Touch-Stone-Foundation_Logo.png" },
];

const PopularCategories = () => {
  const navigate = useNavigate();

  const handleShopNow = (path) => navigate(path);

  return (
    <>

      {/* Certifications Section - Classy Circular Badges */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-5 sm:px-10 lg:px-20">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-sky-600 via-green-500 to-sky-500 text-transparent bg-clip-text"
            >
              Certifications
            </motion.h2>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-16 justify-items-center">
            {[
              { name: "ISO 22000", logo: "src/components/images/ISO-22000.png" },
              { name: "FSSAI", logo: "src/components/images/FSSAI_logo.png" },
              { name: "HACCP", logo: "src/components/images/HACCP.png" },
              { name: "Organic Certified", logo: "src/components/images/Organic Certified.png" },
              { name: "GMP", logo: "src/components/images/GMP.png" },
            ].map((cert, idx) => (
              <motion.div
                key={idx}
                className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-2xl cursor-pointer overflow-hidden transition-transform duration-500 hover:scale-110"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
              >
                {/* Logo */}
                <img
                  src={cert.logo}
                  alt={cert.name}
                  className="h-24 w-24 object-contain z-10"
                />
                <span className="mt-3 text-center font-semibold text-gray-900 dark:text-white z-10 text-sm">
                  {cert.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Popular Categories */}
      <section className="relative py-20 bg-gradient-to-br from-sky-100 via-green-50 to-white overflow-hidden">
        <div className="absolute top-[-100px] left-[-80px] w-72 h-72 bg-sky-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-100px] right-[-80px] w-72 h-72 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-green-500 to-sky-500 text-transparent bg-clip-text"
            >
              Popular Categories
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-sky-500 to-green-400 mx-auto mt-3 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.8 }}
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true });
              const controls = useAnimation();

              useEffect(() => {
                if (inView) controls.start({ opacity: 1, y: 0 });
              }, [inView, controls]);

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={controls}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 0.5 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer backdrop-blur-md bg-white/40 border border-white/30 shadow-xl transition-transform duration-500"
                >
                  <motion.img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold mb-1">{category.title}</h3>
                      <p className="text-sm mb-2 opacity-80">{category.products}</p>
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShopNow(category.path);
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-white text-sky-800 font-semibold py-1.5 px-4 rounded-full border-2 hover:text-green-600 hover:bg-red-50 transition-colors shadow-lg self-start"
                    >
                      Shop Now
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted Clients */}
      <div className="relative py-16 overflow-hidden">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-transparent bg-clip-text"
          >
            Trusted Clients
          </motion.h2>
        </div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-14"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.08 }}
                className="flex-shrink-0 min-w-[150px] sm:min-w-[180px] flex flex-col items-center justify-center cursor-pointer transition-transform duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-20 object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-800 text-center mt-2">
                  {partner.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PopularCategories;

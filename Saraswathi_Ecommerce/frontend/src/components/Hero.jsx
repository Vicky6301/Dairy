import React, { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import hero_img from "./images/hero_img.png";
import hero_img1 from "./images/hero_img1.png";
import hero_img2 from "./images/hero_img2.png";
import hero_img3 from "./images/hero_img3.png";

const Hero = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      id: 1,
      img: hero_img,
      title: "Pure & Fresh Dairy Products",
      desc: "Delivering farm-fresh milk and dairy straight to your home.",
    },
    {
      id: 2,
      img: hero_img1,
      title: "Wholesome. Organic. Healthy.",
      desc: "Our products are made with care, straight from trusted farmers.",
    },
    {
      id: 3,
      img: hero_img2,
      title: "Hygienic Packaging",
      desc: "Sealed freshness, so every sip tastes just like nature intended.",
    },
    {
      id: 4,
      img: hero_img3,
      title: "Hygienic Packaging",
      desc: "Sealed freshness, so every sip tastes just like nature intended.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % banners.length;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    sliderRef.current.scrollTo({
      left: currentIndex * sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden pt-[72px]">
      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex w-full overflow-x-hidden scroll-smooth snap-x snap-mandatory"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-full flex-shrink-0 snap-center"
          >
            {/* Pure image display */}
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-[500px] sm:h-[600px] object-cover"
            />

            {/* Text overlay (gradient background behind text only) */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-20 text-white bg-gradient-to-r from-black/70 via-black/40 to-transparent">
              <p className="text-sm md:text-base mb-2 font-semibold text-blue-200 tracking-wide">
                FRESH FROM OUR DAIRY
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow">
                {banner.title}
              </h1>
              <p className="text-base md:text-lg mb-6 text-gray-100 max-w-md">
                {banner.desc}
              </p>
              <button
                onClick={() => (window.location.href = "/collection")}
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>

      

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-blue-700 scale-125" : "bg-blue-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

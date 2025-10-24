// src/pages/Gallery.jsx
import React from "react";
import { assets } from "../assets/assets";

const Gallery = () => {
    const images = [
        assets.gallery1,
        assets.gallery2,
        assets.gallery3,
        assets.gallery4,
        assets.gallery5,
        assets.gallery6,
    ];

    return (
        <div className="pt-24 px-6 md:px-12 bg-gray-50 min-h-screen">
            {/* Heading */}
            <div className="text-center mb-12">

                <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400 relative inline-block">
                    Our Gallery
                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-28 h-1 bg-green-400 rounded-full shadow-md"></span>
                </h1>
            </div>


            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl duration-300 relative group"
                    >
                        <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-64 object-cover"
                        />
                        {/* Overlay effect */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <p className="text-white text-lg font-semibold">View Image</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional Footer Text */}
            <div className="mt-12 text-center text-gray-500">
                Explore our fresh and healthy dairy products straight from the farm.
            </div>
        </div>
    );
};

export default Gallery;

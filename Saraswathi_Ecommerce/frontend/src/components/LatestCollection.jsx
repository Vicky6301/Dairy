import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProducItem from "./ProducItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Get bestseller products first, then limit to 10
    const bestsellers = products
      .filter(product => product.bestseller)
      .slice(0, 10);

    // If not enough bestsellers, fill with regular products
    if (bestsellers.length < 10) {
      const regular = products
        .filter(product => !product.bestseller)
        .slice(0, 10 - bestsellers.length);
      setLatestProducts([...bestsellers, ...regular]);
    } else {
      setLatestProducts(bestsellers);
    }
  }, [products]);

  return (
    <section className="relative py-16 bg-gradient-to-b from-sky-50 via-green-50 to-white overflow-hidden">
      {/* Floating glassy shapes for premium look */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 bg-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-60px] w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto px-5 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
            <span className="text-green-600">Top</span> Picks
          </h2>
          <p className="w-3/4 mx-auto text-sm md:text-base text-gray-500 mt-2">
            Discover our most-loved products of the week!
          </p>
        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {latestProducts.map((item, index) => (
            <div
              key={index}
              className="relative bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-500 overflow-hidden group"
            >
              {/* ✅ Pass all required props including variants, rating, and reviews */}
              <ProducItem
                id={item._id}
                image={item.image}
                name={item.name}
                rating={item.rating || 0}
                reviews={item.reviews?.length || 0}
                variants={item.variants || []}
              />

              {/* Best Seller Badge */}
              <span className="absolute top-3 left-3 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
                Best Seller
              </span>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="mt-20 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-green-600 mb-6">
            Watch Our Dairy Story
          </h2>
          <p className="text-gray-600 mb-8 w-3/4 md:w-1/2 text-lg">
            Learn how Saraswati Dairy Products brings fresh, pure, and nutritious products from farm to your home.
          </p>

          <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/cOAcoH3G6xU?autoplay=1&mute=0&loop=1&playlist=cOAcoH3G6xU"
              title="Saraswati Dairy Story"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LatestCollection;
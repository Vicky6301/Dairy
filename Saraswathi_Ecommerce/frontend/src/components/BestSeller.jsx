import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import ProducItem from "./ProducItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const scrollRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    // Filter bestseller products
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10));
  }, [products]);

  // ---- Auto-scroll (slow + pause on hover) ----
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 0.3; // lower = slower
    let animationFrame;

    const smoothScroll = () => {
      if (!isHovered.current) {
        scrollAmount += scrollStep;
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0; // reset scroll
        }
        scrollContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [bestSeller]);

  // ---- Mouse / Touch drag scroll ----
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX || e.touches?.[0].pageX;
      scrollLeft = container.scrollLeft;
    };

    const endDrag = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const moveDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches?.[0].pageX;
      const walk = (x - startX) * 1; // drag speed
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", startDrag);
    container.addEventListener("mouseleave", endDrag);
    container.addEventListener("mouseup", endDrag);
    container.addEventListener("mousemove", moveDrag);
    container.addEventListener("touchstart", startDrag);
    container.addEventListener("touchend", endDrag);
    container.addEventListener("touchmove", moveDrag);

    return () => {
      container.removeEventListener("mousedown", startDrag);
      container.removeEventListener("mouseleave", endDrag);
      container.removeEventListener("mouseup", endDrag);
      container.removeEventListener("mousemove", moveDrag);
      container.removeEventListener("touchstart", startDrag);
      container.removeEventListener("touchend", endDrag);
      container.removeEventListener("touchmove", moveDrag);
    };
  }, []);

  return (
    <div className="my-10">
      {/* Section Header */}
      <div className="text-center text-3xl py-8">
        <h2 className="font-bold text-gray-800 tracking-wide">
          <span className="text-green-600">Best</span> Sellers
        </h2>
        <p className="w-3/4 mx-auto mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
          Discover our most loved and frequently purchased products from our happy customers.
        </p>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        className="flex overflow-x-auto no-scrollbar gap-5 px-4 py-4 scroll-smooth cursor-grab select-none"
      >
        {bestSeller.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-48 sm:w-56 md:w-60">
            <ProducItem
              id={item._id}
              name={item.name}
              image={item.image}
              rating={item.rating || 0}
              reviews={item.reviews?.length || 0}
              variants={item.variants || []}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;

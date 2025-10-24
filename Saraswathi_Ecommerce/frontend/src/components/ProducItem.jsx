// src/components/ProducItem.js
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";

const ProducItem = ({ id, image, name, rating = 0, reviews = 0, variants = [] }) => {
  // Generate stars
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <img
        key={i}
        src={i < Math.floor(rating) ? assets.star_icon : assets.star_dull_icon}
        alt="star"
        className="w-4"
      />
    );
  }

  // Extract brand (first word of name)
  const brand = name.split(' ')[0] || name;

  // Get lowest price from variants
  let lowestPrice = null;
  if (Array.isArray(variants) && variants.length > 0) {
    lowestPrice = Math.min(...variants.map(v => v.price));
  }

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="p-4 flex justify-center">
        <img
          src={image[0] || assets.placeholder}
          alt={name}
          className="w-full h-40 object-contain"
        />
      </div>

      {/* Content: All left-aligned */}
      <div className="px-4 pb-4">
        {/* Brand */}
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
          {brand}
        </p>

        {/* Product Name */}
        <p className="text-sm text-gray-800 font-medium line-clamp-2 mt-1">
          {name}
        </p>

        {/* Rating — left aligned */}
        <div className="flex items-center gap-1 mt-2">
          {stars}
          <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        </div>

        {/* Price — left aligned, below rating */}
        {lowestPrice !== null && (
          <p className="text-sm font-bold text-gray-900 mt-1">
            ₹{lowestPrice.toFixed(2)}
          </p>
        )}
      </div>
    </Link>
  );
};

ProducItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  rating: PropTypes.number,
  reviews: PropTypes.number,
  variants: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ),
};

export default ProducItem;
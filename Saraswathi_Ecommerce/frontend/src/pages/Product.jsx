import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ user: "", rating: 5, comment: "" });
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Fetch product
  useEffect(() => {
    if (!productId || !products?.length) return;

    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData({ ...product, reviews: product.reviews || [] });

      // Set main image/video
      if (product.image && product.image.length > 0) {
        setImage(product.image[0]);
      } else if (product.video) {
        setImage(product.video);
      }

      // Set default variant
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setSelectedSize(firstVariant.size);
        setSelectedPrice(firstVariant.price);
      }
    }
  }, [productId, products]);

  // Update price when size changes
  useEffect(() => {
    if (productData?.variants && selectedSize) {
      const variant = productData.variants.find((v) => v.size === selectedSize);
      if (variant) setSelectedPrice(variant.price);
    }
  }, [selectedSize, productData]);

  // Submit review
  const submitReview = async () => {
    if (!review.user.trim() || !review.comment.trim()) {
      return toast.error("Please fill all fields");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${backendUrl}/api/product/addReview`,
        { productId: productData._id, ...review },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setProductData((prev) => ({
          ...prev,
          reviews: res.data.reviews || [],
        }));
        setReview({ user: "", rating: 5, comment: "" });
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Review submission error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return toast.error("Please select a size");

    setIsAddingToCart(true);
    try {
      const result = addToCart(productData._id, selectedSize, quantity);
      if (result instanceof Promise) await result;
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.message || "Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const result = applyCoupon(couponCode);
    if (result.success) {
      toast.success(result.message);
      setCouponCode("");
    } else {
      toast.error(result.message);
    }
  };

  // Discounted price
  const getDiscountedPrice = () => {
    if (!appliedCoupon || !selectedPrice) return selectedPrice;
    if (appliedCoupon.appliesTo === "product") {
      return selectedPrice - (selectedPrice * appliedCoupon.discount) / 100;
    }
    return selectedPrice;
  };

  const discountedPrice = getDiscountedPrice();
  const totalPrice = discountedPrice * quantity;

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Combine images + video for thumbnails, video goes last
  const thumbnails = [...(productData.image || [])];
  if (productData.video) thumbnails.push(productData.video); // video last

  return (
    <div className="pt-24 border-t-2 transition-opacity ease-in duration-500 opacity-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
          {/* LEFT: Images + Video */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            {/* Thumbnails */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-[100px]">
                {thumbnails.map((mediaUrl, index) => {
                  const isVideo =
                    mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm");
                  const isActive = image === mediaUrl;

                  return (
                    <div
                      key={index}
                      className={`w-full h-24 border rounded cursor-pointer overflow-hidden ${isActive ? "border-orange-500" : "border-gray-300"
                        }`}
                      onClick={() => setImage(mediaUrl)}
                    >
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={`thumbnail-${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Main Preview */}
              <div className="flex-1 flex justify-center items-center border rounded-lg overflow-hidden">
                {image?.endsWith(".mp4") || image?.endsWith(".webm") ? (
                  <video
                    src={image}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={image || assets.placeholder}
                    alt="main-product"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = assets.placeholder;
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-2xl font-medium">{productData.name}</h1>
            {productData.description && (
              <p className="text-gray-700">{productData.description}</p>
            )}

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(productData.rating || 0)
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star"
                  className="w-4"
                />
              ))}
              <p className="ml-2 text-sm text-gray-500">
                ({productData.reviews?.length || 0} Reviews)
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {discountedPrice !== selectedPrice && (
                <p className="text-xl text-gray-500 line-through">
                  {currency}
                  {selectedPrice.toFixed(2)}
                </p>
              )}
              <p className="text-3xl font-bold">
                {currency}
                {totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Sizes */}
            {productData.variants && productData.variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`border px-4 py-2 text-sm rounded whitespace-nowrap ${selectedSize === variant.size
                          ? "bg-orange-100 border-orange-500 text-orange-700 font-medium"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`${isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                } bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition`}
            >
              {isAddingToCart ? "ADDING..." : "ADD TO CART"}
            </button>

            {/* Features */}
            {productData.features && (
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {productData.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Colors */}
            {productData.colors && productData.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Colors</h3>
                <div className="flex gap-2">
                  {productData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABS (Description, Reviews, Support) */}
        <div className="mt-10 border-t pt-6">
          <div className="flex border-b">
            {["description", "reviews", "support"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium capitalize ${activeTab === tab
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab} {tab === "reviews" && `(${productData.reviews?.length || 0})`}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="text-gray-700">
                {productData.tabDescription ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                      Product Description
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {productData.tabDescription
                        .split(".")
                        .filter((point) => point.trim() !== "")
                        .map((point, idx) => (
                          <li key={idx}>{point.trim()}.</li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No additional description available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {productData.reviews?.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  productData.reviews.map((rev, i) => (
                    <div key={i} className="border p-4 mb-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {rev.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{rev.user}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <img
                                key={j}
                                src={
                                  j < rev.rating ? assets.star_icon : assets.star_dull_icon
                                }
                                alt="star"
                                className="w-4"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{rev.comment}</p>
                    </div>
                  ))
                )}

                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={review.user}
                    onChange={(e) =>
                      setReview({ ...review, user: e.target.value })
                    }
                    className="border p-2 w-full mb-3"
                  />

                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setReview({ ...review, rating: star })}
                        className={`text-xl cursor-pointer ${review.rating >= star ? "text-yellow-400" : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <textarea
                    placeholder="Your Comment"
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    className="border p-2 w-full mb-3"
                    rows="4"
                  />

                  <button
                    onClick={submitReview}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="text-gray-700">
                <p>
                  Need help? Contact our support team at{" "}
                  <a href="mailto:support@example.com" className="text-blue-500">
                    support@example.com
                  </a>
                  .
                </p>
                <p className="mt-2">
                  We're here to assist you with any questions or issues.
                </p>
              </div>
            )}
          </div>
        </div>

        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;

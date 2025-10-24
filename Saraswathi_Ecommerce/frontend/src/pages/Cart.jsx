// src/pages/Cart.jsx
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import ActiveCoupons from "../components/ActiveCoupons";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    coupons // ✅ Coupons loaded from /api/coupons/active (public endpoint)
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Transform cart items for rendering
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        if (!productId || productId.trim() === "") continue;
        const sizes = cartItems[productId];
        if (sizes && typeof sizes === "object") {
          for (const size in sizes) {
            const quantity = sizes[size];
            if (typeof quantity === "number" && quantity > 0) {
              tempData.push({
                _id: productId,
                size: size,
                quantity: quantity,
              });
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const result = applyCoupon(couponCode);
    if (result.success) {
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError(result.message);
    }
  };

  const handleProceedCheckout = () => {
    navigate("/place-order");
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-[100px] sm:pt-[80px] px-4 sm:px-6 lg:px-20">
      {/* Cart Title */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 drop-shadow-lg">
          YOUR <span className="text-blue-900">CART</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-3/4 w-full">
          {cartData.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            <div className="space-y-5">
              {cartData.map((item, index) => {
                const productData = products.find((p) => p._id === item._id);
                const variant = productData?.variants?.find(
                  (v) => v.size === item.size
                );

                if (!productData || !variant) {
                  return (
                    <div
                      key={index}
                      className="p-4 border rounded-xl bg-red-50 text-red-700 text-sm"
                    >
                      Product or size "{item.size}" no longer available. Please remove.
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300"
                  >
                    <img
                      src={productData.image[0] || assets.placeholder}
                      alt={productData.name}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {productData.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{item.size}</p>
                      <p className="text-gray-900 font-medium mt-1">
                        {currency}
                        {variant.price.toFixed(2)}
                      </p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1) updateQuantity(item._id, item.size, val);
                      }}
                      className="w-16 sm:w-20 border text-center rounded-lg px-2 py-1 focus:outline-green-400"
                    />
                    <button
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="p-2 hover:bg-red-100 rounded-full transition"
                    >
                      <img src={assets.bin_icon} alt="Remove" className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:w-1/4 w-full">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-[120px]">
            {/* Coupon Section */}
            <div className="mb-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border px-1 py-2 rounded-lg text-sm focus:outline-green-400"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-1 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <p className="text-red-600 text-xs mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="p-2 bg-green-100 rounded text-green-800 text-xs flex justify-between items-center mt-2">
                  Applied: {appliedCoupon.code} ({appliedCoupon.discount}% off)
                  <button
                    onClick={removeCoupon}
                    className="ml-2 text-blue-600 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Active Coupons Section - Using public /active endpoint data */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Available Coupons</h3>
              <ActiveCoupons 
                coupons={coupons} 
                onApplyCoupon={setCouponCode} 
              />
            </div>

            <CartTotal />

            <button
              onClick={handleProceedCheckout}
              disabled={cartData.length === 0}
              className={`w-full py-3 rounded-lg font-semibold mt-4 transition ${
                cartData.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
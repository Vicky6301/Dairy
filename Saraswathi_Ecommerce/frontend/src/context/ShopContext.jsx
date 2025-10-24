// src/context/ShopContext.js
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹ ";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Search state
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Cart and products
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Invalid cart data in localStorage");
      }
    }
    return {};
  });
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  // ✅ COUPON STATE
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const navigate = useNavigate();

  // ✅ Add to cart — supports size AND quantity
  const addToCart = async (itemId, size, quantity = 1) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    const numQuantity = Math.max(1, Math.floor(Number(quantity)));

    setCartItems(prevCart => {
      const newCart = structuredClone(prevCart);

      if (!newCart[itemId]) {
        newCart[itemId] = {};
      }

      newCart[itemId][size] = (newCart[itemId][size] || 0) + numQuantity;

      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, quantity: numQuantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to sync cart with server:", error);
        toast.error("Failed to save cart. Please log in again.");
      }
    }
  };

  // ✅ Update quantity — supports size
  const updateQuantity = async (itemId, size, quantity) => {
    if (!itemId || !size || quantity < 0) return;

    setCartItems(prevCart => {
      const newCart = structuredClone(prevCart);

      if (quantity === 0) {
        if (newCart[itemId]) {
          delete newCart[itemId][size];
          if (Object.keys(newCart[itemId]).length === 0) {
            delete newCart[itemId];
          }
        }
      } else {
        if (!newCart[itemId]) {
          newCart[itemId] = {};
        }
        newCart[itemId][size] = quantity;
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/update',
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to update cart on server:", error);
        toast.error("Failed to update cart. Please try again.");
      }
    }
  };

  // ✅ Get total cart amount using variants
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo || !Array.isArray(itemInfo.variants)) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          const variant = itemInfo.variants.find(v => v.size === size);
          if (variant && typeof variant.price === 'number' && variant.price >= 0) {
            totalAmount += variant.price * quantity;
          }
        }
      }
    }
    return totalAmount;
  };

  // ✅ Get total item count (for cart icon)
  const getCartCount = () => {
    let totalCount = 0;
    if (cartItems && typeof cartItems === 'object') {
      for (const productId in cartItems) {
        if (!productId || productId.trim() === "") continue;
        const sizes = cartItems[productId];
        if (sizes && typeof sizes === 'object') {
          for (const size in sizes) {
            const quantity = sizes[size];
            if (typeof quantity === 'number' && quantity > 0) {
              totalCount += quantity;
            }
          }
        }
      }
    }
    return totalCount;
  };

  // In ShopContext.js
const fetchCoupons = async () => {
  try {
    // ✅ Use the PUBLIC active endpoint
    const response = await axios.get(backendUrl + "/api/coupons/active");
    const data = response.data;
    
    if (data.success && Array.isArray(data.coupons)) {
      setCoupons(data.coupons);
    } else if (Array.isArray(data)) {
      setCoupons(data);
    } else {
      setCoupons([]);
    }
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    setCoupons([]);
  }
};

  const isCouponExpired = (expiry) => {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  const applyCoupon = (couponCode) => {
    if (!couponCode) {
      setAppliedCoupon(null);
      return { success: false, message: "Please enter a coupon code" };
    }

    // ✅ Use uppercase for consistency
    const cleanCode = couponCode.trim().toUpperCase();

    const coupon = coupons.find(c =>
      c.code?.toUpperCase() === cleanCode &&
      c.active &&
      !isCouponExpired(c.expiry)
    );

    if (!coupon) {
      // ✅ Debug info
      console.log("Available coupon codes:", coupons.map(c => c.code));
      console.log("Searching for:", cleanCode);
      return { success: false, message: "Invalid or expired coupon" };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: "Coupon applied successfully" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getCartTotalWithCoupon = () => {
    const subtotal = getCartAmount();

    if (!appliedCoupon) {
      return { subtotal, discount: 0, total: subtotal };
    }

    let discount = 0;

    if (appliedCoupon.appliesTo === "product") {
      // Product-level discount
      discount = 0;
      for (const productId in cartItems) {
        const product = products.find(p => p._id === productId);
        if (product?.variants) {
          const sizes = cartItems[productId];
          for (const size in sizes) {
            const quantity = sizes[size];
            const variant = product.variants.find(v => v.size === size);
            if (variant) {
              const itemDiscount = (variant.price * quantity * appliedCoupon.discount) / 100;
              discount += itemDiscount;
            }
          }
        }
      }
    } else {
      // Cart-level discount
      discount = (subtotal * appliedCoupon.discount) / 100;
    }

    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  // Fetch all products
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error("Unable to load products. Please try again later.");
    }
  };

  // Fetch user cart from backend (if logged in)
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        const serverCart = response.data.cartData || {};
        setCartItems(serverCart);
        localStorage.setItem('cart', JSON.stringify(serverCart));
      }
    } catch (error) {
      console.error("User cart fetch error:", error);
    }
  };

  // Load products and coupons on app start
  useEffect(() => {
    getProductsData();
    fetchCoupons();
  }, []);

  // Handle auth + cart sync
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, [token]);

  // Provide context value
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    // ✅ COUPON VALUES
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartTotalWithCoupon,
    fetchCoupons
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
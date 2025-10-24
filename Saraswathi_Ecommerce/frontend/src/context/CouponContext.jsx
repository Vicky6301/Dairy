import { createContext, useContext, useState, useEffect } from "react";

const CouponContext = createContext();

export const useCoupon = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Optional: Persist coupon in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appliedCoupon");
    if (saved) setAppliedCoupon(JSON.parse(saved));
  }, []);

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("appliedCoupon");
  };

  return (
    <CouponContext.Provider value={{ appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};

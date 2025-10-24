// components/ActiveCoupons.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ActiveCoupons = ({ coupons = [], onApplyCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  // Safe expiry check
  const isExpired = (expiryStr) => {
    if (!expiryStr) return false;
    const expiry = new Date(expiryStr);
    const now = new Date();
    return isNaN(expiry.getTime()) || expiry <= now;
  };

  const activeCoupons = coupons.filter(c => 
    c.active === true && !isExpired(c.expiry)
  );

  const handleApply = (code) => {
    onApplyCoupon?.(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-gray-50"
      >
        <span>View Active Coupons</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-3"
          >
            {activeCoupons.length === 0 ? (
              <div className="p-3 bg-gray-50 rounded-md text-center text-gray-600 text-sm">
                No active coupons available.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {activeCoupons.map((coupon) => (
                  <div key={coupon._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-gray-800 font-semibold text-sm">{coupon.code}</p>
                      <p className="text-gray-600 text-xs">
                        {coupon.discount}% off — Expires {new Date(coupon.expiry).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApply(coupon.code)}
                      className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-100"
                    >
                      {copiedCoupon === coupon.code ? "Applied!" : "Apply"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveCoupons;
// src/components/CartTotal.js
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, appliedCoupon } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shipping = subtotal > 0 ? delivery_fee : 0;
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <h2 className="text-2xl font-extrabold text-green-700 mb-4 border-b-2 border-green-300 pb-2">
          Your Orders
        </h2>
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{currency}{subtotal.toFixed(2)}</p>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-700 font-medium">
            <p>Discount ({appliedCoupon.discount}%):</p>
            <p>-{currency}{discountAmount.toFixed(2)}</p>
          </div>
        )}

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee:</p>
          <p>{currency}{shipping.toFixed(2)}</p>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <b>Total:</b>
          <b>{currency}{total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;

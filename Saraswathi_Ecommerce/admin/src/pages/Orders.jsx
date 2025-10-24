import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // ✅ FIXED: Use /api/order/admin to get ALL orders (admin panel)
      const response = await axios.get(`${backendUrl}/api/order/admin`, {
        headers: { token },
      });

      const ordersData = response.data?.orders || [];
      setOrders(ordersData.reverse());
    } catch (error) {
      console.error("Orders fetch error:", error.response?.data || error.message);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      // ✅ Status update route (no change needed)
      await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      
      // Optimistic UI update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: event.target.value } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Status update error:", error.response?.data || error.message);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-lg text-blue-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const firstItem = order.items?.[0] || {};

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-200"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 object-cover rounded-lg"
                    src={firstItem.image?.[0] ? firstItem.image[0].trim() : "/placeholder.png"}
                    alt={firstItem.name || "Product"}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p className="text-gray-600">
                      {currency}{order.amount?.toFixed(2)} • {order.items?.length} item(s)
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-blue-600">{order.status}</div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-3 text-gray-700 border-t pt-4">
                  <div>
                    <p className="font-medium">Items:</p>
                    {order.items?.map((item, idx) => (
                      <p key={idx}>
                        {item.name} × {item.quantity} {item.size && `(${item.size})`}
                      </p>
                    ))}
                  </div>

                  {order.address && (
                    <div>
                      <p className="font-medium">Address:</p>
                      <p>
                        {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                      </p>
                      <p>Phone: {order.address.phone}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <p>Method: <span className="font-semibold">{order.paymentMethod}</span></p>
                    <p>Payment: <span className={order.payment ? "text-green-600" : "text-red-500"}>
                      {order.payment ? "Done" : "Pending"}
                    </span></p>
                    <select
                      value={order.status}
                      onChange={(e) => statusHandler(e, order._id)}
                      className="p-1 border rounded text-sm"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.date).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
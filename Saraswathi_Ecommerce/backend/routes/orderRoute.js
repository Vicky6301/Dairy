// backend/routes/orderRoute.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/orderModel.js';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Get current user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ✅ Admin: Get ALL orders
router.get('/admin', auth, async (req, res) => {
  try {
    // 🔒 Optional: Add admin role check if you have roles
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: "Admin access required" });
    // }

    const orders = await Order.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch admin orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Update order status
router.post('/status', auth, async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // 🔒 Optional: Only allow admin to update (if you have roles)
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// Place order
router.post('/place', auth, async (req, res) => {
  try {
    const { address, items, amount } = req.body;
    const userId = req.user.id;

    if (!address || !items || amount === undefined) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    const newOrder = new Order({
      userId,
      address,
      items,
      amount,
      payment: false,
      paymentMethod: 'COD',
      status: 'Order Placed',
    });

    await newOrder.save();
    console.log("✅ New order saved:", newOrder._id); // 🔍 Add this for debugging
    res.json({ success: true, message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Place order error:", error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
});

// Razorpay routes (mock)
router.post('/razorpay', auth, (req, res) => {
  res.json({ 
    success: true, 
    order: { id: "mock_order_id", amount: req.body.amount } 
  });
});

router.post('/verifyRazorpay', auth, (req, res) => {
  res.json({ success: true, message: "Payment verified" });
});

export default router;
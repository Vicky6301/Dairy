// backend/routes/couponRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Coupon from '../models/couponModel.js';

const router = express.Router();

// Auth middleware
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

// ✅ GET all coupons (admin)
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch coupons" });
  }
});

// ✅ GET active coupons (for cart/checkout)
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const activeCoupons = await Coupon.find({
      active: true,
      expiry: { $gt: now }
    }).sort({ discount: -1 }); // Sort by highest discount first
    
    res.json({ success: true, coupons: activeCoupons });
  } catch (error) {
    console.error("Fetch active coupons error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch active coupons" });
  }
});

// ✅ CREATE coupon
router.post('/', auth, async (req, res) => {
  try {
    const { code, discount, expiry, active = true, appliesTo = 'cart' } = req.body;
    
    if (!code || !discount || !expiry) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newCoupon = new Coupon({
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      expiry: new Date(expiry),
      active,
      appliesTo
    });

    await newCoupon.save();
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "Coupon code already exists" });
    } else {
      res.status(500).json({ success: false, message: "Failed to create coupon" });
    }
  }
});

// ✅ UPDATE coupon
router.put('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update coupon" });
  }
});

// ✅ DELETE coupon
router.delete('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete coupon" });
  }
});

export default router;
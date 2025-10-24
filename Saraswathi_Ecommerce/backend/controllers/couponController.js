// controllers/couponController.js
import Coupon from '../models/couponModel.js';

// Get all coupons (public)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).select('-__v');
    res.json({ success: true, coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create coupon (admin only)
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiry, active = true, appliesTo = "cart" } = req.body;
    
    // Validation
    if (!code || !discount || !expiry) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    
    const coupon = new Coupon({
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      expiry: new Date(expiry),
      active: Boolean(active),
      appliesTo: appliesTo
    });
    
    await coupon.save();
    res.json({ success: true, message: 'Coupon created', coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update coupon (admin only)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expiry, active, appliesTo } = req.body;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    
    if (code) coupon.code = code.trim().toUpperCase();
    if (discount) coupon.discount = Number(discount);
    if (expiry) coupon.expiry = new Date(expiry);
    if (active !== undefined) coupon.active = Boolean(active);
    if (appliesTo) coupon.appliesTo = appliesTo;
    
    await coupon.save();
    res.json({ success: true, message: 'Coupon updated', coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete coupon (admin only)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getCoupons, createCoupon, updateCoupon, deleteCoupon };
// backend/routes/otpRoute.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const otpStore = {};

const normalizeMobile = (mobile) => mobile.replace(/\D/g, '').slice(-10);

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile required" });
    }

    const normalized = normalizeMobile(mobile);
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[normalized] = otp;

    console.log(`[OTP] ${normalized}: ${otp}`);
    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile & OTP required" });
    }

    const normalized = normalizeMobile(mobile);
    if (!otpStore[normalized] || otpStore[normalized].toString() !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    delete otpStore[normalized];
    let user = await User.findOne({ mobile: normalized });

    if (!user) {
      user = new User({
        mobile: normalized,
        name: "Guest",
        email: `guest-${Date.now()}@celebration.com`
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET || 'secret-key-123',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        mobile: user.mobile,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

export default router;
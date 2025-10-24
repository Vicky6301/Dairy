// backend/routes/userRoute.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Simple auth middleware (for set-password)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    const query = {};

    if (email) {
      query.email = email.toLowerCase();
    } else if (mobile) {
      const normalized = mobile.replace(/\D/g, '').slice(-10);
      query.mobile = normalized;
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "No password set. Please log in using OTP."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});
// ✅ ADMIN LOGIN ROUTE
router.post('/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verify against .env credentials
    if (
      email === process.env.ADMIN_EMAIL && 
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create admin token with role
      const token = jwt.sign(
        { 
          id: "admin", 
          email, 
          role: "admin" 
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      
      res.json({ success: true, token });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Admin login failed" 
    });
  }
});

// ✅ SET PASSWORD (Protected Route)
router.post('/set-password', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters" 
      });
    }

    // Hash and save password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.json({ 
      success: true, 
      message: "Password set successfully" 
    });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to set password" 
    });
  }
});

export default router;
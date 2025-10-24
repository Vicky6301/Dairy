// controllers/otpController.js
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// You can store OTP temporarily in memory (for testing)
// For production, use Redis or DB
let otpStore = {};

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP for verification
    otpStore[mobile] = otp;

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP are required" });

    if (otpStore[mobile] !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ mobile }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Remove OTP after successful verification
    delete otpStore[mobile];

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

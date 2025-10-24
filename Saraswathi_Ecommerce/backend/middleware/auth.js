// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This contains { id } from your createToken function
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

export default authMiddleware;
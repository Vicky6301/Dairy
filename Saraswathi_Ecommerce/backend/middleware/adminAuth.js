// middleware/adminAuth.js
import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    console.log("Headers received in adminAuth:", req.headers);
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not Authorized, Login Again' });
    }

    next();
  } catch (error) {
    console.log("adminAuth error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;

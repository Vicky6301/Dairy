// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // optional for OTP users
  mobile: { type: String, unique: true, sparse: true }, // ✅ required for OTP flow
  password: { type: String, required: true },
  cartData: { type: Object, default: {} }
}, { 
  minimize: false,
  timestamps: true // ✅ adds createdAt, updatedAt
});

// Use PascalCase model name: 'User'
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
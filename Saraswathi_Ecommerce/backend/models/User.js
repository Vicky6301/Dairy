import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User" },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true }, // 10-digit only
    password: { type: String },
    cartData: { type: Object, default: {} },

    // ✅ New field for admin login
    isAdmin: { type: Boolean, default: false },
  },
  { 
    minimize: false,
    timestamps: true 
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

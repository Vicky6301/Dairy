// backend/models/couponModel.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: { 
    type: Number, 
    required: true, 
    min: 0,
    max: 100
  },
  expiry: { 
    type: Date, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  appliesTo: { 
    type: String, 
    enum: ['cart', 'product'], 
    default: 'cart' 
  }
}, {
  timestamps: true
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
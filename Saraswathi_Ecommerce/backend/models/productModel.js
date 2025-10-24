import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tabDescription: { type: String, default: "" },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  bestseller: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },

  // Each variant has a size (e.g., "500 ml") and its own price
  variants: {
    type: [{
      size: { 
        type: String, 
        required: true,
        trim: true,
      },
      price: { 
        type: Number, 
        required: true, 
        min: 0 
      }
    }],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },

  // ✅ ADD REVIEWS FIELD
  reviews: {
    type: [{
      user: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }],
    default: []
  },

  // ✅ VIDEO FIELD (optional, single video)
  video: {
    type: String,
    default: "" // URL of the video
  }

}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;

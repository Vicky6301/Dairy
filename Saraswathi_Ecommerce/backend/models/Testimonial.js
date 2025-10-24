import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, default: 5 },
  image: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);

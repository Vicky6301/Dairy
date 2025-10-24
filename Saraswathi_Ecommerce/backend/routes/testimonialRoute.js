import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// ✅ Add new testimonial
router.post("/", async (req, res) => {
  try {
    const { name, message, rating, image } = req.body;
    const testimonial = new Testimonial({ name, message, rating, image });
    await testimonial.save();
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({ success: false, message: "Failed to add testimonial" });
  }
});

// ✅ Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ _id: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
});

// ✅ Delete testimonial
router.delete("/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete testimonial" });
  }
});

export default router;

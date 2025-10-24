import express from "express";
import Contact from "../models/contactModel.js";

const contactRouter = express.Router();

// Save Contact Form Data
contactRouter.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(200).json({ success: true, message: "Message stored successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch All Messages (for Admin Panel)
contactRouter.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a Contact by ID
contactRouter.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    await contact.deleteOne(); // proper Mongoose method
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete message", error: err.message });
  }
});

export default contactRouter;

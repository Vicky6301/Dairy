import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 5,
    image: "",
  });
  const [uploading, setUploading] = useState(false);

  // Fetch testimonials from backend
  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/testimonials`);
      if (data.success) setTestimonials(data.testimonials);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials");
    }
  };

  // Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success && res.data.imageUrl) {
        setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Add testimonial
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image before submitting");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/testimonials`, formData);
      if (data.success) {
        toast.success("Testimonial added!");
        setFormData({ name: "", message: "", rating: 5, image: "" });
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add testimonial");
    }
  };

  // Delete testimonial with normal browser popup
  const handleDeleteWithConfirm = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this testimonial?");
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/testimonials/${id}`);
      toast.success("Deleted successfully");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Testimonials</h2>

      {/* Form */}
      <form onSubmit={handleAdd} className="mb-6 grid gap-3 max-w-lg bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          className="border p-2 rounded"
          required
        />

        {/* Image Upload */}
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
          {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>

        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Add Testimonial
        </button>
      </form>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.map((t) => (
          <div key={t._id} className="border p-4 rounded bg-white shadow flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={t.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{t.name} ⭐{t.rating}</p>
                <p className="text-gray-700">{t.message}</p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteWithConfirm(t._id)}
              className="text-red-500 font-semibold hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

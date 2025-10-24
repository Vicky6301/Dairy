import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tabDescription, setTabDescription] = useState("");
  const [category, setCategory] = useState("Milk & Beverages");
  const [subCategory, setSubCategory] = useState("Milk");
  const [bestseller, setBestseller] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);
  const [originalImages, setOriginalImages] = useState(["", "", "", ""]);
  const [variants, setVariants] = useState([{ size: "", price: "" }]);

  // Video
  const [video, setVideo] = useState(null);
  const [originalVideo, setOriginalVideo] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post(
          `${backendUrl}/api/product/single`,
          { productId: id },
          { headers: { token } }
        );

        if (!res.data.success) throw new Error("Product not found");
        const p = res.data.product;

        setName(p.name || "");
        setDescription(p.description || "");
        setTabDescription(p.tabDescription || "");
        setCategory(p.category || "Milk & Beverages");
        setSubCategory(p.subCategory || "Milk");
        setBestseller(p.bestseller || false);

        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setVariants(
            p.variants.map((v) => ({
              size: (v.size || "").toString(),
              price: v.price != null ? String(v.price) : "",
            }))
          );
        }

        // Images
        const imgList = Array.isArray(p.image) ? p.image : [];
        const originalImgUrls = ["", "", "", ""];
        for (let i = 0; i < 4; i++) originalImgUrls[i] = imgList[i] || "";
        setOriginalImages(originalImgUrls);
        setImages([null, null, null, null]);

        // Video
        setOriginalVideo(p.video || "");
        setVideo(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
        navigate("/admin/list");
      }
    };

    if (token) fetchProduct();
  }, [id, token, navigate]);

  // Variant handlers
  const addVariant = () => setVariants([...variants, { size: "", price: "" }]);
  const updateVariant = (i, field, val) => {
    const newVariants = [...variants];
    if (field === "price") {
      if (val === "" || /^(\d*\.?\d*)$/.test(val)) newVariants[i].price = val;
    } else newVariants[i][field] = val;
    setVariants(newVariants);
  };
  const removeVariant = (i) => {
    if (variants.length <= 1) return toast.warn("At least one variant required");
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  // Submit
  const handleUpdate = async (e) => {
    e.preventDefault();

    const validVariants = variants
      .map((v) => ({
        size: v.size.trim(),
        price: v.price === "" ? NaN : Number(v.price),
      }))
      .filter((v) => v.size && !isNaN(v.price) && v.price > 0);

    if (!validVariants.length) return toast.error("Add at least one variant!");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("tabDescription", tabDescription);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestseller);
    formData.append("variants", JSON.stringify(validVariants));

    // Images
    for (let i = 0; i < 4; i++) {
      if (images[i] instanceof File) formData.append(`image${i + 1}`, images[i]);
      else formData.append(`image${i + 1}`, originalImages[i]);
    }

    // Video
    if (video instanceof File) formData.append("video", video);
    else formData.append("video", originalVideo);

    try {
      const res = await axios.post(`${backendUrl}/api/product/update`, formData, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success("Product updated!");
        navigate("/list");
      } else toast.error(res.data.message || "Update failed");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update product");
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Edit Product</h2>

      {/* Images */}
      <div>
        <p className="mb-3 font-semibold">Upload Images</p>
        <div className="flex gap-4 flex-wrap">
          {images.map((img, i) => (
            <label key={i} className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer overflow-hidden">
              <img
                src={img ? URL.createObjectURL(img) : originalImages[i] || assets.upload_area}
                alt={`img${i+1}`}
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[i] = e.target.files?.[0] || null;
                  setImages(newImages);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Video */}
      <div>
        <p className="mb-2 font-medium">Upload Video</p>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="border p-2 rounded w-full"
        />
        {(video || originalVideo) && (
          <video
            src={video ? URL.createObjectURL(video) : originalVideo}
            controls
            className="mt-2 w-64 h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 rounded w-full" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded w-full" required />
      <textarea value={tabDescription} onChange={(e) => setTabDescription(e.target.value)} placeholder="Tab Description" className="border p-2 rounded w-full" />

      {/* Category */}
      <div className="flex gap-4 flex-wrap">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded flex-1">
          <option>Milk & Beverages</option>
          <option>Curd, Yogurt & Cream</option>
          <option>Cheese & Butter</option>
          <option>Paneer & Ghee</option>
          <option>Flavored Products</option>
        </select>
        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="border p-2 rounded flex-1">
          <option>Milk</option>
          <option>Curd</option>
          <option>Yogurt</option>
          <option>Cream</option>
          <option>Cheese</option>
          <option>Butter</option>
          <option>Paneer</option>
          <option>Ghee</option>
          <option>Flavored Milk</option>
        </select>
      </div>

      {/* Variants */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p>Variants</p>
          <button type="button" onClick={addVariant} className="px-2 py-1 bg-blue-100 text-blue-700 rounded">+ Add</button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input type="text" value={v.size} placeholder="Size" onChange={(e) => updateVariant(i, "size", e.target.value)} className="border p-2 rounded flex-1" required />
            <input type="text" value={v.price} placeholder="Price" onChange={(e) => updateVariant(i, "price", e.target.value)} className="border p-2 rounded w-32" required />
            {variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="text-red-500 font-bold">✕</button>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
        <label>Add to Bestseller</label>
      </div>

      <button type="submit" className="bg-blue-400 text-white py-2 rounded">Update Product</button>
    </form>
  );
};

export default Edit;

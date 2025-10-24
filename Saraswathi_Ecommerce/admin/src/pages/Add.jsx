import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // ✅ Video state
  const [video, setVideo] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tabDescription, setTabDescription] = useState("");
  const [category, setCategory] = useState("Milk & Beverages");
  const [subCategory, setSubCategory] = useState("Milk");
  const [bestseller, setBestseller] = useState(false);
  const [variants, setVariants] = useState([{ size: "", price: "" }]);

  const addVariant = () => {
    setVariants([...variants, { size: "", price: "" }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    if (field === "price") {
      if (value === "" || /^(\d*\.?\d*)$/.test(value)) {
        newVariants[index].price = value;
      }
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      toast.warn("At least one variant is required");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const invalid = variants.some(
      (v) =>
        !v.size.trim() ||
        v.price === "" ||
        isNaN(Number(v.price)) ||
        Number(v.price) <= 0
    );
    if (invalid) {
      toast.error("Please fill valid size and price for all variants");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("tabDescription", tabDescription);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestseller", bestseller);

    const variantsToSend = variants.map((v) => ({
      size: v.size.trim(),
      price: Number(v.price),
    }));
    formData.append("variants", JSON.stringify(variantsToSend));

    // ✅ Always append all 4 image fields (even if null)
    formData.append("image1", image1 || "");
    formData.append("image2", image2 || "");
    formData.append("image3", image3 || "");
    formData.append("image4", image4 || "");

    // ✅ Append video field
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName("");
        setDescription("");
        setTabDescription("");
        setCategory("Milk & Beverages");
        setSubCategory("Milk");
        setBestseller(false);
        setVariants([{ size: "", price: "" }]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setVideo(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add Product Error:", error.response?.data || error.message);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-none sm:rounded-2xl shadow-none sm:shadow-lg w-full min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Add New Dairy Product
      </h2>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        {/* Images */}
        <div>
          <p className="mb-2 font-medium text-blue-600">Upload Product Images</p>
          <div className="flex gap-2 flex-wrap justify-start">
            {[1, 2, 3, 4].map((num) => {
              const img = [image1, image2, image3, image4][num - 1];
              const setImg = [setImage1, setImage2, setImage3, setImage4][num - 1];
              return (
                <label htmlFor={`image${num}`} key={num} className="cursor-pointer">
                  <div className="w-20 h-20 bg-white/40 border border-blue-100 rounded-lg flex items-center justify-center overflow-hidden hover:scale-105 transition">
                    <img
                      className="w-full h-full object-cover"
                      src={!img ? assets.upload_area : URL.createObjectURL(img)}
                      alt={`upload${num}`}
                    />
                  </div>
                  <input
                    type="file"
                    id={`image${num}`}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImg(e.target.files?.[0] || null)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* ✅ Video Upload */}
        <div>
          <p className="mb-2 font-medium text-blue-600">Upload Product Video</p>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {video && (
            <video
              src={URL.createObjectURL(video)}
              controls
              className="mt-2 w-64 h-40 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Name & Description */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <textarea
          placeholder="Main Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <textarea
          placeholder="Tab Description"
          value={tabDescription}
          onChange={(e) => setTabDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        {/* Category */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
          >
            <option>Milk & Beverages</option>
            <option>Curd, Yogurt & Cream</option>
            <option>Cheese & Butter</option>
            <option>Doodh Peda</option>
            <option>Paneer & Ghee</option>
            <option>Flavored Products</option>
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
          >
            <option>Milk</option>
            <option>Curd</option>
            <option>Yogurt</option>
            <option>Doodh Peda</option>
            <option>Cream</option>
            <option>Cheese</option>
            <option>Buttermilk</option>
            <option>Paneer</option>
            <option>Ghee</option>
            <option>Flavored Milk</option>
          </select>
        </div>

        {/* Variants */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium text-blue-600">Product Variants (Size + Price)</p>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              + Add Variant
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 500ml, 1kg"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Price ₹"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg bg-white/40 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
            id="bestseller"
            className="accent-green-400"
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Add to Bestseller
          </label>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-200 to-green-200 text-black px-6 py-2 rounded-lg mt-4 hover:scale-105 transition w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
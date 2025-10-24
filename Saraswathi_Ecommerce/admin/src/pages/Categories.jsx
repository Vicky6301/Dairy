import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/category`, {
        headers: { token },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) return toast.error("Category name is required");
    try {
      await axios.post(
        `${backendUrl}/api/category`,
        { name: newCategory },
        { headers: { token } }
      );
      toast.success("Category added");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  // Edit category
  const updateCategory = async () => {
    if (!editCategoryName.trim()) return toast.error("Category name is required");
    try {
      await axios.put(
        `${backendUrl}/api/category/${editCategoryId}`,
        { name: editCategoryName },
        { headers: { token } }
      );
      toast.success("Category updated");
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${backendUrl}/api/category/${id}`, { headers: { token } });
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addCategory}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              {editCategoryId === cat._id ? (
                <>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={updateCategory}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditCategoryId(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setEditCategoryId(cat._id);
                        setEditCategoryName(cat.name);
                      }}
                      className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

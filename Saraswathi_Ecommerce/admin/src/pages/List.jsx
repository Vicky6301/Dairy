// src/pages/List.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) setList(response.data.products);
      else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      console.log("Token being sent:", token);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  

  const editProduct = (id) => navigate(`/edit/${id}`);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700">All Products</h2>

      <div className="hidden md:grid grid-cols-6 gap-2 py-2 px-4 bg-gray-100 rounded-md font-semibold text-gray-700">
        <div>Image</div>
        <div>Name</div>
        <div>Category</div>
        <div>Price</div>
        <div className="text-center">Actions</div>
      </div>

      <div className="grid gap-4">
        {list.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:grid md:grid-cols-6 items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.png"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <p className="font-medium text-gray-700">{item.name}</p>
            <p className="text-gray-500">{item.category}</p>
            <p className="font-semibold text-gray-800">
              {currency}
              {item.price}
            </p>
            <div className="flex gap-2 justify-end md:justify-center">
              <button
                onClick={() => editProduct(item._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;

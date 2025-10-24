// src/pages/admin/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call the dedicated admin login endpoint
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success("Admin login successful!");
        window.location.href = "/dashboard";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || 
        "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-green-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-transform hover:scale-[1.02]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Panel
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} Dairy Admin Panel
        </p>
      </div>
    </div>
  );
};

export default Login;
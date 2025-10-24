import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminContacts from "./pages/AdminContacts";
import Dashboard from "./pages/Dashboard";
import Coupons from "./pages/Coupons";
import Categories from "./pages/Categories";
import Testimonals from "./pages/Testimonals";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const currency = '₹';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  if (!token) return <Login setToken={setToken} />;

  // Content margin for desktop
  const getContentMargin = () => {
    if (windowWidth < 768) return 0; // Mobile: overlay sidebar
    return isSidebarCollapsed ? "5rem" : "16rem"; // Desktop
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Navbar */}
      <Navbar
        setToken={setToken}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Overlay background for mobile */}
        {isMobileSidebarOpen && windowWidth < 768 && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main
          className="flex-1 p-4 md:p-8 overflow-auto"
          style={{ marginLeft: getContentMargin() }}
        >
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/edit/:id" element={<Edit token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/contacts" element={<AdminContacts token={token} />} />
            <Route path="/coupons" element={<Coupons token={token} />} />
            <Route path="/categories" element={<Categories token={token} />} />
            <Route path="/testimonials" element={<Testimonals />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

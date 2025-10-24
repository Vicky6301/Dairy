import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Users,
  PlusSquare,
  List,
  Box,
  ShoppingBag,
  Ticket,
  BarChart2,
  Mail,
  MessageSquare, // ✅ added icon for testimonials
  Settings,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse state

  const menuGroups = [
    {
      title: "Overview",
      links: [{ to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" }],
    },
    {
      title: "Products",
      links: [
        { to: "/categories", icon: <Layers size={20} />, label: "Categories" },
        { to: "/suppliers", icon: <Users size={20} />, label: "Suppliers" },
        { to: "/add", icon: <PlusSquare size={20} />, label: "Add Product" },
        { to: "/list", icon: <List size={20} />, label: "Product List" },
        { to: "/inventory", icon: <Box size={20} />, label: "Inventory" },
      ],
    },
    {
      title: "Sales",
      links: [
        { to: "/orders", icon: <ShoppingBag size={20} />, label: "Orders" },
        { to: "/coupons", icon: <Ticket size={20} />, label: "Coupons" },
        { to: "/reports", icon: <BarChart2 size={20} />, label: "Reports" },
      ],
    },
    {
      title: "Communication",
      links: [
        { to: "/contacts", icon: <Mail size={20} />, label: "Messages" },
        { to: "/testimonials", icon: <MessageSquare size={20} />, label: "Testimonials" }, // ✅ added
      ],
    },
    {
      title: "Settings",
      links: [{ to: "/settings", icon: <Settings size={20} />, label: "Settings" }],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen 
          bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          ${collapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 md:px-4 py-4 border-b border-gray-200 flex-shrink-0">
          {!collapsed && <h1 className="text-xl font-semibold text-gray-800">Keston Admin</h1>}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-gray-100 transition hidden md:flex"
            >
              {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
            <button onClick={onClose} className="md:hidden text-gray-800">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Menu (scrollable) */}
        <div className="flex-1 overflow-y-auto px-1 md:px-2 py-4">
          {menuGroups.map((group, idx) => (
            <div key={idx} className={idx === 0 ? "mb-6" : "mb-4"}>
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">{group.title}</p>
              )}
              <div className="flex flex-col gap-1 max-h-[calc(100vh-80px)] overflow-y-auto">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-2 md:px-4 py-2.5 rounded-lg transition-all 
                        ${isActive
                          ? "bg-green-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-green-100 hover:text-green-800"}`
                    }
                  >
                    {link.icon}
                    {!collapsed && <span className="font-medium truncate">{link.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";

const Navbar = ({ setToken, onToggleSidebar }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setToken("");
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md flex items-center justify-between px-4 md:px-8 py-3">
        
        {/* Left section: Mobile sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={onToggleSidebar}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Center section: Title */}
        <h1 className="text-xl font-bold text-gray-800 text-center flex-1 md:flex-none">
          Dairy Admin
        </h1>

        {/* Right section: Logout */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 w-80 max-w-[90%] shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

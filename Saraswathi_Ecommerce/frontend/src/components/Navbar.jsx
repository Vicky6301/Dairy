import { assets } from "./../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/collection?search=${searchTerm}`);
    setSearchVisible(false);
  };

  const menuItems = [
    { name: "HOME", to: "/" },
    { name: "PRODUCTS", to: "/collection" },
    { name: "ABOUT US", to: "/about" },
    { name: "GALLERY", to: "/gallery" },
    { name: "CONTACT US", to: "/contact" },
    { name: "FAQ", to: "/faq" },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-3 px-6 bg-gradient-to-r from-green-100 to-white border-b border-green-200 font-[Poppins]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} className="w-20 h-15 object-contain" alt="logo" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-6 text-gray-700 text-sm md:text-base">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative transition ${
                  isActive
                    ? "text-green-600 font-semibold after:absolute after:w-full after:h-[2px] after:bg-green-600 after:left-0 after:-bottom-1"
                    : "hover:text-green-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search */}
          <button
            onClick={() => setSearchVisible(!searchVisible)}
            className="p-2 hover:bg-green-50 rounded-full transition"
          >
            <img src={assets.search_icon} className="w-5" alt="searchIcon" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                if (token) setProfileOpen(!profileOpen);
                else navigate("/login");
              }}
              className="p-2 hover:bg-green-50 rounded-full transition"
            >
              <img src={assets.profile_icon} className="w-5" alt="profileIcon" />
            </button>

            {token && profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                <p
                  className="py-2 px-4 cursor-pointer hover:bg-green-50"
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                >
                  My Profile
                </p>
                <p
                  className="py-2 px-4 cursor-pointer hover:bg-green-50"
                  onClick={() => {
                    navigate("/orders");
                    setProfileOpen(false);
                  }}
                >
                  Orders
                </p>
                <p
                  className="py-2 px-4 cursor-pointer hover:bg-red-50 text-red-600"
                  onClick={logout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative hover:scale-105 transition-transform">
            <img src={assets.cart_icon} className="w-5" alt="cartIcon" />
            <span className="absolute -right-2 -bottom-1 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="sm:hidden p-2 hover:bg-green-50 rounded-lg transition"
          >
            <img src={assets.menu_icon} className="w-5" alt="menu_icon" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      {searchVisible && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-md z-40 py-3 px-6 flex justify-center animate-fadeIn">
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-lg border border-green-300 rounded-full overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow px-4 py-2 text-gray-700 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-5 hover:bg-green-600 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white/95 backdrop-blur-xl shadow-lg z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 p-4 border-b text-blue-900 font-semibold cursor-pointer hover:bg-green-50"
        >
          <svg
            className="w-4 h-4 rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Back</span>
        </div>

        <div className="flex flex-col flex-grow">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="py-4 pl-6 border-b text-gray-700 hover:bg-green-50 font-medium"
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 text-xs text-gray-500 border-t">
          © {new Date().getFullYear()} Saraswathi Dairy
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;

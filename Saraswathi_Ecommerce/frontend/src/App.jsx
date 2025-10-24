import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Verify from "./pages/Verify";
import FAQ from "./pages/FAQ";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from "react-icons/fa";
import Gallery from "./pages/Gallery";


const App = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/login"; // Hide Navbar/Footer on login page

  return (
    <div className="overflow-x-hidden min-h-screen relative">
      <ToastContainer />

      {/* Conditionally render Navbar and SearchBar */}
      {!hideNavbarFooter && <Navbar />}
      {!hideNavbarFooter && <SearchBar />}

      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-8 pt-4 box-border">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>

      {/* Conditionally render Footer */}
      {!hideNavbarFooter && <Footer />}

      {/* ✅ Floating WhatsApp Icon */}
      {!hideNavbarFooter && (
        <a
          href="https://wa.me/919866631233"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 animate-bounce"
        >
          <FaWhatsapp size={30} />
        </a>
      )}
    </div>
  );
};

export default App;

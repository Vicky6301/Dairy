import { assets } from "../assets/assets";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-10">

          {/* Brand & Socials */}
          <div className="md:col-span-1 lg:col-span-2 space-y-4">
            <img src={assets.logo} alt="logo" className="h-10 w-auto" />
            <p className="text-gray-600 text-sm">
              Fresh and healthy dairy products straight from the farm to your home.
            </p>
            <div className="flex space-x-3 mt-4">
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-green-600 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-green-600 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-gray-800 text-white rounded-full hover:bg-green-600 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">

                <a href="about" className="hover:text-green-600 text-black text-sm">
                  About Us
                </a>
              </li>
              <li className="flex items-center gap-2">

                <a href="#" className="hover:text-green-600 text-black text-sm">
                  Our Farms
                </a>
              </li>
              <li className="flex items-center gap-2">

                <a href="#" className="hover:text-green-600 text-black text-sm">
                  Delivery Info
                </a>
              </li>
              <li className="flex items-center gap-2">

                <a href="#" className="hover:text-green-600 text-black text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-widest mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">

                <a href="collection" className="hover:text-green-600 text-black text-sm">
                  Milk & Beverages
                </a>
              </li>
              <li className="flex items-center gap-2">

                <a href="collection" className="hover:text-green-600 text-black text-sm">
                  Curd, Yogurt & Cheese
                </a>
              </li>
              <li className="flex items-center gap-2">

                <a href="collection" className="hover:text-green-600 text-black text-sm">
                  Butter, Cream & More
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-widest mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <a href="tel:+919866631233" className="hover:text-green-600 text-black text-sm">
                  +91 9866631233
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <a href="mailto:kestondairy@gmail.com" className="hover:text-green-600 text-black text-sm">
                  kestondairy@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <a href="contact" className="hover:text-green-600 text-black text-sm">
                  Contact Form
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Saraswathi Dairy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

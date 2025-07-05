import { Link } from "react-router-dom";
import {
  Wheat,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-2 rounded-lg">
                <Wheat className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-bold">Anand Agro</span>
                <span className="text-sm text-secondary-300 -mt-1">
                  Industry
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience the natural sweetness of tradition with our organic,
              chemical-free jaggery products.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-secondary-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-secondary-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-secondary-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-secondary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-secondary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-secondary-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-secondary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">
              Our Products
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>Jaggery Blocks</li>
              <li>Jaggery Powder</li>
              <li>Flavored Cubes</li>
              <li>Coconut Jaggery</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Nashik, Maharashtra, India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary-400" />
                <p className="text-gray-300 text-sm">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary-400" />
                <p className="text-gray-300 text-sm">info@anandagro.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2023 Anand Agro Industry. All rights reserved. | Founded on 15th
            August 2023
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

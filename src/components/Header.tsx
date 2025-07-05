import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wheat } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import CartIcon from "./CartIcon";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-accent-900">
                Anand Agro
              </span>
              <span className="text-sm text-secondary-500 -mt-1">Industry</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-secondary-500 border-b-2 border-secondary-500"
                    : "text-gray-700 hover:text-secondary-500"
                } pb-1`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`font-medium transition-colors duration-200 ${
                  isActive("/admin")
                    ? "text-secondary-500 border-b-2 border-secondary-500"
                    : "text-gray-700 hover:text-secondary-500"
                } pb-1`}
              >
                Admin
              </Link>
            )}

            {/* Cart Icon */}
            <CartIcon />

            {/* Profile Dropdown - Always shown since users must be authenticated */}
            <ProfileDropdown />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-secondary-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-secondary-500"
                      : "text-gray-700 hover:text-secondary-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Dashboard Link - Mobile */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium transition-colors duration-200 ${
                    isActive("/admin")
                      ? "text-secondary-500"
                      : "text-gray-700 hover:text-secondary-500"
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Profile Section - Mobile */}
              <div className="pt-4 border-t border-gray-200">
                <ProfileDropdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, Package, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (action: string) => {
    setIsOpen(false);

    switch (action) {
      case "settings":
        navigate("/settings");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.fullName
          )}&background=006423&color=fff`}
          alt={user.fullName}
          className="w-8 h-8 rounded-full"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName
                )}&background=006423&color=fff`}
                alt={user.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleItemClick("orders")}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => handleItemClick("settings")}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={() => handleItemClick("logout")}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

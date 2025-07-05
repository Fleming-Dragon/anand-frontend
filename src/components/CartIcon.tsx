import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartIcon: React.FC = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={() => navigate("/checkout")}
      className="relative p-2 text-gray-700 hover:text-secondary-600 transition-colors"
      title="View Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;

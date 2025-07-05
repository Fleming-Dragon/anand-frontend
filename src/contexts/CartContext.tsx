import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../services/productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("anand_agro_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("anand_agro_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new Error(
            `Cannot add ${quantity} more. Only ${
              product.stock - existingItem.quantity
            } more available`
          );
        }

        return prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          if (quantity > item.product.stock) {
            throw new Error(
              `Only ${item.product.stock} items available in stock`
            );
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product._id === productId);
  };

  const getCartItem = (productId: string) => {
    return items.find((item) => item.product._id === productId);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

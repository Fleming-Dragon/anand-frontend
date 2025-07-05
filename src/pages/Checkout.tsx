import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { paymentService } from "../services/paymentService";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Lock,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.firstName + " " + user?.lastName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["name", "phone", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]?.trim()) {
        toast.error(`Please enter ${field}`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: getTotalPrice() + 50, // Adding ₹50 shipping
        shippingAddress: shippingInfo,
      };

      // Create Razorpay order
      const order = await paymentService.createOrder(orderData);

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id", // Replace with your key
        amount: order.amount,
        currency: order.currency,
        name: "Anand Agro",
        description: "Purchase of organic jaggery products",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verification = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              toast.success("Payment successful! Order placed.");
              clearCart();
              setOrderPlaced(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: user?.email || "",
          contact: shippingInfo.phone,
        },
        notes: {
          address: shippingInfo.address,
        },
        theme: {
          color: "#D97706", // secondary color
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      // Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getTotalPrice();
  const shippingCost = 50;
  const finalTotal = totalAmount + shippingCost;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will receive a confirmation email
            shortly.
          </p>
          <button
            onClick={() => (window.location.href = "/orders")}
            className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some delicious jaggery products to your cart!
          </p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2" />
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Cart Items */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={
                        item.product.images[0]?.url ||
                        "/placeholder-product.jpg"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.price}/{item.product.weight.unit}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Shipping:
                  </span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="House no, Street, Area"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="6-digit pincode"
                    required
                  />
                </div>
              </form>

              {/* Payment Button */}
              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-secondary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  {loading ? "Processing..." : `Pay ₹${finalTotal.toFixed(2)}`}
                </button>

                <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure payment powered by Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default Checkout;

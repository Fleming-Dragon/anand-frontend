import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "../services/api";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  weight: {
    value: number;
    unit: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  finalTotal: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/orders/my-orders");
      setOrders(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-serif font-bold text-accent-800">
              My Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your jaggery orders
            </p>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500">
                  Start shopping to see your orders here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Order #
                          {order.orderNumber ||
                            order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <span className="font-semibold text-accent-800">
                          ₹{order.totalAmount + order.shippingCost}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">Payment:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {item.weight.value} {item.weight.unit} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                        <br />
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                          Tracking Number
                        </h4>
                        <p className="text-sm text-blue-700 font-mono">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      {order.status === "delivered" && (
                        <button className="px-4 py-2 text-sm font-medium text-secondary-600 border border-secondary-600 rounded-lg hover:bg-secondary-50">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

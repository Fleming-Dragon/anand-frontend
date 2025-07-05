import apiClient from './api';

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    weight: {
      value: number;
      unit: string;
    };
  }>;
  totalAmount: number;
  shippingCost: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: string;
  paymentStatus: string;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export const adminOrderService = {
  // Get all orders for admin
  getAllOrders: async (page = 1, limit = 20, status?: string): Promise<{ orders: AdminOrder[]; total: number; pages: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    const response = await apiClient.get(`/admin/orders?${params}`);
    return response.data.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string): Promise<AdminOrder> => {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, {
      status,
      trackingNumber
    });
    return response.data.data;
  },

  // Get order statistics
  getOrderStats: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
  }> => {
    const response = await apiClient.get('/admin/orders/stats');
    return response.data.data;
  }
};

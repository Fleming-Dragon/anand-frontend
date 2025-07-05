import apiClient from './api';

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const paymentService = {
  // Create Razorpay order
  createOrder: async (orderData: OrderData): Promise<PaymentOrder> => {
    const response = await apiClient.post('/payments/create-order', orderData);
    return response.data.data;
  },

  // Verify payment
  verifyPayment: async (paymentData: PaymentVerification): Promise<{ success: boolean; orderId: string }> => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return response.data.data;
  },

  // Get order status
  getOrderStatus: async (orderId: string): Promise<any> => {
    const response = await apiClient.get(`/payments/order/${orderId}`);
    return response.data.data;
  },

  // Initiate refund
  initiateRefund: async (paymentId: string, amount?: number): Promise<any> => {
    const response = await apiClient.post('/payments/refund', {
      paymentId,
      amount
    });
    return response.data.data;
  }
};

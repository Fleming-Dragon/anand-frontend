import apiClient from './api';

export interface Review {
  _id: string;
  product: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    ratingStats: Array<{
      _id: number;
      count: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateReviewData {
  product: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
    }
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/reviews/product/${productId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(url);
  },

  // Create a new review
  createReview: async (reviewData: CreateReviewData): Promise<CreateReviewResponse> => {
    return apiClient.post('/reviews', reviewData);
  },
};

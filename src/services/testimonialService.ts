import apiClient from './api';

export interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  message: string;
  avatar?: string;
  isApproved: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface TestimonialsResponse {
  success: boolean;
  data: Testimonial[];
  count: number;
}

export interface CreateTestimonialData {
  name: string;
  location?: string;
  rating: number;
  message: string;
}

export interface CreateTestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial;
}

export const testimonialService = {
  // Get all approved testimonials
  getTestimonials: async (params?: {
    featured?: boolean;
    limit?: number;
  }): Promise<TestimonialsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/testimonials${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(url);
  },

  // Get featured testimonials for homepage
  getFeaturedTestimonials: async (): Promise<TestimonialsResponse> => {
    return apiClient.get('/testimonials/featured');
  },

  // Create new testimonial
  createTestimonial: async (testimonialData: CreateTestimonialData): Promise<CreateTestimonialResponse> => {
    return apiClient.post('/testimonials', testimonialData);
  },
};

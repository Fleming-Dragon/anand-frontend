import apiClient from './api';

export interface Product {
  _id: string;
  name: string;
  category: 'jaggery-blocks' | 'jaggery-powder' | 'flavored-cubes';
  description: string;
  price: number;
  weight: {
    value: number;
    unit: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  features: string[];
  stock: number;
  isActive: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export const productService = {
  // Get all products with optional filtering
  getProducts: async (params?: {
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get all products (for admin)
  getAllProducts: async (): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products/all');
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<ProductResponse> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },

  // Create new product (admin only)
  createProduct: async (productData: Partial<Product>): Promise<ProductResponse> => {
    console.log('Payload for product creation:', productData); // Log payload
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error in createProduct API call:', error); // Log error
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<ProductResponse> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

import { useState, useEffect, useCallback } from 'react';
import { reviewService, Review } from '../services/reviewService';

interface ReviewsParams {
  productId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const useReviews = (params?: ReviewsParams) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (params?.productId) {
        const response = await reviewService.getProductReviews(params.productId, {
          page: params.page,
          limit: params.limit,
          sort: params.sort,
        });
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const submitReview = async (reviewData: {
    product: string;
    rating: number;
    comment: string;
    name: string;
    email: string;
    title: string;
  }) => {
    try {
      setError(null);
      await reviewService.createReview(reviewData);
      // Refresh reviews after submitting
      await fetchReviews();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      return false;
    }
  };

  // Create a general reviews fetcher (for homepage, etc.)
  const fetchGeneralReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // For general reviews, we'll just fetch some sample data
      // This could be a separate endpoint for featured reviews
      setReviews([]);
      setPagination(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params?.productId) {
      fetchReviews();
    } else {
      fetchGeneralReviews();
    }
  }, [fetchReviews, fetchGeneralReviews, params?.productId]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch: fetchReviews,
    submitReview,
  };
};

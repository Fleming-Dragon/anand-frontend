import { useState, useEffect, useCallback } from 'react';
import { testimonialService, Testimonial } from '../services/testimonialService';

export const useTestimonials = (params?: {
  featured?: boolean;
  limit?: number;
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialService.getTestimonials(params);
      setTestimonials(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
  };
};

export const useFeaturedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testimonialService.getFeaturedTestimonials();
        setTestimonials(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
  };
};

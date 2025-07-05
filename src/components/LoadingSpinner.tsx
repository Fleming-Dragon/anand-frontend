import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-yellow-600 ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Testimonial Card Skeleton
export const TestimonialCardSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="flex items-center mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

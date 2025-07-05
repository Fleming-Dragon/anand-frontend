import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated, show auth modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold text-accent-800 mb-2">
                Welcome to Anand Agro
              </h1>
              <p className="text-gray-600">
                Please sign in to access our premium organic jaggery products
              </p>
            </div>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-all duration-200"
            >
              Sign In / Register
            </button>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                New to Anand Agro? Create an account to explore our collection of 
                100% organic, chemical-free jaggery products.
              </p>
            </div>
          </div>
          
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </div>
      </div>
    );
  }

  // If admin-only route and user is not admin
  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              This area is restricted to administrators only.
            </p>
            <p className="text-sm text-gray-500">
              Signed in as: <span className="font-medium">{user?.fullName}</span> ({user?.role})
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

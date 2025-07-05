import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";

// Main website component that shows after authentication
const MainWebsite = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

// Authentication gate component
const AuthGate = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-lg">
                <div className="h-12 w-12 text-white flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    <path d="M9 11l3 3 7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-accent-900 mb-2">
              Welcome to Anand Agro Industry
            </h1>
            <p className="text-xl text-secondary-600 mb-6">
              Premium Organic Jaggery Products
            </p>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Please sign in to access our premium collection of organic jaggery
              products and enjoy a personalized shopping experience.
            </p>
          </div>
          <AuthModal
            isOpen={true}
            onClose={() => {}} // Empty function since this should always be open
          />
        </div>
      </div>
    );
  }

  return <MainWebsite />;
};

function App() {
  return (
    <AuthProvider>
      <AuthGate />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#DAA520",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

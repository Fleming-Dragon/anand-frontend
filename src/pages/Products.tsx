import { useState } from "react";
import { Star, Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useReviews } from "../hooks/useReviews";
import { useCart } from "../contexts/CartContext";
import { Product } from "../services/productService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Products = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    title: "",
    comment: "",
    rating: 0,
  });
  const { products = [], loading, error } = useProducts();
  const { submitReview } = useReviews();
  const { addToCart, isInCart, getCartItem } = useCart();

  const categories = [
    "All",
    "jaggery-blocks",
    "jaggery-powder",
    "flavored-cubes",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Ensure we always have a valid array for filteredProducts
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts =
    selectedCategory === "All"
      ? safeProducts
      : safeProducts.filter((product) => product.category === selectedCategory);

  const updateQuantity = (productId: string, change: number) => {
    const product = safeProducts.find((p) => p._id === productId);
    if (!product) return;

    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = currentQuantity + change;

      // Ensure quantity doesn't go below 0
      if (newQuantity < 0) return prev;

      // Ensure quantity doesn't exceed available stock
      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return prev;
      }

      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product._id] || 0;

    if (quantity === 0) {
      toast.error("Please select quantity first");
      return;
    }

    if (quantity > product.stock) {
      toast.error(
        `Cannot add ${quantity} items. Only ${product.stock} available in stock`
      );
      return;
    }

    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      addToCart(product, quantity);
      toast.success(
        `Added ${quantity} ${product.weight.unit} of ${product.name} to cart!`
      );
      // Reset quantity after adding to cart
      setQuantities((prev) => ({ ...prev, [product._id]: 0 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const success = await submitReview({
      product: "", // This would need to be dynamic based on selected product
      name: reviewForm.name,
      email: reviewForm.email,
      title: reviewForm.title,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });

    if (success) {
      toast.success("Review submitted successfully!");
      setReviewForm({
        name: "",
        email: "",
        title: "",
        comment: "",
        rating: 0,
      });
    }
  };

  const handleStarClick = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-secondary-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => `₹${price}`;

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "jaggery-blocks":
        return "Jaggery Blocks";
      case "jaggery-powder":
        return "Jaggery Powder";
      case "flavored-cubes":
        return "Flavored Cubes";
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary-500 text-white px-6 py-2 rounded-lg hover:bg-secondary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-accent-800 mb-4">
            Premium Jaggery Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our complete range of organic, chemical-free jaggery
            products
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-secondary-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-secondary-100 hover:text-secondary-700"
                }`}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory === "All"
                  ? "We're working on adding products to our catalog."
                  : `No products found in the ${getCategoryDisplayName(
                      selectedCategory
                    )} category.`}
              </p>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        product.images[0]?.url ||
                        "https://images.pexels.com/photos/7629488/pexels-photo-7629488.jpeg?auto=compress&cs=tinysrgb&w=500"
                      }
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200">
                      <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                    </button>
                    {product.stock > 0 ? (
                      <div className="absolute bottom-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {product.stock} in Stock
                      </div>
                    ) : (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-secondary-600 font-medium">
                        {getCategoryDisplayName(product.category)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(product.averageRating || 0)}
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-semibold text-accent-800 mb-3">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-accent-800">
                          {formatPrice(product.price)}/{product.weight.unit}
                        </span>
                        {product.stock > 0 && product.stock <= 5 && (
                          <p className="text-sm text-orange-600 font-medium mt-1">
                            Only {product.stock} left in stock!
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          disabled={!quantities[product._id]}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">
                          {quantities[product._id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            (quantities[product._id] || 0) >= product.stock
                          }
                          title={
                            (quantities[product._id] || 0) >= product.stock
                              ? `Maximum stock available: ${product.stock}`
                              : "Increase quantity"
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={
                          product.stock === 0 ||
                          (quantities[product._id] || 0) === 0
                        }
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                          product.stock === 0
                            ? "bg-gray-400 text-gray-600"
                            : "bg-secondary-500 text-white hover:bg-secondary-600"
                        }`}
                        title={
                          product.stock === 0
                            ? "Out of stock"
                            : (quantities[product._id] || 0) === 0
                            ? "Please select quantity"
                            : "Add to cart"
                        }
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-accent-800 mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex space-x-1">{renderStars(4.7)}</div>
              <span className="text-2xl font-bold text-accent-800">4.7/5</span>
              <span className="text-gray-600">Based on customer feedback</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Sunita Desai",
                rating: 5,
                comment:
                  "Best jaggery I've tasted! The blocks are perfectly sweet and dissolve well in milk.",
                date: "2 weeks ago",
              },
              {
                name: "Amit Kumar",
                rating: 4,
                comment:
                  "Great quality and fast delivery. The coconut cubes are my family's favorite.",
                date: "1 month ago",
              },
              {
                name: "Rekha Sharma",
                rating: 5,
                comment:
                  "Switching from sugar to this jaggery was the best decision. Highly recommended!",
                date: "3 weeks ago",
              },
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{review.comment}"
                </p>
                <p className="font-semibold text-accent-800">{review.name}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-accent-800 mb-6 text-center">
              Share Your Experience
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="Give your review a title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className={`transition-colors ${
                        star <= reviewForm.rating
                          ? "text-secondary-500"
                          : "text-gray-300 hover:text-secondary-500"
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  placeholder="Share your thoughts about our products..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;

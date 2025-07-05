import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Users,
  Leaf,
  Award,
  Star,
  Quote,
} from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProducts";
import { useFeaturedTestimonials } from "../hooks/useTestimonials";
import { ProductCardSkeleton } from "../components/LoadingSpinner";

const Home = () => {
  const { products: featuredProducts = [], loading: productsLoading } =
    useFeaturedProducts();
  const { testimonials = [] } = useFeaturedTestimonials();

  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Organic & Chemical-Free",
      description:
        "100% natural jaggery without any harmful chemicals or additives",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Traditional Processing",
      description: "Time-tested methods passed down through generations",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Stainless Steel Hygiene",
      description: "Modern hygiene standards with stainless steel equipment",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Support Local Farmers",
      description: "Directly supporting sugarcane farmers in Maharashtra",
    },
  ];

  const staticTestimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      message:
        "The quality of jaggery is exceptional! My family loves the natural sweetness and we've completely switched from sugar.",
    },
    {
      name: "Rajesh Patel",
      location: "Pune",
      rating: 5,
      message:
        "As a chef, I'm very particular about ingredients. Anand Agro's jaggery adds authentic flavor to all my traditional recipes.",
    },
    {
      name: "Meera Joshi",
      location: "Nashik",
      rating: 4,
      message:
        "Great local product! The flavored cubes are a hit with kids. Happy to support local farmers through this brand.",
    },
  ];

  // Use API data if available, otherwise fall back to static data
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : staticTestimonials;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-secondary-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-50 to-primary-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-accent-900 leading-tight">
                Experience the natural sweetness of
                <span className="text-secondary-500"> tradition</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                — with Anand Agro Industry
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover our premium collection of organic, chemical-free
                jaggery products crafted with traditional methods and modern
                hygiene standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105"
                >
                  Shop Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-secondary-500 text-secondary-500 font-semibold rounded-lg hover:bg-secondary-50 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7629488/pexels-photo-7629488.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Organic Jaggery"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-accent-800">
                      100% Organic
                    </p>
                    <p className="text-sm text-gray-600">Chemical-Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-accent-800 mb-4">
              Our Premium Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From traditional blocks to convenient powder and flavorful cubes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsLoading ? (
              // Show loading skeletons while products are loading
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "https://images.pexels.com/photos/7629488/pexels-photo-7629488.jpeg?auto=compress&cs=tinysrgb&w=400"
                        }
                        alt={product.images?.[0]?.alt || product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-semibold text-accent-800 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Show fallback message when no products available
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No featured products available at the moment.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-secondary-600 hover:text-secondary-700 font-semibold"
                >
                  View All Products →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-accent-800 mb-4">
              Why Choose Anand Agro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional wisdom with modern standards to deliver the
              finest jaggery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-accent-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-accent-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from families who trust our products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Quote className="h-8 w-8 text-secondary-500 mb-4" />
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-accent-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-accent-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-6">
            Ready to Experience Pure Sweetness?
          </h2>
          <p className="text-xl text-secondary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of families who have made the healthy switch to our
            organic jaggery products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-secondary-50 transition-all duration-200 transform hover:scale-105"
            >
              View Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

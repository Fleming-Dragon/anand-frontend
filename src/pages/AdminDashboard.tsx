import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { productService, Product } from "../services/productService";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "",
    imageAlt: "",
    features: [""],
    stock: 0,
    weight: 1,
    weightUnit: "kg",
    isActive: true,
  });

  const categories = ["jaggery-blocks", "jaggery-powder", "flavored-cubes"];

  useEffect(() => {
    console.log("🔍 AdminDashboard - Auth state check:");
    console.log("  User:", user?.email || "Not logged in");
    console.log("  Is Authenticated:", isAuthenticated);
    console.log("  Is Admin:", isAdmin);

    if (isAuthenticated && isAdmin) {
      console.log("✅ Authenticated admin - fetching products...");
      fetchProducts();
    } else {
      console.log("❌ Not authenticated admin - skipping product fetch");
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, user]);

  const fetchProducts = async () => {
    try {
      console.log("📡 Fetching all products...");
      const response = await productService.getAllProducts();
      console.log(
        "✅ Products fetched successfully - Full response:",
        response
      );
      console.log("✅ Response structure:", {
        success: response.success,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: response.data?.length,
        firstItem: response.data?.[0],
      });

      // Ensure response.data is an array before setting
      if (response && response.data && Array.isArray(response.data)) {
        console.log(
          "✅ Setting products array with",
          response.data.length,
          "items"
        );
        setProducts(response.data);
      } else {
        console.log("❌ Invalid response format, setting empty array");
        console.log("❌ Response data:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      setProducts([]); // Ensure products is always an array
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      imageAlt: "",
      features: [""],
      stock: 0,
      weight: 1,
      weightUnit: "kg",
      isActive: true,
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category as
        | "jaggery-blocks"
        | "jaggery-powder"
        | "flavored-cubes",
      weight: {
        value: formData.weight,
        unit: formData.weightUnit,
      },
      images: formData.imageUrl
        ? [
            {
              url: formData.imageUrl,
              alt: formData.imageAlt || formData.name,
            },
          ]
        : [],
      features: formData.features.filter((f) => f.trim() !== ""),
      stock: formData.stock,
      isActive: formData.isActive,
    };

    console.log("Product data being sent:", productData); // Log product data

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productData);
        toast.success("Product updated successfully");
      } else {
        const response = await productService.createProduct(productData);
        console.log("Product creation response:", response); // Log response
        toast.success("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error: unknown) {
      console.error("Error during product creation:", error); // Log error

      // Add detailed error logging
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number; headers?: unknown };
        };
        console.error("❌ Server response:", axiosError.response?.data);
        console.error("❌ Status code:", axiosError.response?.status);
        console.error("❌ Headers:", axiosError.response?.headers);

        // Show specific validation errors if available
        if (
          axiosError.response?.data &&
          typeof axiosError.response.data === "object"
        ) {
          const responseData = axiosError.response.data as {
            message?: string;
            errors?: Record<string, string>;
          };
          if (responseData.message) {
            toast.error(`Validation Error: ${responseData.message}`);
          } else if (responseData.errors) {
            const errorMessages = Object.values(responseData.errors).join(", ");
            toast.error(`Validation Errors: ${errorMessages}`);
          } else {
            toast.error("Failed to save product - validation failed");
          }
        } else {
          toast.error("Failed to save product - validation failed");
        }
      } else {
        toast.error("Failed to save product");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.images[0]?.url || "",
      imageAlt: product.images[0]?.alt || "",
      features: product.features.length > 0 ? product.features : [""],
      stock: product.stock,
      weight: product.weight?.value || 1,
      weightUnit: product.weight?.unit || "kg",
      isActive: product.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-accent-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.firstName}! Manage your products and
                inventory.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <div className="w-6 h-6 bg-green-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(products)
                    ? products.filter((p) => p.isActive).length
                    : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <div className="w-6 h-6 bg-yellow-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Featured Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(products) ? products.length : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <div className="w-6 h-6 bg-purple-600 rounded-sm"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(products.map((p) => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={
                              product.images[0]?.url ||
                              "/placeholder-product.jpg"
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-accent-800">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available quantity for customers to order
                    </p>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="1"
                        min="0"
                        step="0.1"
                      />
                      <select
                        name="weightUnit"
                        value={formData.weightUnit}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    placeholder="Describe your product..."
                    required
                  />
                </div>

                {/* Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      placeholder="Image description"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                        placeholder="Enter feature"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-secondary-600 hover:text-secondary-800 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Checkboxes */}
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

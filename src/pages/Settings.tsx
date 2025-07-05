import { useAuth } from "../contexts/AuthContext";
import { User, Lock, Bell, Shield } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-serif font-bold text-accent-800">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-accent-800 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-accent-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </h2>
              <div className="space-y-3">
                <button className="flex items-center space-x-3 w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-accent-800 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-500">
                      Get notified about your order status
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Promotional Emails
                    </p>
                    <p className="text-sm text-gray-500">
                      Receive offers and product updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

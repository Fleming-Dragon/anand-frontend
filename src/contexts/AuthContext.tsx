import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import authService, { User } from "../services/authService";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log("🔧 Initializing auth...");

      // Initialize auth service
      authService.initializeAuth();

      // Check if user is logged in
      if (authService.isAuthenticated()) {
        console.log("🔑 Token found, verifying with server...");
        const token = authService.getToken();
        console.log("📝 Token preview:", token?.substring(0, 20) + "...");

        // Verify token and get user profile
        const response = await authService.getProfile();
        if (response.success) {
          console.log(
            "✅ Token verified, user authenticated:",
            response.data.user.email
          );
          setUser(response.data.user);
        } else {
          console.log("❌ Token verification failed, clearing auth data");
          // Token is invalid, clear auth data
          authService.clearAuthData();
        }
      } else {
        console.log("🚫 No token found, user not authenticated");
      }
    } catch (error) {
      console.error("❌ Auth initialization error:", error);
      console.log("🧹 Clearing invalid auth data...");
      authService.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    identifier: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log("🔐 Attempting login with:", { identifier });
      const response = await authService.login({ identifier, password });
      console.log("📡 Login response:", response);

      if (response.success) {
        console.log(
          "✅ Login successful, setting user:",
          response.data.user.email
        );
        setUser(response.data.user);
        toast.success("Login successful!");
        return true;
      } else {
        console.log("❌ Login failed:", response.message);
        toast.error(response.message || "Login failed");
        return false;
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      let message = "Login failed";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      return false;
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const response = await authService.register(data);
      if (response.success) {
        setUser(response.data.user);
        toast.success("Registration successful!");
        return true;
      } else {
        toast.error(response.message || "Registration failed");
        return false;
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      let message = "Registration failed";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      authService.clearAuthData();
    }
  };

  const updateProfile = async (data: {
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(response.message || "Profile update failed");
        return false;
      }
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      let message = "Profile update failed";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

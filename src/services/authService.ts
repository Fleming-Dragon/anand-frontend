import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export interface LoginData {
  identifier: string; // email or username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  private tokenKey = 'anand_agro_token';
  private userKey = 'anand_agro_user';

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }
    return response.data;
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
      this.setAuthData(response.data.data.token, response.data.data.user);
    }
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user profile
  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string; data: { user: User } }> {
    const response = await api.put('/auth/profile', data);
    if (response.data.success) {
      this.setUser(response.data.data.user);
    }
    return response.data;
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }

  // Get all users (admin only)
  async getAllUsers(page = 1, limit = 10): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        current: number;
        pages: number;
        total: number;
      };
    };
  }> {
    const response = await api.get(`/auth/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Token and user management
  setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    // Set axios default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete api.defaults.headers.common['Authorization'];
  }

  // Initialize auth on app start
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export default new AuthService();

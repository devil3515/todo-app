import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  token: string;
  key?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const authService = {
  /**
   * Authenticate user with Django backend
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      
      // Django REST Framework typically returns token in this format
      const token = response.data.token || response.data.key;
      const user = response.data.user;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw for error handling in components
    }
  },

  /**
   * Register new user with Django backend
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // ✅ Send full data including password_confirm
      const response = await api.post<AuthResponse>('/auth/register/', data);
  
      // Optional: store token if registration logs in automatically
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
  
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  

logout: async (): Promise<void> => {
  await api.post('/auth/logout/');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
},

  /**
   * Get current authenticated user from localStorage
   */
  getCurrentUser: (): { id: number; username: string; email: string } | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Failed to parse user data', e);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },

  /**
   * Get auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

export default authService;
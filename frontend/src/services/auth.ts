import { apiClient } from '../api/client';
import { UserInfo } from '../types/user';

// Authentication service interface
export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<any> | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<UserInfo> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Get user information
      const user = await this.getCurrentUser();
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<UserInfo> {
    try {
      const user = await apiClient.post<UserInfo>('/auth/signup', data);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearLocalAuthData();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserInfo> {
    try {
      const user = await apiClient.get<UserInfo>('/auth/me');
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('Failed to get user information.');
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = apiClient.post<AuthResponse>('/auth/refresh');

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Change user password
   */
  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', data);
    } catch (error) {
      console.error('Password change failed:', error);
      throw new Error('Password change failed. Please check your current password.');
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate session and refresh if needed
   */
  async validateSession(): Promise<boolean> {
    try {
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        // Try to refresh token
        await this.refreshToken();
        return await this.isAuthenticated();
      }
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  /**
   * Update user activity timestamp
   */
  updateActivity(): void {
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(timeoutMinutes: number = 60): boolean {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return true;

    const now = Date.now();
    const timeSinceLastActivity = (now - parseInt(lastActivity)) / (1000 * 60); // minutes
    
    return timeSinceLastActivity > timeoutMinutes;
  }

  /**
   * Get session timeout remaining time
   */
  getSessionTimeRemaining(timeoutMinutes: number = 60): number {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return 0;

    const now = Date.now();
    const timeSinceLastActivity = (now - parseInt(lastActivity)) / (1000 * 60); // minutes
    
    return Math.max(0, timeoutMinutes - timeSinceLastActivity);
  }

  /**
   * Clear all local authentication data
   */
  clearLocalAuthData(): void {
    // Clear localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('session');
    
    // Clear sessionStorage items
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tempData');
    
    // Clear any other auth-related data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_session');
  }

  /**
   * Store user data locally
   */
  storeUserData(user: UserInfo): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.updateActivity();
  }

  /**
   * Get stored user data
   */
  getStoredUserData(): UserInfo | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      return JSON.parse(userData) as UserInfo;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      return null;
    }
  }

  /**
   * Initialize authentication state
   */
  async initializeAuth(): Promise<UserInfo | null> {
    try {
      // Check if we have stored user data
      const storedUser = this.getStoredUserData();
      if (!storedUser) return null;

      // Check if session is expired
      if (this.isSessionExpired()) {
        this.clearLocalAuthData();
        return null;
      }

      // Validate session with server
      const isValid = await this.validateSession();
      if (!isValid) {
        this.clearLocalAuthData();
        return null;
      }

      // Update activity
      this.updateActivity();
      
      return storedUser;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.clearLocalAuthData();
      return null;
    }
  }

  /**
   * Set up session monitoring
   */
  setupSessionMonitoring(timeoutMinutes: number = 60): void {
    // Check session every minute
    setInterval(() => {
      if (this.isSessionExpired(timeoutMinutes)) {
        console.warn('Session expired, logging out...');
        this.logout();
      }
    }, 60000); // 1 minute

    // Update activity on user interaction
    const updateActivity = () => this.updateActivity();
    
    // Listen for user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Update activity on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
      }
    });
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    // Since we're using cookies, we don't need to manually add auth headers
    // The API client handles this automatically with withCredentials: true
    return {};
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 